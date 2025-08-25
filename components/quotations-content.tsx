"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, FileText, Send, Printer, Upload } from "lucide-react"
import { AddQuotationModal } from "@/components/add-quotation-modal"
import { DataImportModal } from "@/components/data-import-modal"
import { useToast } from "@/hooks/use-toast"
import storageService from "@/lib/localStorage-service"

const quotations = [
  {
    id: "QTN-2025-001",
    date: "20/07/2025",
    accountName: "TSAR Labcare",
    contactName: "Mr. Mahesh",
    product: "TRICOLOR MULTICHANNEL FIBRINOMETER",
    amount: "₹8,50,000",
    status: "Sent",
    validUntil: "20/08/2025",
    assignedTo: "Pauline",
    revision: "Rev-1",
  },
  {
    id: "QTN-2025-002",
    date: "18/07/2025",
    accountName: "Eurofins Advinus",
    contactName: "Dr. Research Head",
    product: "LABORATORY FREEZE DRYER/LYOPHILIZER",
    amount: "₹12,00,000",
    status: "Under Review",
    validUntil: "18/08/2025",
    assignedTo: "Pauline",
    revision: "Rev-2",
  },
  {
    id: "QTN-2025-003",
    date: "15/07/2025",
    accountName: "ASN Fuels Private",
    contactName: "Mr. Naveen G",
    product: "LAF-02 Application Equipment",
    amount: "₹3,25,000",
    status: "Draft",
    validUntil: "15/08/2025",
    assignedTo: "Pauline",
    revision: "Rev-0",
  },
  {
    id: "QTN-2025-004",
    date: "12/07/2025",
    accountName: "Kerala Agricultural University",
    contactName: "Dr. Department Head",
    product: "ND 1000 Spectrophotometer",
    amount: "₹4,75,000",
    status: "Accepted",
    validUntil: "12/08/2025",
    assignedTo: "Hari Kumar K",
    revision: "Rev-1",
  },
]

const statuses = ["All", "Draft", "Sent", "Under Review", "Accepted", "Rejected", "Expired"]

export function QuotationsContent() {
  const { toast } = useToast()
  const [quotationsList, setQuotationsList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isAddQuotationModalOpen, setIsAddQuotationModalOpen] = useState(false)
  const [isDataImportModalOpen, setIsDataImportModalOpen] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [quotationStats, setQuotationStats] = useState({
    total: 0,
    pendingReview: 0,
    acceptanceRate: 0,
    totalValue: 0,
    thisMonthCount: 0
  })

  // Load quotations from localStorage on component mount
  useEffect(() => {
    loadQuotations()
  }, [])

  const loadQuotations = () => {
    const storedQuotations = storageService.getAll<any>('quotations')
    console.log("loadQuotations - storedQuotations:", storedQuotations)
    setQuotationsList(storedQuotations)
    
    // Calculate stats
    const stats = storageService.getStats('quotations')
    const pendingReview = storedQuotations.filter(q => q.status === 'Under Review' || q.status === 'Sent').length
    const accepted = storedQuotations.filter(q => q.status === 'Accepted').length
    const acceptanceRate = storedQuotations.length > 0 ? Math.round((accepted / storedQuotations.length) * 100) : 0
    const totalValue = storedQuotations.reduce((sum, q) => {
      const value = parseFloat(q.amount?.replace(/[₹,]/g, '') || '0')
      return sum + value
    }, 0)
    
    // Calculate this month's quotations
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const thisMonthCount = storedQuotations.filter(q => {
      const quotationDate = new Date(q.date || q.createdAt || Date.now())
      return quotationDate.getMonth() === currentMonth && quotationDate.getFullYear() === currentYear
    }).length
    
    setQuotationStats({
      total: stats.total,
      pendingReview: pendingReview,
      acceptanceRate: acceptanceRate,
      totalValue: totalValue,
      thisMonthCount: thisMonthCount
    })
  }

  const handleSaveQuotation = (quotationData: any) => {
    console.log("handleSaveQuotation called with:", quotationData)
    
    const newQuotation = storageService.create('quotations', quotationData)
    console.log("New quotation created:", newQuotation)
    
    if (newQuotation) {
      // Force immediate refresh from localStorage
      const refreshedQuotations = storageService.getAll<any>('quotations')
      console.log("Force refresh - all quotations:", refreshedQuotations)
      setQuotationsList(refreshedQuotations)
      
      // Update stats
      loadQuotations()
      
      toast({
        title: "Quotation created",
        description: `Quotation ${newQuotation.quotationId || newQuotation.id} has been successfully created.`
      })
      setIsAddQuotationModalOpen(false)
    } else {
      console.error("Failed to create quotation")
      toast({
        title: "Error",
        description: "Failed to create quotation",
        variant: "destructive"
      })
    }
  }
  
  const handleEditQuotation = (quotation: any) => {
    setEditingQuotation(quotation)
    setIsEditModalOpen(true)
  }
  
  const handleUpdateQuotation = (quotationData: any) => {
    console.log("handleUpdateQuotation called with:", quotationData)
    
    const updatedQuotation = storageService.update('quotations', editingQuotation.id, quotationData)
    console.log("Updated quotation:", updatedQuotation)
    
    if (updatedQuotation) {
      // Force immediate refresh from localStorage
      const refreshedQuotations = storageService.getAll<any>('quotations')
      console.log("Force refresh - all quotations:", refreshedQuotations)
      setQuotationsList(refreshedQuotations)
      
      // Update stats
      loadQuotations()
      
      toast({
        title: "Quotation updated",
        description: `Quotation ${updatedQuotation.quotationId || updatedQuotation.id} has been successfully updated.`
      })
      setIsEditModalOpen(false)
      setEditingQuotation(null)
    } else {
      console.error("Failed to update quotation")
      toast({
        title: "Error",
        description: "Failed to update quotation",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "under review":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter quotations based on search and status
  const filteredQuotations = quotationsList.filter(quotation => {
    const matchesSearch = searchTerm === "" || 
      quotation.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.quotationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.product?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || quotation.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations Management</h1>
          <p className="text-gray-600">Create and manage quotations for your customers</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsDataImportModalOpen(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Quotations
          </Button>
          <Button onClick={() => setIsAddQuotationModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Quotation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotationStats.total}</div>
            <p className="text-xs text-muted-foreground">+{quotationStats.thisMonthCount || 0} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotationStats.pendingReview}</div>
            <p className="text-xs text-muted-foreground">Awaiting customer response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotationStats.acceptanceRate}%</div>
            <p className="text-xs text-muted-foreground">Based on current data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{quotationStats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active quotations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotation Search & Filters</CardTitle>
          <CardDescription>Filter and search through your quotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search quotations by ID, account, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
          <CardTitle>Quotations List</CardTitle>
          <CardDescription>Showing {filteredQuotations.length} of {quotationsList.length} quotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Revision</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No quotations found. Click "Create Quotation" to create your first quotation.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.quotationId || quotation.id}</TableCell>
                    <TableCell>{quotation.date}</TableCell>
                    <TableCell className="font-medium">{quotation.accountName}</TableCell>
                    <TableCell>{quotation.contactName}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={quotation.product}>
                        {quotation.product}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{quotation.amount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quotation.status)}>{quotation.status}</Badge>
                    </TableCell>
                    <TableCell>{quotation.validUntil}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{quotation.revision}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Edit"
                          onClick={() => handleEditQuotation(quotation)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Send">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Print">
                          <Printer className="w-4 h-4" />
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

      {/* Add Quotation Modal */}
      <AddQuotationModal
        isOpen={isAddQuotationModalOpen}
        onClose={() => setIsAddQuotationModalOpen(false)}
        onSave={handleSaveQuotation}
      />
      
      {/* Edit Quotation Modal */}
      {editingQuotation && (
        <AddQuotationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingQuotation(null)
          }}
          onSave={handleUpdateQuotation}
          editingQuotation={editingQuotation}
        />
      )}
      
      {/* DataImportModal component */}
      <DataImportModal 
        isOpen={isDataImportModalOpen} 
        onClose={() => setIsDataImportModalOpen(false)}
        moduleType="quotations"
        onImport={(data) => console.log('Imported quotations:', data)}
      />
    </div>
  )
}
