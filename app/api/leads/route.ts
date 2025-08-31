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

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error in leads GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, ...leadData } = body

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    // Prepare lead data for insertion
    const leadToInsert = {
      ...leadData,
      company_id: companyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Remove any undefined or null fields that shouldn't be stored
    Object.keys(leadToInsert).forEach(key => {
      if (leadToInsert[key] === undefined || leadToInsert[key] === '') {
        leadToInsert[key] = null
      }
    })

    const { data: newLead, error } = await supabase
      .from('leads')
      .insert([leadToInsert])
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
    }

    // Auto-create activity if next_followup_date is set
    if (newLead.next_followup_date && newLead.contact_name) {
      try {
        await supabase.from('activities').insert({
          company_id: companyId,
          user_id: leadData.assigned_to_user_id,
          activity_type: 'call',
          title: `Follow up with ${newLead.contact_name}`,
          description: `Follow up on ${newLead.product_name} inquiry from ${newLead.account_name}`,
          entity_type: 'lead',
          entity_id: newLead.id,
          entity_name: newLead.account_name,
          contact_name: newLead.contact_name,
          contact_phone: newLead.phone,
          contact_email: newLead.email,
          scheduled_date: newLead.next_followup_date,
          due_date: newLead.next_followup_date,
          priority: newLead.priority === 'High' ? 'high' : 'medium',
          assigned_to: newLead.assigned_to,
          status: 'pending'
        })
      } catch (activityError) {
        console.error('Error auto-creating activity:', activityError)
      }
    }

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error('Error in leads POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, companyId, ...leadData } = body

    if (!id || !companyId) {
      return NextResponse.json({ error: 'Lead ID and Company ID are required' }, { status: 400 })
    }

    // Prepare lead data for update
    const leadToUpdate = {
      ...leadData,
      updated_at: new Date().toISOString()
    }

    // Remove any undefined fields
    Object.keys(leadToUpdate).forEach(key => {
      if (leadToUpdate[key] === undefined || leadToUpdate[key] === '') {
        leadToUpdate[key] = null
      }
    })

    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update(leadToUpdate)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
    }

    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
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

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error('Error in leads PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}