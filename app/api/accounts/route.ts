import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const search = searchParams.get('search')
    const industry = searchParams.get('industry')
    const city = searchParams.get('city')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }
    
    // Build query
    let query = supabase
      .from('accounts')
      .select(`
        *,
        owner:owner_id(id, full_name, email)
      `, { count: 'exact' })
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Apply filters
    if (search) {
      query = query.or(`account_name.ilike.%${search}%,billing_city.ilike.%${search}%,website.ilike.%${search}%`)
    }
    
    if (industry) {
      query = query.eq('industry', industry)
    }
    
    if (city) {
      query = query.eq('billing_city', city)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching accounts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      accounts: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
    
  } catch (error: any) {
    console.error('GET accounts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, ...accountData } = body
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }
    
    if (!accountData.account_name) {
      return NextResponse.json({ error: 'Account name is required' }, { status: 400 })
    }
    
    // Check for duplicate (same name AND city)
    const { data: existing } = await supabase
      .from('accounts')
      .select('id')
      .eq('company_id', companyId)
      .eq('account_name', accountData.account_name)
      .eq('billing_city', accountData.billing_city || '')
      .single()
    
    if (existing) {
      return NextResponse.json({ 
        error: `An account with name "${accountData.account_name}" already exists in ${accountData.billing_city || 'this city'}` 
      }, { status: 400 })
    }
    
    // Create account
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        company_id: companyId,
        ...accountData
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating account:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data, { status: 201 })
    
  } catch (error: any) {
    console.error('POST account error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating account:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('PUT account error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting account:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error: any) {
    console.error('DELETE account error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}