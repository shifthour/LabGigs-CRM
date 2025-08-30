import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const accountId = searchParams.get('accountId')
    const search = searchParams.get('search')
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }
    
    // Build query - first try with join, fallback to simple query
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Apply filters
    if (accountId) {
      query = query.eq('account_id', accountId)
    }
    
    if (search) {
      query = query.or(`contact_name.ilike.%${search}%,email.ilike.%${search}%,department.ilike.%${search}%`)
    }
    
    if (department && department !== 'All') {
      query = query.eq('department', department)
    }
    
    if (status && status !== 'All') {
      query = query.eq('status', status)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching contacts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Get unique account IDs from contacts
    const accountIds = [...new Set((data || []).map(c => c.account_id).filter(Boolean))]
    
    // Fetch account details separately
    let accountsMap: any = {}
    if (accountIds.length > 0) {
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('id, account_name, website, billing_street, billing_city, billing_state')
        .in('id', accountIds)
      
      if (accountsData) {
        accountsMap = accountsData.reduce((acc, account) => {
          acc[account.id] = account
          return acc
        }, {})
      }
    }
    
    // Transform data to match frontend format
    const contacts = (data || []).map(contact => {
      const account = accountsMap[contact.account_id] || {}
      return {
        id: contact.id,
        accountId: contact.account_id,
        accountName: account.account_name || '',
        contactName: contact.contact_name,
        department: contact.department,
        position: contact.position,
        phone: contact.phone,
        email: contact.email,
        website: account.website || '',
        address: contact.address || '',
        city: account.billing_city || '',
        state: account.billing_state || '',
        assignedTo: contact.assigned_to,
        status: contact.status,
        createdAt: contact.created_at
      }
    })
    
    return NextResponse.json({
      contacts,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
    
  } catch (error: any) {
    console.error('GET contacts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, accountName, ...contactData } = body
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }
    
    if (!contactData.contactName) {
      return NextResponse.json({ error: 'Contact name is required' }, { status: 400 })
    }
    
    if (!accountName) {
      return NextResponse.json({ error: 'Account is required' }, { status: 400 })
    }
    
    // Find the account ID from account name
    const { data: accountData } = await supabase
      .from('accounts')
      .select('id')
      .eq('company_id', companyId)
      .eq('account_name', accountName)
      .single()
    
    if (!accountData) {
      return NextResponse.json({ error: 'Account not found' }, { status: 400 })
    }
    
    // Check for duplicate contact (same name and email in same account)
    if (contactData.email) {
      const { data: existing } = await supabase
        .from('contacts')
        .select('id')
        .eq('company_id', companyId)
        .eq('account_id', accountData.id)
        .eq('email', contactData.email)
        .single()
      
      if (existing) {
        return NextResponse.json({ 
          error: `A contact with email "${contactData.email}" already exists for this account` 
        }, { status: 400 })
      }
    }
    
    // Create contact
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        company_id: companyId,
        account_id: accountData.id,
        contact_name: contactData.contactName,
        department: contactData.department || null,
        position: contactData.position || null,
        phone: contactData.phone || null,
        email: contactData.email || null,
        address: contactData.address || null,
        assigned_to: contactData.assignedTo || null,
        status: contactData.status || 'Active',
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Contact created successfully',
      contact: data 
    })
    
  } catch (error: any) {
    console.error('POST contact error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, companyId, accountName, ...contactData } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 })
    }
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }
    
    let updateData: any = {
      contact_name: contactData.contactName,
      department: contactData.department || null,
      position: contactData.position || null,
      phone: contactData.phone || null,
      email: contactData.email || null,
      address: contactData.address || null,
      assigned_to: contactData.assignedTo || null,
      status: contactData.status || 'Active',
      updated_at: new Date().toISOString()
    }
    
    // If account changed, find new account ID
    if (accountName) {
      const { data: accountData } = await supabase
        .from('accounts')
        .select('id')
        .eq('company_id', companyId)
        .eq('account_name', accountName)
        .single()
      
      if (!accountData) {
        return NextResponse.json({ error: 'Account not found' }, { status: 400 })
      }
      
      updateData.account_id = accountData.id
    }
    
    // Update contact
    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Contact updated successfully',
      contact: data 
    })
    
  } catch (error: any) {
    console.error('PUT contact error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const companyId = searchParams.get('companyId')
    
    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 })
    }
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }
    
    // Delete contact
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)
    
    if (error) {
      console.error('Error deleting contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Contact deleted successfully' })
    
  } catch (error: any) {
    console.error('DELETE contact error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}