"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Edit, Phone, Mail, Building2, Upload, Save, X, Trash2 } from "lucide-react"
import { DataImportModal } from "@/components/data-import-modal"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import storageService from "@/lib/localStorage-service"

interface Account {
  id: string
  accountName: string
  city?: string
  state?: string
  region?: string
  area?: string
  contactName?: string
  contactNo?: string
  email?: string
  website?: string
  assignedTo?: string
  industry?: string
  status?: string
  turnover?: string
  employees?: string
  createdAt?: string
  updatedAt?: string
  lastActivity?: string
}

const regions = ["All", "North", "South", "East", "West", "Central", "International"]
const industries = ["All", "Biotech Company", "Dealer", "Educational Institutions", "Food and Beverages", "Hair Transplant Clinics/ Hospitals", "Molecular Diagnostics", "Pharmaceutical", "Research", "SRO", "Training Institute", "Universities"]
const statuses = ["All", "Active", "Inactive", "Prospect", "Dormant"]

export function AccountsContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedIndustry, setSelectedIndustry] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [accountStats, setAccountStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    activeRegions: 0
  })

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<Account>>({
    accountName: "",
    industry: "",
    contactName: "",
    contactNo: "",
    email: "",
    website: "",
    city: "",
    state: "",
    region: "",
    assignedTo: "",
    status: "Active",
    turnover: "",
    employees: ""
  })

  // Load accounts from Supabase API
  useEffect(() => {
    loadAccountsFromAPI()
  }, [])

  const loadAccountsFromAPI = async () => {
    try {
      // Get current user to find company ID
      const storedUser = localStorage.getItem('user')
      if (!storedUser) {
        console.log("No user found in localStorage")
        return
      }
      
      const user = JSON.parse(storedUser)
      if (!user.company_id) {
        console.log("No company_id found for user")
        return
      }
      
      console.log("Loading accounts for company:", user.company_id)
      
      // Fetch accounts from API
      const response = await fetch(`/api/accounts?companyId=${user.company_id}&limit=100`)
      if (!response.ok) {
        throw new Error(`Failed to fetch accounts: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("API Response:", data)
      
      // Map API data to component format
      const mappedAccounts = (data.accounts || []).map((account: any) => ({
        id: account.id,
        accountName: account.account_name,
        city: account.billing_city,
        state: account.billing_state,
        region: account.billing_state, // Use state as region for now
        contactName: account.owner?.full_name,
        contactNo: account.phone,
        email: account.owner?.email,
        website: account.website,
        assignedTo: account.owner?.full_name,
        industry: account.industry,
        status: account.status || 'Active',
        createdAt: account.created_at
      }))
      
      console.log("Mapped accounts:", mappedAccounts)
      setAccounts(mappedAccounts)
      
      // Calculate stats from API data
      const activeAccounts = mappedAccounts.filter((acc: any) => acc.status === 'Active').length
      const uniqueRegions = [...new Set(mappedAccounts.filter((acc: any) => acc.region).map((acc: any) => acc.region))].length
      
      setAccountStats({
        total: data.total || mappedAccounts.length,
        active: activeAccounts,
        newThisMonth: 0, // TODO: Calculate from created dates
        activeRegions: uniqueRegions
      })
      
    } catch (error) {
      console.error("Error loading accounts:", error)
      toast({
        title: "Error",
        description: "Failed to load accounts from database",
        variant: "destructive"
      })
    }
  }

  // Debug: Log current accounts state
  useEffect(() => {
    console.log("Current accounts state:", accounts)
  }, [accounts])

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.city?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRegion = selectedRegion === "All" || account.region === selectedRegion
    const matchesIndustry = selectedIndustry === "All" || account.industry === selectedIndustry
    const matchesStatus = selectedStatus === "All" || account.status === selectedStatus

    return matchesSearch && matchesRegion && matchesIndustry && matchesStatus
  })

  const handleAddAccount = () => {
    setFormData({
      accountName: "",
      industry: "",
      contactName: "",
      contactNo: "",
      email: "",
      website: "",
      city: "",
      state: "",
      region: "",
      assignedTo: "",
      status: "Active",
      turnover: "",
      employees: ""
    })
    setIsAddAccountOpen(true)
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
    setFormData(account)
    setIsEditAccountOpen(true)
  }

  const handleDeleteAccount = (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      const success = storageService.delete('accounts', id)
      if (success) {
        // Immediately remove from state
        setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== id))
        
        // Update stats
        const stats = storageService.getStats('accounts')
        const storedAccounts = storageService.getAll<Account>('accounts')
        const activeAccounts = storedAccounts.filter(acc => acc.status === 'Active').length
        const uniqueRegions = [...new Set(storedAccounts.filter(acc => acc.region).map(acc => acc.region))].length
        
        setAccountStats({
          total: stats.total,
          active: activeAccounts,
          newThisMonth: stats.thisMonthCount,
          activeRegions: uniqueRegions
        })
        
        toast({
          title: "Account deleted",
          description: "The account has been successfully deleted."
        })
      }
    }
  }

  const handleSaveAccount = () => {
    console.log("handleSaveAccount called with formData:", formData)
    
    if (!formData.accountName) {
      toast({
        title: "Error",
        description: "Account name is required",
        variant: "destructive"
      })
      return
    }

    if (editingAccount) {
      // Update existing account
      const updatedAccount = storageService.update('accounts', editingAccount.id, formData)
      console.log("Updated account:", updatedAccount)
      if (updatedAccount) {
        // Immediately update the state
        setAccounts(prevAccounts => {
          const newAccounts = prevAccounts.map(acc => acc.id === editingAccount.id ? updatedAccount : acc)
          console.log("Setting updated accounts:", newAccounts)
          return newAccounts
        })
        toast({
          title: "Account updated",
          description: "The account has been successfully updated."
        })
        setIsEditAccountOpen(false)
        setEditingAccount(null)
      }
    } else {
      // Create new account
      console.log("Creating new account...")
      const newAccount = storageService.create('accounts', formData as Account)
      console.log("New account created:", newAccount)
      
      if (newAccount) {
        // Force immediate refresh from localStorage
        const refreshedAccounts = storageService.getAll<Account>('accounts')
        console.log("Force refresh - all accounts:", refreshedAccounts)
        setAccounts(refreshedAccounts)
        
        toast({
          title: "Account created",
          description: "The account has been successfully created."
        })
        setIsAddAccountOpen(false)
      } else {
        console.error("Failed to create account")
        toast({
          title: "Error",
          description: "Failed to create account",
          variant: "destructive"
        })
      }
    }
    
    // Reload stats
    const stats = storageService.getStats('accounts')
    const storedAccounts = storageService.getAll<Account>('accounts')
    const activeAccounts = storedAccounts.filter(acc => acc.status === 'Active').length
    
    const uniqueRegions = [...new Set(storedAccounts.filter(acc => acc.region).map(acc => acc.region))].length
    console.log("Updated stats:", { total: stats.total, active: activeAccounts, regions: uniqueRegions })
    
    setAccountStats({
      total: stats.total,
      active: activeAccounts,
      newThisMonth: stats.thisMonthCount,
      activeRegions: uniqueRegions
    })
    
    // Reset form
    setFormData({
      accountName: "",
      industry: "",
      contactName: "",
      contactNo: "",
      email: "",
      website: "",
      city: "",
      state: "",
      region: "",
      assignedTo: "",
      status: "Active",
      turnover: "",
      employees: ""
    })
  }

  const handleImportData = async (data: any[]) => {
    try {
      // Get current user's company ID
      const storedUser = localStorage.getItem('user')
      if (!storedUser) {
        toast({
          title: "Error",
          description: "User not found. Please login again.",
          variant: "destructive"
        })
        return
      }
      
      const user = JSON.parse(storedUser)
      if (!user.company_id) {
        toast({
          title: "Error",
          description: "Company not found. Please login again.",
          variant: "destructive"
        })
        return
      }
      
      // Prepare accounts for import
      const accountsToImport = data.map(item => ({
        account_name: item.accountName || item.leadName || item.name || '',
        industry: item.industry || '',
        phone: item.phone || item.contactNo || '',
        website: item.website || '',
        billing_city: item.city || '',
        billing_state: item.state || '',
        billing_country: item.country || '',
        status: item.status || 'Active',
        owner_id: user.id
      }))
      
      let successCount = 0
      let failCount = 0
      
      // Import accounts one by one (or in batches)
      for (const account of accountsToImport) {
        if (!account.account_name) {
          failCount++
          continue
        }
        
        try {
          const response = await fetch('/api/accounts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              companyId: user.company_id,
              ...account
            })
          })
          
          if (response.ok) {
            successCount++
          } else {
            failCount++
          }
        } catch (error) {
          console.error('Error importing account:', error)
          failCount++
        }
      }
      
      // Reload accounts from API
      await loadAccountsFromAPI()
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${successCount} accounts. ${failCount > 0 ? `Failed: ${failCount}` : ''}`
      })
      
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: "Import failed",
        description: "An error occurred while importing accounts.",
        variant: "destructive"
      })
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(accounts, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `accounts_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast({
      title: "Data exported",
      description: "Accounts data has been exported to JSON file."
    })
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "prospect":
        return "bg-blue-100 text-blue-800"
      case "dormant":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts Management</h1>
          <p className="text-gray-600">Manage your customer accounts and relationships</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button onClick={handleAddAccount} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountStats.total}</div>
            <p className="text-xs text-muted-foreground">+{accountStats.newThisMonth} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountStats.active}</div>
            <p className="text-xs text-muted-foreground">{Math.round((accountStats.active / accountStats.total) * 100) || 0}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountStats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Recent additions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountStats.activeRegions}</div>
            <p className="text-xs text-muted-foreground">Geographic coverage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Search & Filters</CardTitle>
          <CardDescription>Filter and search through your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search accounts by name, contact, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounts List</CardTitle>
          <CardDescription>Showing {filteredAccounts.length} of {accounts.length} accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table key={accounts.length}>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>City/State</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No accounts found. Click "Add Account" to create your first account.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.accountName}</TableCell>
                      <TableCell>{account.industry || "—"}</TableCell>
                      <TableCell>{account.contactName || "—"}</TableCell>
                      <TableCell>{account.contactNo || "—"}</TableCell>
                      <TableCell>{account.city ? `${account.city}${account.state ? `/${account.state}` : ''}` : "—"}</TableCell>
                      <TableCell>{account.region || "—"}</TableCell>
                      <TableCell>{account.assignedTo || "—"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(account.status || '')}>
                          {account.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAccount(account.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                placeholder="Enter account name"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.filter(i => i !== "All").map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                placeholder="Contact person name"
              />
            </div>
            <div>
              <Label htmlFor="contactNo">Contact Number</Label>
              <Input
                id="contactNo"
                value={formData.contactNo}
                onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@company.com"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="www.company.com"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                placeholder="State"
              />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.filter(r => r !== "All").map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                placeholder="Sales representative"
              />
            </div>
            <div>
              <Label htmlFor="turnover">Annual Turnover</Label>
              <Input
                id="turnover"
                value={formData.turnover}
                onChange={(e) => setFormData({...formData, turnover: e.target.value})}
                placeholder="₹50L"
              />
            </div>
            <div>
              <Label htmlFor="employees">Employees</Label>
              <Input
                id="employees"
                value={formData.employees}
                onChange={(e) => setFormData({...formData, employees: e.target.value})}
                placeholder="50-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveAccount} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={isEditAccountOpen} onOpenChange={setIsEditAccountOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="edit-accountName">Account Name *</Label>
              <Input
                id="edit-accountName"
                value={formData.accountName}
                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                placeholder="Enter account name"
              />
            </div>
            <div>
              <Label htmlFor="edit-industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.filter(i => i !== "All").map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-contactName">Contact Name</Label>
              <Input
                id="edit-contactName"
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                placeholder="Contact person name"
              />
            </div>
            <div>
              <Label htmlFor="edit-contactNo">Contact Number</Label>
              <Input
                id="edit-contactNo"
                value={formData.contactNo}
                onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@company.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="www.company.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="edit-state">State</Label>
              <Input
                id="edit-state"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                placeholder="State"
              />
            </div>
            <div>
              <Label htmlFor="edit-region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.filter(r => r !== "All").map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-assignedTo">Assigned To</Label>
              <Input
                id="edit-assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                placeholder="Sales representative"
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.filter(s => s !== "All").map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-turnover">Annual Turnover</Label>
              <Input
                id="edit-turnover"
                value={formData.turnover}
                onChange={(e) => setFormData({...formData, turnover: e.target.value})}
                placeholder="₹50L"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAccountOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveAccount} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Update Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Import Modal */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        moduleType="accounts"
        onImport={handleImportData}
      />
    </div>
  )
}