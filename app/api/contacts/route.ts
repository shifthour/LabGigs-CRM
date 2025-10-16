import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    // Fetch contacts with owner and account information
    let query = supabase
      .from('contacts')
      .select(`
        *,
        owner:users!contacts_owner_id_fkey(id, full_name, email),
        account:accounts!contacts_account_id_fkey(id, account_name)
      `, { count: 'exact' })
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching contacts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      contacts: data || [],
      total: count || 0
    })
  } catch (error: any) {
    console.error('GET contacts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, userId, accountId, ...contactData } = body

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    // Validate mandatory fields
    const requiredFields = ['first_name', 'last_name', 'email_primary', 'phone_mobile', 'lifecycle_stage']
    for (const field of requiredFields) {
      if (!contactData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Get account name if account_id is provided
    let companyName = contactData.company_name
    if (accountId) {
      const { data: accountData } = await supabase
        .from('accounts')
        .select('account_name')
        .eq('id', accountId)
        .single()

      if (accountData) {
        companyName = accountData.account_name
      }
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        company_id: companyId,
        account_id: accountId || null,
        owner_id: userId || null,
        created_by: userId || null,
        company_name: companyName,
        ...contactData
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('POST contact error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, accountId, ...contactData } = body

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 })
    }

    // Get account name if account_id is provided
    let companyName = contactData.company_name
    if (accountId) {
      const { data: accountData } = await supabase
        .from('accounts')
        .select('account_name')
        .eq('id', accountId)
        .single()

      if (accountData) {
        companyName = accountData.account_name
      }
    }

    const { data, error } = await supabase
      .from('contacts')
      .update({
        account_id: accountId || null,
        company_name: companyName,
        ...contactData,
        modified_date: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('PUT contact error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

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
