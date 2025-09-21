import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    let query = supabase
      .from('amc_contracts')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: amcContracts, error } = await query

    if (error) {
      console.error('Error fetching AMC contracts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch AMC contracts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ amcContracts })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('=== AMC API RECEIVED ===')
    console.log('service_frequency:', body.service_frequency)
    console.log('Full body keys:', Object.keys(body))
    
    const companyId = body.companyId || 'de19ccb7-e90d-4507-861d-a3aecf5e3f29'

    const amcData = {
      ...body,
      company_id: companyId,
      created_by: 'f41e509a-4c92-4baa-bca2-ab1d3410e465',
      updated_by: 'f41e509a-4c92-4baa-bca2-ab1d3410e465'
    }
    
    console.log('AMC data service_frequency before insert:', amcData.service_frequency)

    const { data: amcContract, error } = await supabase
      .from('amc_contracts')
      .insert([amcData])
      .select()
      .single()

    if (error) {
      console.error('Error creating AMC contract:', error)
      return NextResponse.json(
        { error: 'Failed to create AMC contract' },
        { status: 500 }
      )
    }

    return NextResponse.json({ amcContract })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const amcData = {
      ...updateData,
      updated_by: 'f41e509a-4c92-4baa-bca2-ab1d3410e465'
    }

    const { data: amcContract, error } = await supabase
      .from('amc_contracts')
      .update(amcData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating AMC contract:', error)
      return NextResponse.json(
        { error: 'Failed to update AMC contract' },
        { status: 500 }
      )
    }

    return NextResponse.json({ amcContract })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'AMC contract ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('amc_contracts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting AMC contract:', error)
      return NextResponse.json(
        { error: 'Failed to delete AMC contract' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}