import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/admin/companies - Get all companies (Super Admin only) or single company by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    if (companyId) {
      // Get single company by ID
      const result = await db.getCompanyById(companyId)
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        )
      }

      return NextResponse.json(result.data)
    } else {
      // Get all companies
      const result = await db.getAllCompanies()
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        )
      }

      return NextResponse.json(result.data)
    }
  } catch (error) {
    console.error('Get companies error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/companies - Create new company with admin user (Super Admin only)
export async function POST(request: NextRequest) {
  try {
    const { name, adminName, adminEmail, adminPassword, maxUsers } = await request.json()

    // Validate input
    if (!name || !adminName || !adminEmail || !adminPassword || !maxUsers || maxUsers < 5) {
      return NextResponse.json(
        { error: 'Invalid input. Name, admin name, admin email, password required. Minimum 5 users.' },
        { status: 400 }
      )
    }

    // Create company with admin user
    const result = await db.createCompanyWithAdmin({
      name,
      adminName,
      adminEmail,
      adminPassword,
      maxUsers: parseInt(maxUsers)
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Create notification for super admin about new company
    await db.createNotification({
      title: 'New Company Created',
      message: `Company "${name}" has been created with admin ${adminName} (${adminEmail})`,
      type: 'success',
      entityType: 'company',
      entityId: result.data.company.id
    })

    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    console.error('Create company error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/companies - Update company
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, ...updateData } = body

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    const result = await db.updateCompany(companyId, updateData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Update company error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/companies - Delete company
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Get company details before deletion for notification
    const { data: companies } = await db.getAllCompanies()
    const companyToDelete = companies?.find(c => c.id === companyId)
    
    const result = await db.deleteCompany(companyId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Create notification for super admin about company deletion
    if (companyToDelete) {
      await db.createNotification({
        title: 'Company Deleted',
        message: `Company "${companyToDelete.name}" has been permanently deleted`,
        type: 'warning',
        entityType: 'company',
        entityId: companyId
      })
    }

    return NextResponse.json({ message: 'Company deleted successfully' })
  } catch (error) {
    console.error('Delete company error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}