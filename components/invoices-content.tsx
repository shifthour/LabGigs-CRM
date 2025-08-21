"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Receipt, IndianRupee, Clock, CheckCircle2, AlertCircle, Search, Filter, Plus, Eye, Edit, MoreHorizontal, Download, Send, Calendar, Building2, TrendingUp, TrendingDown, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function InvoicesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const invoicesStats = [
    {
      title: "Total Invoices",
      value: "247",
      change: "+12.5%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up"
    },
    {
      title: "Outstanding Amount",
      value: "₹12.5L",
      change: "-8.2%", 
      icon: IndianRupee,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "down"
    },
    {
      title: "Paid This Month",
      value: "₹45.2L",
      change: "+15.3%",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up"
    },
    {
      title: "Overdue",
      value: "23",
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

  const filteredInvoices = invoices.filter(invoice => {
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
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
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
            <InvoicesTable invoices={filteredInvoices} />
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <InvoicesTable invoices={filteredInvoices} />
          </TabsContent>
          <TabsContent value="overdue" className="space-y-4">
            <InvoicesTable invoices={filteredInvoices} />
          </TabsContent>
          <TabsContent value="paid" className="space-y-4">
            <InvoicesTable invoices={filteredInvoices} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function InvoicesTable({ invoices }: { invoices: any[] }) {
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send to Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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