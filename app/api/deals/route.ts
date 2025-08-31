import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Get ALL deals without filtering
    let query = supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: deals, error } = await query

    if (error) {
      console.error('Error fetching deals:', error)
      return NextResponse.json(
        { error: 'Failed to fetch deals' },
        { status: 500 }
      )
    }

    return NextResponse.json({ deals })
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
    
    // Use default company ID if not provided
    const companyId = body.companyId || 'de19ccb7-e90d-4507-861d-a3aecf5e3f29'

    const dealData = {
      ...body,
      company_id: companyId,
      created_by: 'System',
      updated_by: 'System'
    }

    const { data: deal, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select()
      .single()

    if (error) {
      console.error('Error creating deal:', error)
      return NextResponse.json(
        { error: 'Failed to create deal' },
        { status: 500 }
      )
    }

    return NextResponse.json({ deal })
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

    const dealData = {
      ...updateData,
      updated_by: 'System'
    }

    const { data: deal, error } = await supabase
      .from('deals')
      .update(dealData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating deal:', error)
      return NextResponse.json(
        { error: 'Failed to update deal' },
        { status: 500 }
      )
    }

    // Auto-create activity if next_followup_date is set
    if (deal.next_followup_date && deal.contact_person) {
      try {
        await supabase.from('activities').insert({
          company_id: deal.company_id,
          activity_type: deal.stage === 'Proposal' ? 'demo' : 'call',
          title: `Follow up ${deal.stage} stage with ${deal.contact_person}`,
          description: `${deal.stage} stage: ${deal.product} deal worth ₹${deal.value?.toLocaleString()}`,
          entity_type: 'deal',
          entity_id: deal.id,
          entity_name: deal.account_name,
          contact_name: deal.contact_person,
          contact_phone: deal.phone,
          contact_email: deal.email,
          scheduled_date: deal.next_followup_date,
          due_date: deal.next_followup_date,
          priority: deal.probability >= 80 ? 'high' : 'medium',
          assigned_to: deal.assigned_to,
          status: 'pending'
        })
      } catch (activityError) {
        console.error('Error auto-creating deal activity:', activityError)
      }
    }

    return NextResponse.json({ deal })
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
        { error: 'Deal ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting deal:', error)
      return NextResponse.json(
        { error: 'Failed to delete deal' },
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