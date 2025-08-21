"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, FileText, Send, Printer } from "lucide-react"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

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
          <Button>
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
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting customer response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">+5% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹28,50,000</div>
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
          <CardDescription>All quotations and their current status</CardDescription>
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
                {quotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.id}</TableCell>
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
                        <Button variant="ghost" size="sm" title="Edit">
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
