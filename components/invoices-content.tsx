"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Receipt, IndianRupee, Clock, CheckCircle2, AlertCircle, Search, Filter, Plus, Eye, Edit, MoreHorizontal, Download, Send, Calendar, Building2, TrendingUp, TrendingDown, FileText, Upload, Printer } from "lucide-react"
import { AddInvoiceModal } from "@/components/add-invoice-modal"
import { DataImportModal } from "@/components/data-import-modal"
import { useToast } from "@/hooks/use-toast"
import storageService from "@/lib/localStorage-service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function InvoicesContent() {
  const { toast } = useToast()
  const [invoicesList, setInvoicesList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [invoicesStatsState, setInvoicesStatsState] = useState({
    total: 0,
    outstanding: 0,
    paidThisMonth: 0,
    overdue: 0
  })
  const [selectedTab, setSelectedTab] = useState("all")
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false)
  const [isDataImportModalOpen, setIsDataImportModalOpen] = useState(false)

  // Load invoices from localStorage on component mount
  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = () => {
    let storedInvoices = storageService.getAll<any>('invoices')
    console.log("loadInvoices - storedInvoices:", storedInvoices)
    
    // If no invoices in localStorage, initialize with sample data
    if (storedInvoices.length === 0) {
      console.log("No invoices found, initializing with sample data")
      // Add sample invoices to localStorage
      invoices.forEach(invoice => {
        storageService.create('invoices', invoice)
      })
      storedInvoices = storageService.getAll<any>('invoices')
      console.log("Initialized invoices:", storedInvoices)
    }
    
    setInvoicesList(storedInvoices)
    
    // Calculate stats
    const stats = storageService.getStats('invoices')
    const outstanding = storedInvoices.filter(inv => inv.status === 'pending' || inv.status === 'sent').reduce((sum, inv) => {
      const value = parseFloat(inv.amount?.replace(/[₹,]/g, '') || '0')
      return sum + value
    }, 0)
    
    const paidThisMonth = storedInvoices.filter(inv => {
      const paidDate = new Date(inv.issueDate)
      return inv.status === 'paid' && paidDate.getMonth() === new Date().getMonth()
    }).reduce((sum, inv) => {
      const value = parseFloat(inv.amount?.replace(/[₹,]/g, '') || '0')
      return sum + value
    }, 0)
    
    const overdue = storedInvoices.filter(inv => inv.status === 'overdue').length
    
    setInvoicesStatsState({
      total: stats.total,
      outstanding: outstanding,
      paidThisMonth: paidThisMonth,
      overdue: overdue
    })
  }
  
  const handleSaveInvoice = (invoiceData: any) => {
    console.log("handleSaveInvoice called with:", invoiceData)
    
    const newInvoice = storageService.create('invoices', invoiceData)
    console.log("New invoice created:", newInvoice)
    
    if (newInvoice) {
      // Force immediate refresh from localStorage
      const refreshedInvoices = storageService.getAll<any>('invoices')
      console.log("Force refresh - all invoices:", refreshedInvoices)
      setInvoicesList(refreshedInvoices)
      
      // Update stats
      loadInvoices()
      
      toast({
        title: "Invoice created",
        description: `Invoice ${newInvoice.id || newInvoice.invoiceId} has been successfully created.`
      })
      setIsAddInvoiceModalOpen(false)
    } else {
      console.error("Failed to create invoice")
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      })
    }
  }
  
  const handleImportData = (importedInvoices: any[]) => {
    console.log('Imported invoices:', importedInvoices)
    const createdInvoices = storageService.createMany('invoices', importedInvoices)
    
    // Immediately add imported invoices to state
    setInvoicesList(prevInvoices => [...prevInvoices, ...createdInvoices])
    
    // Update stats
    loadInvoices()
    
    toast({
      title: "Data imported",
      description: `Successfully imported ${createdInvoices.length} invoices.`
    })
  }
  
  // Invoice action handlers
  const handlePrintInvoice = (invoice: any) => {
    // Create a simple print view
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <h2>${invoice.id}</h2>
        </div>
        <div class="details">
          <p><strong>Customer:</strong> ${invoice.customer}</p>
          <p><strong>Contact:</strong> ${invoice.contact}</p>
          <p><strong>Amount:</strong> ${invoice.amount}</p>
          <p><strong>Issue Date:</strong> ${invoice.issueDate}</p>
          <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
        </div>
        <table class="table">
          <tr><th>Items</th><th>Amount</th></tr>
          <tr><td>${invoice.items}</td><td>${invoice.amount}</td></tr>
        </table>
      </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
    
    toast({
      title: "Invoice printed",
      description: `Invoice ${invoice.id} has been sent to printer.`
    })
  }
  
  const handleSendInvoice = (invoice: any) => {
    // Simulate sending email
    const subject = `Invoice ${invoice.id} from Your Company`
    const body = `Dear ${invoice.contact},\n\nPlease find attached your invoice ${invoice.id} for ${invoice.amount}.\n\nDue Date: ${invoice.dueDate}\n\nThank you for your business!\n\nBest regards,\nAccounts Team`
    
    // In a real application, you would integrate with an email service
    // For now, we'll open the default email client
    window.open(`mailto:${invoice.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self')
    
    toast({
      title: "Invoice sent",
      description: `Invoice ${invoice.id} has been sent to ${invoice.customer}.`
    })
  }
  
  const handleDownloadPDF = (invoice: any) => {
    // In a real application, you would generate and download a PDF
    // For now, we'll simulate the download
    const invoiceData = JSON.stringify(invoice, null, 2)
    const blob = new Blob([invoiceData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice_${invoice.id}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Invoice downloaded",
      description: `Invoice ${invoice.id} has been downloaded.`
    })
  }
  
  const handleMarkAsPaid = (invoice: any) => {
    const updatedInvoice = storageService.update('invoices', invoice.id, {
      ...invoice,
      status: 'paid',
      paymentMethod: 'Marked Manually'
    })
    
    if (updatedInvoice) {
      // Refresh the invoices list
      loadInvoices()
      
      toast({
        title: "Invoice marked as paid",
        description: `Invoice ${invoice.id} has been marked as paid.`
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive"
      })
    }
  }

  const invoicesStats = [
    {
      title: "Total Invoices",
      value: invoicesStatsState.total.toString(),
      change: "+12.5%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up"
    },
    {
      title: "Outstanding Amount",
      value: `₹${(invoicesStatsState.outstanding / 100000).toFixed(1)}L`,
      change: "-8.2%", 
      icon: IndianRupee,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "down"
    },
    {
      title: "Paid This Month",
      value: `₹${(invoicesStatsState.paidThisMonth / 100000).toFixed(1)}L`,
      change: "+15.3%",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up"
    },
    {
      title: "Overdue",
      value: invoicesStatsState.overdue.toString(),
      change: "+5.1%",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "up"
    },
  ]

  const invoices = [
    {
      id: "INV-2024-001",
      customer: "Kerala Agricultural University",
      amount: "₹8,50,000",
      dueDate: "2024-08-25",
      issueDate: "2024-08-15",
      status: "paid",
      paymentMethod: "Bank Transfer",
      items: "Fibrinometer System + Accessories",
      contact: "Dr. Priya Sharma",
      overdueDays: 0
    },
    {
      id: "INV-2024-002", 
      customer: "Eurofins Advinus",
      amount: "₹12,75,000",
      dueDate: "2024-08-22",
      issueDate: "2024-08-12",
      status: "overdue",
      paymentMethod: "Pending",
      items: "Laboratory Centrifuge + Installation",
      contact: "Mr. Rajesh Kumar",
      overdueDays: 3
    },
    {
      id: "INV-2024-003",
      customer: "TSAR Labcare",
      amount: "₹6,25,000",
      dueDate: "2024-08-28",
      issueDate: "2024-08-18",
      status: "pending",
      paymentMethod: "Pending",
      items: "Microscope + Training Package",
      contact: "Ms. Pauline D'Souza",
      overdueDays: 0
    },
    {
      id: "INV-2024-004",
      customer: "JNCASR",
      amount: "₹4,50,000",
      dueDate: "2024-08-30",
      issueDate: "2024-08-20",
      status: "sent",
      paymentMethod: "Pending",
      items: "Spectrometer Accessories",
      contact: "Dr. Anu Rang",
      overdueDays: 0
    },
    {
      id: "INV-2024-005",
      customer: "Bio-Rad Laboratories",
      amount: "₹9,80,000",
      dueDate: "2024-09-05",
      issueDate: "2024-08-16",
      status: "draft",
      paymentMethod: "Pending",
      items: "Advanced PCR System",
      contact: "Mr. Sanjay Patel",
      overdueDays: 0
    },
    {
      id: "INV-2024-006",
      customer: "Thermo Fisher Scientific",
      amount: "₹3,25,000",
      dueDate: "2024-08-26",
      issueDate: "2024-08-16",
      status: "paid",
      paymentMethod: "Cheque",
      items: "Maintenance Contract Renewal",
      contact: "Ms. Anjali Menon",
      overdueDays: 0
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      sent: "bg-blue-100 text-blue-800",
      draft: "bg-gray-100 text-gray-800",
      cancelled: "bg-gray-100 text-gray-800"
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const filteredInvoices = invoicesList.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.contact.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "pending") return matchesSearch && invoice.status === "pending"
    if (selectedTab === "overdue") return matchesSearch && invoice.status === "overdue"
    if (selectedTab === "paid") return matchesSearch && invoice.status === "paid"
    
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Generate, track and manage customer invoices</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setIsDataImportModalOpen(true)} variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Invoices
          </Button>
          <Button onClick={() => setIsAddInvoiceModalOpen(true)} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {invoicesStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                    )}
                    <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change} vs last month
                    </p>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search invoices by ID, customer, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <InvoicesTable 
              invoices={filteredInvoices} 
              onPrint={handlePrintInvoice}
              onSend={handleSendInvoice} 
              onDownload={handleDownloadPDF}
              onMarkAsPaid={handleMarkAsPaid}
            />
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <InvoicesTable 
              invoices={filteredInvoices} 
              onPrint={handlePrintInvoice}
              onSend={handleSendInvoice} 
              onDownload={handleDownloadPDF}
              onMarkAsPaid={handleMarkAsPaid}
            />
          </TabsContent>
          <TabsContent value="overdue" className="space-y-4">
            <InvoicesTable 
              invoices={filteredInvoices} 
              onPrint={handlePrintInvoice}
              onSend={handleSendInvoice} 
              onDownload={handleDownloadPDF}
              onMarkAsPaid={handleMarkAsPaid}
            />
          </TabsContent>
          <TabsContent value="paid" className="space-y-4">
            <InvoicesTable 
              invoices={filteredInvoices} 
              onPrint={handlePrintInvoice}
              onSend={handleSendInvoice} 
              onDownload={handleDownloadPDF}
              onMarkAsPaid={handleMarkAsPaid}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        isOpen={isAddInvoiceModalOpen}
        onClose={() => setIsAddInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
      />
      
      {/* DataImportModal component */}
      <DataImportModal 
        isOpen={isDataImportModalOpen} 
        onClose={() => setIsDataImportModalOpen(false)}
        moduleType="invoices"
        onImport={handleImportData}
      />
    </div>
  )
}

interface InvoicesTableProps {
  invoices: any[]
  onPrint: (invoice: any) => void
  onSend: (invoice: any) => void
  onDownload: (invoice: any) => void
  onMarkAsPaid: (invoice: any) => void
}

function InvoicesTable({ invoices, onPrint, onSend, onDownload, onMarkAsPaid }: InvoicesTableProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      sent: "bg-blue-100 text-blue-800",
      draft: "bg-gray-100 text-gray-800",
      cancelled: "bg-gray-100 text-gray-800"
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice List</CardTitle>
        <CardDescription>Complete overview of all customer invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="font-mono text-sm font-medium">{invoice.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.customer}</p>
                      <p className="text-sm text-gray-500">{invoice.contact}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-900">{invoice.amount}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(invoice.issueDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(invoice.dueDate)}
                      {invoice.overdueDays > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {invoice.overdueDays} days overdue
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{invoice.paymentMethod}</span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate" title={invoice.items}>
                        {invoice.items}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          console.log(`Viewing invoice ${invoice.id}`)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          console.log(`Editing invoice ${invoice.id}`)
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownload(invoice)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPrint(invoice)}>
                          <Printer className="mr-2 h-4 w-4" />
                          Print Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onSend(invoice)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send to Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onMarkAsPaid(invoice)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}