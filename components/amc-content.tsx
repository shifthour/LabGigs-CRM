"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, Calendar, Shield } from "lucide-react"

const amcContracts = [
  {
    id: "AMC-2025-001",
    fromDate: "01/04/2025",
    toDate: "31/03/2026",
    soNumber: "SO-2024-156",
    account: "TSAR Labcare",
    product: "TRICOLOR MULTICHANNEL FIBRINOMETER",
    serialNo: "TCF-2024-001",
    amount: "₹85,000",
    siteDetail: "Main Laboratory, Bangalore",
    assignedTo: "Pauline",
    createdBy: "Hari Kumar K",
    status: "Active",
    renewalDate: "31/03/2026",
  },
  {
    id: "AMC-2025-002",
    fromDate: "15/05/2025",
    toDate: "14/05/2026",
    soNumber: "SO-2024-189",
    account: "Eurofins Advinus",
    product: "LABORATORY FREEZE DRYER",
    serialNo: "LFD-2024-003",
    amount: "₹1,20,000",
    siteDetail: "Research Wing, Bangalore",
    assignedTo: "Pauline",
    createdBy: "Hari Kumar K",
    status: "Active",
    renewalDate: "14/05/2026",
  },
  {
    id: "AMC-2024-045",
    fromDate: "01/01/2024",
    toDate: "31/12/2024",
    soNumber: "SO-2023-234",
    account: "Kerala Agricultural University",
    product: "ND 1000 Spectrophotometer",
    serialNo: "ND-2023-012",
    amount: "₹47,500",
    siteDetail: "Department of Biotechnology",
    assignedTo: "Hari Kumar K",
    createdBy: "Arvind K",
    status: "Expired",
    renewalDate: "31/12/2024",
  },
  {
    id: "AMC-2025-003",
    fromDate: "01/06/2025",
    toDate: "31/05/2026",
    soNumber: "SO-2025-012",
    account: "ASN Fuels Private",
    product: "LAF-02 Application Equipment",
    serialNo: "LAF-2025-001",
    amount: "₹32,500",
    siteDetail: "Quality Control Lab",
    assignedTo: "Pauline",
    createdBy: "Hari Kumar K",
    status: "Pending Renewal",
    renewalDate: "31/05/2026",
  },
]

const statuses = ["All", "Active", "Expired", "Pending Renewal", "Cancelled", "Draft"]

export function AMCContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "pending renewal":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isRenewalDue = (renewalDate: string) => {
    const renewal = new Date(renewalDate.split("/").reverse().join("-"))
    const today = new Date()
    const daysUntilRenewal = Math.ceil((renewal.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysUntilRenewal <= 30 && daysUntilRenewal > 0
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AMC Management</h1>
          <p className="text-gray-600">Annual Maintenance Contract tracking and management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New AMC
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AMCs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">All contracts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active AMCs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewal Due</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AMC Revenue</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹67.5L</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AMC Search & Filters</CardTitle>
          <CardDescription>Filter and search through AMC contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search AMCs by ID, account, or product..."
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
          <CardTitle>AMC Contracts List</CardTitle>
          <CardDescription>Annual Maintenance Contracts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>AMC No</TableHead>
                  <TableHead>From Date</TableHead>
                  <TableHead>To Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Serial No</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amcContracts.map((amc) => (
                  <TableRow key={amc.id}>
                    <TableCell className="font-medium">{amc.id}</TableCell>
                    <TableCell>{amc.fromDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{amc.toDate}</span>
                        {isRenewalDue(amc.renewalDate) && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                            Due Soon
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{amc.account}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={amc.product}>
                        {amc.product}
                      </div>
                    </TableCell>
                    <TableCell>{amc.serialNo}</TableCell>
                    <TableCell className="font-semibold">{amc.amount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(amc.status)}>{amc.status}</Badge>
                    </TableCell>
                    <TableCell>{amc.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="w-4 h-4" />
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
