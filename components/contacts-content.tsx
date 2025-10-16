"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Mail, Phone, User, Users, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Contact {
  id: string
  contact_id?: string
  first_name: string
  last_name: string
  email_primary: string
  phone_mobile: string
  company_name?: string
  job_title?: string
  lifecycle_stage: string
  current_contact_status: string
  created_at?: string
  account?: {
    account_name: string
    customer_segment?: string
    account_type?: string
    acct_industry?: string
    acct_sub_industry?: string
    billing_city?: string
    billing_state?: string
    billing_country?: string
    main_phone?: string
    primary_email?: string
    website?: string
  }
}

export function ContactsContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    leads: 0,
    customers: 0
  })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const user = localStorage.getItem('user')
      if (!user) {
        router.push('/login')
        return
      }

      const parsedUser = JSON.parse(user)
      const response = await fetch(`/api/contacts?companyId=${parsedUser.company_id}&limit=1000`)

      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])

        // Calculate stats
        const activeContacts = data.contacts.filter((c: Contact) => c.current_contact_status === 'Active')
        const leads = data.contacts.filter((c: Contact) => c.lifecycle_stage?.includes('Lead'))
        const customers = data.contacts.filter((c: Contact) => c.lifecycle_stage === 'Customer')

        setStats({
          total: data.contacts.length,
          active: activeContacts.length,
          leads: leads.length,
          customers: customers.length
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to load contacts",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditContact = (contactId: string) => {
    router.push(`/contacts/edit/${contactId}`)
  }

  const filteredContacts = contacts.filter(contact =>
    contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email_primary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your contacts and relationships</p>
        </div>
        <Button onClick={() => router.push('/contacts/add')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">{stats.active}</span>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange-600">{stats.leads}</span>
              <Building2 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-600">{stats.customers}</span>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search contacts by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts List</CardTitle>
          <CardDescription>
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first contact'}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/contacts/add')} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">
                          {contact.first_name} {contact.last_name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.current_contact_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contact.current_contact_status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{contact.job_title || 'No title'}</p>
                      {contact.company_name && (
                        <p className="text-xs text-gray-500 mt-1">
                          <Building2 className="w-3 h-3 inline mr-1" />
                          {contact.company_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Center section - Account & Contact details in 3 columns */}
                  <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-1 px-6">
                    {/* Column 1: Account Business Info */}
                    <div className="space-y-1">
                      {contact.account?.customer_segment && (
                        <div className="text-xs">
                          <span className="text-gray-500">Segment:</span>
                          <span className="ml-2 text-gray-900">{contact.account.customer_segment}</span>
                        </div>
                      )}
                      {contact.account?.account_type && (
                        <div className="text-xs">
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 text-gray-900">{contact.account.account_type}</span>
                        </div>
                      )}
                      {contact.lifecycle_stage && (
                        <div className="text-xs">
                          <span className="text-gray-500">Stage:</span>
                          <span className="ml-2 text-gray-900">{contact.lifecycle_stage}</span>
                        </div>
                      )}
                    </div>

                    {/* Column 2: Account Industry & Location */}
                    <div className="space-y-1">
                      {contact.account?.acct_industry && (
                        <div className="text-xs">
                          <span className="text-gray-500">Industry:</span>
                          <span className="ml-2 text-gray-900">{contact.account.acct_industry}</span>
                        </div>
                      )}
                      {contact.account?.acct_sub_industry && (
                        <div className="text-xs">
                          <span className="text-gray-500">Sub-Industry:</span>
                          <span className="ml-2 text-gray-900">{contact.account.acct_sub_industry}</span>
                        </div>
                      )}
                      {(contact.account?.billing_city || contact.account?.billing_state || contact.account?.billing_country) && (
                        <div className="text-xs">
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-2 text-gray-900">
                            {[contact.account.billing_city, contact.account.billing_state, contact.account.billing_country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Column 3: Contact Information */}
                    <div className="space-y-1">
                      {contact.email_primary && (
                        <div className="text-xs flex items-center">
                          <Mail className="w-3 h-3 mr-1 text-gray-500" />
                          <span className="text-gray-900">{contact.email_primary}</span>
                        </div>
                      )}
                      {contact.phone_mobile && (
                        <div className="text-xs flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-gray-500" />
                          <span className="text-gray-900">{contact.phone_mobile}</span>
                        </div>
                      )}
                      {contact.account?.website && (
                        <div className="text-xs flex items-center">
                          <Building2 className="w-3 h-3 mr-1 text-gray-500" />
                          <span className="text-blue-600">{contact.account.website}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right section - Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditContact(contact.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
