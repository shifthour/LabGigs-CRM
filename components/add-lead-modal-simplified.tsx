"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Save, X, Search, ChevronDown, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AddLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (leadData: any) => Promise<void>
  editingLead?: any
}

interface Account {
  id: string
  accountName: string
  contactName: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  address: string
}

interface Contact {
  id: string
  contactName: string
  accountName: string
  department: string
  phone: string
  email: string
  address: string
}

interface Product {
  id: string
  productName: string
  category: string
  price: number
}

interface User {
  id: string
  full_name: string
  email: string
  is_admin: boolean
}

const leadSources = [
  "Website",
  "Referral",
  "Social Media",
  "Email Campaign",
  "Trade Show",
  "Cold Call",
  "Partner",
  "Direct Mail",
  "Conference",
  "Other"
]

const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Disqualified"
]

export function AddLeadModalSimplified({ isOpen, onClose, onSave, editingLead }: AddLeadModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  
  // Search states for dropdowns
  const [accountSearchOpen, setAccountSearchOpen] = useState(false)
  const [contactSearchOpen, setContactSearchOpen] = useState(false)
  const [productSearchOpen, setProductSearchOpen] = useState(false)
  const [accountSearch, setAccountSearch] = useState("")
  const [contactSearch, setContactSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")
  
  // Form data
  const [formData, setFormData] = useState({
    accountId: "",
    accountName: "",
    contactId: "",
    contactName: "",
    department: "",
    phone: "",
    email: "",
    leadSource: "",
    productId: "",
    productName: "",
    leadStatus: "New",
    budget: "",
    quantity: "",
    pricePerUnit: "",
    expectedClosingDate: "",
    nextFollowupDate: "",
    city: "",
    state: "",
    country: "",
    address: "",
    assignedTo: "",
    notes: ""
  })

  // Load data on mount
  useEffect(() => {
    loadAccounts()
    loadContacts()
    loadProducts()
    loadUsers()
  }, [])

  // Populate form when editing
  useEffect(() => {
    if (editingLead) {
      setFormData({
        accountId: editingLead.accountId || "",
        accountName: editingLead.accountName || editingLead.leadName || "",
        contactId: editingLead.contactId || "",
        contactName: editingLead.contactName || "",
        department: editingLead.department || "",
        phone: editingLead.phone || editingLead.contactNo || "",
        email: editingLead.email || "",
        leadSource: editingLead.leadSource || "",
        productId: editingLead.productId || "",
        productName: editingLead.productName || editingLead.product || "",
        leadStatus: editingLead.leadStatus || editingLead.salesStage || "New",
        budget: editingLead.budget || "",
        quantity: editingLead.quantity || "",
        pricePerUnit: editingLead.pricePerUnit || "",
        expectedClosingDate: editingLead.expectedClosingDate || "",
        nextFollowupDate: editingLead.nextFollowupDate || "",
        city: editingLead.city || "",
        state: editingLead.state || "",
        country: editingLead.country || "",
        address: editingLead.address || "",
        assignedTo: editingLead.assignedTo || "",
        notes: editingLead.notes || ""
      })
    } else {
      // Reset form for new lead
      setFormData({
        accountId: "",
        accountName: "",
        contactId: "",
        contactName: "",
        department: "",
        phone: "",
        email: "",
        leadSource: "",
        productId: "",
        productName: "",
        leadStatus: "New",
        budget: "",
        quantity: "",
        pricePerUnit: "",
        expectedClosingDate: "",
        nextFollowupDate: "",
        city: "",
        state: "",
        country: "",
        address: "",
        assignedTo: "",
        notes: ""
      })
    }
  }, [editingLead, isOpen])

  // Auto-calculate budget when quantity or pricePerUnit changes
  useEffect(() => {
    if (formData.quantity && formData.pricePerUnit) {
      const calculatedBudget = (parseInt(formData.quantity) * parseFloat(formData.pricePerUnit)).toFixed(2)
      setFormData(prev => ({ ...prev, budget: calculatedBudget }))
    } else {
      setFormData(prev => ({ ...prev, budget: "" }))
    }
  }, [formData.quantity, formData.pricePerUnit])

  const loadAccounts = async () => {
    try {
      const companyId = localStorage.getItem('currentCompanyId') || 'de19ccb7-e90d-4507-861d-a3aecf5e3f29'
      const response = await fetch(`/api/accounts?companyId=${companyId}`)
      
      if (response.ok) {
        const data = await response.json()
        const accountsArray = data.accounts || data
        const formattedAccounts = accountsArray.map((account: any) => ({
          id: account.id,
          accountName: account.account_name,
          contactName: account.contact_name || '',
          city: account.billing_city || account.city || '',
          state: account.billing_state || account.state || '',
          country: account.billing_country || account.country || '',
          phone: account.phone || '',
          email: account.email || '',
          address: account.billing_street || account.address || ''
        }))
        setAccounts(formattedAccounts)
      }
    } catch (error) {
      console.error('Error loading accounts:', error)
    }
  }

  const loadContacts = async () => {
    try {
      const companyId = localStorage.getItem('currentCompanyId') || 'de19ccb7-e90d-4507-861d-a3aecf5e3f29'
      const response = await fetch(`/api/contacts?companyId=${companyId}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Raw contacts data:', data)
        
        const formattedContacts = data.contacts?.map((contact: any) => {
          console.log('Processing contact:', contact)
          return {
            id: contact.id,
            contactName: contact.contactName,
            accountName: contact.accountName || '',
            department: contact.department || '',
            phone: contact.phone || '',
            email: contact.email || '',
            address: contact.address || ''
          }
        }) || []
        
        console.log('Formatted contacts:', formattedContacts)
        setContacts(formattedContacts)
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }

  const loadProducts = async () => {
    try {
      const companyId = localStorage.getItem('currentCompanyId') || 'de19ccb7-e90d-4507-861d-a3aecf5e3f29'
      const response = await fetch(`/api/products?companyId=${companyId}`)
      
      if (response.ok) {
        const data = await response.json()
        const formattedProducts = data.map((product: any) => ({
          id: product.id,
          productName: product.product_name,
          category: product.category || '',
          price: product.price || 0
        }))
        setProducts(formattedProducts)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const companyId = localStorage.getItem('currentCompanyId') || 'de19ccb7-e90d-4507-861d-a3aecf5e3f29'
      const response = await fetch(`/api/users?companyId=${companyId}`)
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleAccountSelect = (account: Account) => {
    // Update form with account details
    setFormData(prev => ({
      ...prev,
      accountId: account.id,
      accountName: account.accountName,
      phone: account.phone,
      email: account.email,
      city: account.city,
      state: account.state,
      country: account.country,
      address: account.address
    }))
    
    // Check if there are sub-contacts for this account
    const relatedContacts = contacts.filter(c => c.accountName === account.accountName)
    console.log('Account selected:', account.accountName)
    console.log('All contacts:', contacts)
    console.log('Related contacts found:', relatedContacts)
    
    if (relatedContacts.length === 0) {
      // No sub-contacts exist, auto-populate contact name from account's contact_name field
      console.log('No contacts found, using contact name from account')
      setFormData(prev => ({
        ...prev,
        contactId: "",
        contactName: account.contactName || account.accountName,  // Use contact_name from account, fallback to account name
        department: "None"  // Set department as "None" when no contacts exist
      }))
    } else if (relatedContacts.length === 1) {
      // Only one contact exists, auto-select it
      const relatedContact = relatedContacts[0]
      console.log('One contact found, auto-selecting:', relatedContact)
      setFormData(prev => ({
        ...prev,
        contactId: relatedContact.id,
        contactName: relatedContact.contactName,
        department: relatedContact.department || ""  // Set department from the contact
      }))
    } else {
      // Multiple contacts exist, clear contact selection so user can choose
      console.log('Multiple contacts found, clearing selection')
      setFormData(prev => ({
        ...prev,
        contactId: "",
        contactName: "",
        department: ""  // Clear department when user needs to select
      }))
    }
    
    setAccountSearchOpen(false)
  }

  const handleContactSelect = (contact: Contact) => {
    // Update form with contact details and auto-populate account
    const relatedAccount = accounts.find(a => a.accountName === contact.accountName)
    
    setFormData(prev => ({
      ...prev,
      contactId: contact.id,
      contactName: contact.contactName,
      department: contact.department || "",
      phone: contact.phone,
      email: contact.email,
      // Auto-populate account details when contact is selected
      accountId: relatedAccount?.id || "",
      accountName: contact.accountName,
      city: relatedAccount?.city || "",
      state: relatedAccount?.state || "",
      country: relatedAccount?.country || "",
      address: contact.address || relatedAccount?.address || ""
    }))
    
    setContactSearchOpen(false)
  }

  const handleProductSelect = (product: Product) => {
    setFormData(prev => ({
      ...prev,
      productId: product.id,
      productName: product.productName,
      pricePerUnit: product.price.toString()
    }))
    setProductSearchOpen(false)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.accountName) {
      toast({
        title: "Validation Error",
        description: "Please select an account",
        variant: "destructive"
      })
      return
    }

    if (!formData.leadSource) {
      toast({
        title: "Validation Error",
        description: "Please select a lead source",
        variant: "destructive"
      })
      return
    }

    if (!formData.productName) {
      toast({
        title: "Validation Error",
        description: "Please select a product",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare lead data
      const leadData = {
        account_id: formData.accountId,
        account_name: formData.accountName,
        contact_id: formData.contactId,
        contact_name: formData.contactName,
        department: formData.department,
        phone: formData.phone,
        email: formData.email,
        lead_source: formData.leadSource,
        product_id: formData.productId,
        product_name: formData.productName,
        lead_status: formData.leadStatus,
        assigned_to: formData.assignedTo || localStorage.getItem('userName') || 'Sales Team',
        budget: formData.budget ? parseFloat(formData.budget) : null,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        price_per_unit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : null,
        expected_closing_date: formData.expectedClosingDate || null,
        next_followup_date: formData.nextFollowupDate || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        address: formData.address || null,
        notes: formData.notes || null
      }

      // Call the onSave callback if provided
      if (onSave) {
        await onSave(leadData)
      }

      // Close modal - parent will handle success message
      onClose()
    } catch (error) {
      console.error('Error saving lead:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error saving lead. Please try again.',
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Account Selection with Search */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account">Account Name *</Label>
              <Popover open={accountSearchOpen} onOpenChange={setAccountSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={accountSearchOpen}
                    className="w-full justify-between text-left font-normal"
                  >
                    {formData.accountName || "Select account..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-2" align="start">
                  <div className="space-y-2">
                    <Input
                      placeholder="Search accounts..."
                      value={accountSearch}
                      onChange={(e) => setAccountSearch(e.target.value)}
                      className="w-full"
                    />
                    <div className="max-h-[200px] border rounded-md custom-scrollbar">
                      {accounts
                        .filter(account => {
                          const searchLower = accountSearch.toLowerCase()
                          const displayName = `${account.accountName} ${account.city || ''}`.toLowerCase()
                          return displayName.includes(searchLower)
                        })
                        .map((account) => (
                          <div
                            key={account.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              handleAccountSelect(account)
                              setAccountSearch("")
                              setAccountSearchOpen(false)
                            }}
                          >
                            {account.accountName} {account.city && `(${account.city})`}
                          </div>
                        ))}
                      {accounts.filter(account => {
                        const searchLower = accountSearch.toLowerCase()
                        const displayName = `${account.accountName} ${account.city || ''}`.toLowerCase()
                        return displayName.includes(searchLower)
                      }).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No accounts found</p>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Contact Selection with Search */}
            <div>
              <Label htmlFor="contact">Contact Name</Label>
              <Popover 
                open={contactSearchOpen} 
                onOpenChange={(open) => {
                  // Only allow opening if the selected account has sub-contacts
                  const selectedAccount = accounts.find(a => a.accountName === formData.accountName)
                  const relatedContacts = contacts.filter(c => c.accountName === formData.accountName)
                  if (selectedAccount && relatedContacts.length > 0) {
                    setContactSearchOpen(open)
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={contactSearchOpen}
                    className={`w-full justify-between text-left font-normal ${
                      formData.accountName && 
                      contacts.filter(c => c.accountName === formData.accountName).length === 0 
                        ? 'cursor-not-allowed opacity-60' 
                        : ''
                    }`}
                    disabled={
                      !formData.accountName || 
                      contacts.filter(c => c.accountName === formData.accountName).length === 0
                    }
                  >
                    {formData.contactName || "Select contact..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-2" align="start">
                  <div className="space-y-2">
                    <Input
                      placeholder="Search contacts..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="w-full"
                    />
                    <div className="max-h-[200px] border rounded-md custom-scrollbar">
                      {contacts
                        .filter(contact => {
                          // First filter by selected account
                          if (contact.accountName !== formData.accountName) {
                            return false
                          }
                          // Then filter by search term
                          const searchLower = contactSearch.toLowerCase()
                          const displayName = `${contact.accountName} ${contact.department || ''} ${contact.contactName}`.toLowerCase()
                          return displayName.includes(searchLower)
                        })
                        .map((contact) => (
                          <div
                            key={contact.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              handleContactSelect(contact)
                              setContactSearch("")
                              setContactSearchOpen(false)
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {contact.accountName}
                                {contact.department && ` (${contact.department})`} - {contact.contactName}
                              </span>
                            </div>
                          </div>
                        ))}
                      {contacts.filter(contact => {
                        // First filter by selected account
                        if (contact.accountName !== formData.accountName) {
                          return false
                        }
                        // Then filter by search term
                        const searchLower = contactSearch.toLowerCase()
                        const displayName = `${contact.accountName} ${contact.department || ''} ${contact.contactName}`.toLowerCase()
                        return displayName.includes(searchLower)
                      }).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No contacts found for this account</p>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Department and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Auto-filled from contact"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Auto-filled from account/contact"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email (full width) */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Auto-filled from account/contact"
              disabled={isSubmitting}
            />
          </div>

          {/* Address and City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Auto-filled from account/contact"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Enter city"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* State and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Enter state"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                placeholder="Auto-filled from account"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Lead Source and Lead Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadSource">Lead Source *</Label>
              <Select 
                value={formData.leadSource} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, leadSource: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  {leadSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lead Status */}
            <div>
              <Label htmlFor="leadStatus">Lead Status</Label>
              <Select 
                value={formData.leadStatus} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, leadStatus: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead status" />
                </SelectTrigger>
                <SelectContent>
                  {leadStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product */}
          <div className="grid grid-cols-2 gap-4">
            {/* Product Selection with Search */}
            <div>
              <Label htmlFor="product">Product *</Label>
              <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={productSearchOpen}
                    className="w-full justify-between text-left font-normal"
                  >
                    {formData.productName || "Select product..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-2" align="start">
                  <div className="space-y-2">
                    <Input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full"
                    />
                    <div className="max-h-[200px] border rounded-md custom-scrollbar">
                      {products
                        .filter(product => {
                          const searchLower = productSearch.toLowerCase()
                          const displayName = `${product.productName} ${product.category || ''}`.toLowerCase()
                          return displayName.includes(searchLower)
                        })
                        .map((product) => (
                          <div
                            key={product.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              handleProductSelect(product)
                              setProductSearch("")
                              setProductSearchOpen(false)
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{product.productName}</span>
                              {product.category && (
                                <span className="text-sm text-gray-500">{product.category}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      {products.filter(product => {
                        const searchLower = productSearch.toLowerCase()
                        const displayName = `${product.productName} ${product.category || ''}`.toLowerCase()
                        return displayName.includes(searchLower)
                      }).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No products found</p>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="pricePerUnit">Price Per Unit (₹)</Label>
              <Input
                id="pricePerUnit"
                type="number"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                placeholder="Auto-filled from product"
                disabled={isSubmitting}
              />
            </div>
          </div>


          {/* Quantity and Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="budget">Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="Auto-calculated"
                disabled={isSubmitting}
                readOnly
              />
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expectedClosingDate">Expected Closing Date</Label>
              <Input
                id="expectedClosingDate"
                type="date"
                value={formData.expectedClosingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedClosingDate: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="nextFollowupDate">Next Follow-up Date</Label>
              <Input
                id="nextFollowupDate"
                type="date"
                value={formData.nextFollowupDate}
                onChange={(e) => setFormData(prev => ({ ...prev, nextFollowupDate: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Assigned To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select 
                value={formData.assignedTo} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.full_name}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div></div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter specific requirements, notes, or additional information..."
              rows={3}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {editingLead ? 'Updating...' : 'Adding Lead...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingLead ? 'Update Lead' : 'Add Lead'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}