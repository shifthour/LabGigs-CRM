import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get ALL leads without filtering by company_id
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
    }

    // Merge custom_fields back into the main lead object
    const leadsWithCustomFields = leads?.map(lead => {
      if (lead.custom_fields && typeof lead.custom_fields === 'object') {
        const { custom_fields, ...restLead } = lead
        return { ...restLead, ...custom_fields }
      }
      return lead
    })

    return NextResponse.json(leadsWithCustomFields)
  } catch (error) {
    console.error('Error in leads GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Define standard fields that exist in the leads table schema
// Based on complete_leads_table_setup.sql
const STANDARD_LEAD_FIELDS = [
  'account_id', 'account_name', 'contact_id', 'contact_name', 'department',
  'phone', 'email', 'whatsapp', 'lead_source', 'product_id', 'product_name',
  'lead_status', 'priority', 'assigned_to', 'lead_date', 'closing_date',
  'budget', 'quantity', 'price_per_unit', 'location', 'city', 'state',
  'country', 'address', 'buyer_ref', 'expected_closing_date',
  'next_followup_date', 'notes'
  // Note: All other fields like job_title, consent_status, lead_stage, etc.
  // will be stored in the custom_fields JSONB column
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, userId, selected_products, ...leadData } = body

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    // Fetch enabled field configurations for this company
    const { data: fieldConfigs, error: configError } = await supabase
      .from('lead_field_configurations')
      .select('field_name, is_enabled')
      .eq('company_id', companyId)
      .eq('is_enabled', true)

    if (configError) {
      console.error('Error fetching field configurations:', configError)
      return NextResponse.json({
        error: 'Failed to load field configurations',
        details: configError.message
      }, { status: 500 })
    }

    // Get list of enabled field names
    const enabledFieldNames = new Set(
      (fieldConfigs || []).map(config => config.field_name)
    )

    // Separate standard fields from custom fields
    // Only include fields that are enabled in the configuration
    const standardFields: any = {}
    const customFields: any = {}

    Object.keys(leadData).forEach(key => {
      // Only process fields that are enabled
      if (enabledFieldNames.has(key)) {
        const value = leadData[key]
        const cleanedValue = (value === '' || value === undefined) ? null :
                           (typeof value === 'string' && value.trim() === '') ? null : value

        if (STANDARD_LEAD_FIELDS.includes(key)) {
          standardFields[key] = cleanedValue
        } else {
          // Store non-standard fields in custom_fields
          customFields[key] = cleanedValue
        }
      }
    })

    // Build insert data with only enabled fields
    const leadToInsert: any = {
      company_id: companyId,
      ...standardFields
    }

    // Add custom_fields if there are any
    if (Object.keys(customFields).length > 0) {
      leadToInsert.custom_fields = customFields
    }

    console.log('Attempting to insert lead:', leadToInsert)
    console.log('Custom fields:', customFields)

    const { data: newLead, error } = await supabase
      .from('leads')
      .insert([leadToInsert])
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))

      return NextResponse.json({
        error: error.message || 'Failed to create lead',
        details: error.details || `Error code: ${error.code || 'UNKNOWN'}`,
        hint: error.hint || 'Check the lead field configuration to ensure all fields are properly set up',
        code: error.code
      }, { status: 500 })
    }

    // Insert selected products into lead_products table
    if (selected_products && selected_products.length > 0) {
      const leadProducts = selected_products.map((product: any) => ({
        lead_id: newLead.id,
        product_id: product.product_id,
        product_name: product.product_name,
        quantity: product.quantity,
        price_per_unit: product.price_per_unit,
        notes: product.notes || null
      }))

      const { error: productsError } = await supabase
        .from('lead_products')
        .insert(leadProducts)

      if (productsError) {
        console.error('Error inserting lead products:', productsError)
        // Don't fail the entire operation, just log the error
      }
    }

    // Auto-create activity if next_followup_date is set
    if (newLead.next_followup_date) {
      try {
        // Build contact name from first_name and last_name if available
        const contactName = newLead.first_name && newLead.last_name
          ? `${newLead.first_name} ${newLead.last_name}`.trim()
          : newLead.contact_name || 'Contact'

        await supabase.from('activities').insert({
          company_id: companyId,
          user_id: leadData.assigned_to_user_id || leadData.userId,
          activity_type: 'call',
          title: `Follow up with ${contactName}`,
          description: `Follow up on lead inquiry`,
          entity_type: 'lead',
          entity_id: newLead.id,
          entity_name: newLead.account || newLead.account_name || 'Lead',
          contact_name: contactName,
          contact_phone: newLead.phone_number || newLead.phone,
          contact_email: newLead.email_address || newLead.email,
          scheduled_date: newLead.next_followup_date,
          due_date: newLead.next_followup_date,
          priority: (newLead.priority_level || newLead.priority) === 'High' ? 'high' : 'medium',
          assigned_to: newLead.assigned_to,
          status: 'pending'
        })
      } catch (activityError) {
        console.error('Error auto-creating activity:', activityError)
      }
    }

    // Merge custom_fields back into the response
    let leadResponse = newLead
    if (newLead.custom_fields && typeof newLead.custom_fields === 'object') {
      const { custom_fields, ...restLead } = newLead
      leadResponse = { ...restLead, ...custom_fields }
    }

    return NextResponse.json(leadResponse, { status: 201 })
  } catch (error) {
    console.error('Error in leads POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, companyId, selected_products, ...leadData } = body

    if (!id || !companyId) {
      return NextResponse.json({ error: 'Lead ID and Company ID are required' }, { status: 400 })
    }

    // Fetch enabled field configurations for this company
    const { data: fieldConfigs, error: configError } = await supabase
      .from('lead_field_configurations')
      .select('field_name, is_enabled')
      .eq('company_id', companyId)
      .eq('is_enabled', true)

    let enabledFieldNames: Set<string> | null = null
    if (!configError && fieldConfigs) {
      enabledFieldNames = new Set(
        fieldConfigs.map(config => config.field_name)
      )
    }

    // Separate standard fields from custom fields
    // Only include fields that are enabled in the configuration
    const standardFields: any = {}
    const customFields: any = {}

    Object.keys(leadData).forEach(key => {
      // If we have field configurations, only process enabled fields
      if (!enabledFieldNames || enabledFieldNames.has(key)) {
        const value = leadData[key]
        const cleanedValue = (value === '' || value === undefined) ? null :
                           (typeof value === 'string' && value.trim() === '') ? null : value

        if (STANDARD_LEAD_FIELDS.includes(key)) {
          standardFields[key] = cleanedValue
        } else {
          // Store non-standard fields in custom_fields
          customFields[key] = cleanedValue
        }
      }
    })

    // Build update data
    const leadToUpdate: any = {
      ...standardFields
    }

    // Add custom_fields if there are any
    if (Object.keys(customFields).length > 0) {
      leadToUpdate.custom_fields = customFields
    }

    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update(leadToUpdate)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      console.error('Update data:', JSON.stringify(leadToUpdate, null, 2))

      return NextResponse.json({
        error: error.message || 'Failed to update lead',
        details: error.details || `Error code: ${error.code || 'UNKNOWN'}`,
        hint: error.hint || 'Check the lead field configuration to ensure all fields are properly set up',
        code: error.code
      }, { status: 500 })
    }

    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Merge custom_fields back into the response
    let leadResponse = updatedLead
    if (updatedLead.custom_fields && typeof updatedLead.custom_fields === 'object') {
      const { custom_fields, ...restLead } = updatedLead
      leadResponse = { ...restLead, ...custom_fields }
    }

    // Update selected products in lead_products table
    if (selected_products && selected_products.length > 0) {
      // First, delete existing products for this lead
      await supabase
        .from('lead_products')
        .delete()
        .eq('lead_id', id)

      // Then insert the new products
      const leadProducts = selected_products.map((product: any) => ({
        lead_id: id,
        product_id: product.product_id,
        product_name: product.product_name,
        quantity: product.quantity,
        price_per_unit: product.price_per_unit,
        notes: product.notes || null
      }))

      const { error: productsError } = await supabase
        .from('lead_products')
        .insert(leadProducts)

      if (productsError) {
        console.error('Error updating lead products:', productsError)
        // Don't fail the entire operation, just log the error
      }
    }

    // Auto-create activity if next_followup_date is set and this is a new follow-up date
    if (updatedLead.next_followup_date && updatedLead.contact_name && leadData.next_followup_date) {
      try {
        await supabase.from('activities').insert({
          company_id: companyId,
          user_id: leadData.assigned_to_user_id,
          activity_type: updatedLead.lead_status === 'Contacted' ? 'follow-up' : 'call',
          title: `Follow up with ${updatedLead.contact_name}`,
          description: `${updatedLead.lead_status} lead: ${updatedLead.product_name} inquiry from ${updatedLead.account_name}`,
          entity_type: 'lead',
          entity_id: updatedLead.id,
          entity_name: updatedLead.account_name,
          contact_name: updatedLead.contact_name,
          contact_phone: updatedLead.phone,
          contact_email: updatedLead.email,
          scheduled_date: updatedLead.next_followup_date,
          due_date: updatedLead.next_followup_date,
          priority: updatedLead.priority === 'High' ? 'high' : 'medium',
          assigned_to: updatedLead.assigned_to,
          status: 'pending'
        })
      } catch (activityError) {
        console.error('Error auto-creating follow-up activity:', activityError)
      }
    }

    return NextResponse.json(leadResponse)
  } catch (error) {
    console.error('Error in leads PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}