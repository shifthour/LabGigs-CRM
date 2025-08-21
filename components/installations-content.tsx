"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, Wrench, CheckCircle } from "lucide-react"

const installations = [
  {
    id: "INST-2025-001",
    date: "20/07/2025",
    soNumber: "SO-2025-001",
    account: "TSAR Labcare",
    product: "TRICOLOR MULTICHANNEL FIBRINOMETER",
    serialNo: "TCF-2025-001",
    warrantyStatus: "Under Warranty",
    status: "Completed",
    siteDetail: "Main Laboratory, 2nd Floor, Bangalore",
    assignedTo: "Pauline",
    installationDoneBy: "Technical Team A",
    completionDate: "22/07/2025",
  },
  {
    id: "INST-2025-002",
    date: "18/07/2025",
    soNumber: "SO-2025-002",
    account: "Eurofins Advinus",
    product: "LABORATORY FREEZE DRYER/LYOPHILIZER",
    serialNo: "LFD-2025-002",
    warrantyStatus: "Under Warranty",
    status: "In Progress",
    siteDetail: "Research Wing, Clean Room 3",
    assignedTo: "Pauline",
    installationDoneBy: "Technical Team B",
    completionDate: "",
  },
  {
    id: "INST-2025-003",
    date: "15/07/2025",
    soNumber: "SO-2025-003",
    account: "Kerala Agricultural University",
    product: "ND 1000 Spectrophotometer",
    serialNo: "ND-2025-003",
    warrantyStatus: "Under Warranty",
    status: "Scheduled",
    siteDetail: "Department of Biotechnology, Lab 201",
    assignedTo: "Hari Kumar K",
    installationDoneBy: "Technical Team A",
    completionDate: "",
  },
  {
    id: "INST-2025-004",
    date: "12/07/2025",
    soNumber: "SO-2025-004",
    account: "ASN Fuels Private",
    product: "LAF-02 Application Equipment",
    serialNo: "LAF-2025-004",
    warrantyStatus: "Under Warranty",
    status: "Pending",
    siteDetail: "Quality Control Laboratory",
    assignedTo: "Pauline",
    installationDoneBy: "",
    completionDate: "",
  },
]

const statuses = ["All", "Pending", "Scheduled", "In Progress", "Completed", "On Hold", "Cancelled"]
const warrantyStatuses = ["All", "Under Warranty", "Warranty Expired", "Extended Warranty"]

export function InstallationsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedWarrantyStatus, setSelectedWarrantyStatus] = useState("All")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "on hold":
        return "bg-orange-100 text-orange-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getWarrantyColor = (warranty: string) => {
    switch (warranty.toLowerCase()) {
      case "under warranty":
        return "bg-green-100 text-green-800"
      case "warranty expired":
        return "bg-red-100 text-red-800"
      case "extended warranty":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Installations Management</h1>
          <p className="text-gray-600">Track and manage equipment installations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Installation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Installations</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">198</div>
            <p className="text-xs text-muted-foreground">85% success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Active installations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3</div>
            <p className="text-xs text-muted-foreground">Days per installation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Installation Search & Filters</CardTitle>
          <CardDescription>Filter and search through installations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search installations by ID, account, or product..."
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
            <Select value={selectedWarrantyStatus} onValueChange={setSelectedWarrantyStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Warranty Status" />
              </SelectTrigger>
              <SelectContent>
                {warrantyStatuses.map((warranty) => (
                  <SelectItem key={warranty} value={warranty}>
                    {warranty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installations List</CardTitle>
          <CardDescription>Equipment installations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ins No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>SO#</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Serial No</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Site Detail</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installations.map((installation) => (
                  <TableRow key={installation.id}>
                    <TableCell className="font-medium">{installation.id}</TableCell>
                    <TableCell>{installation.date}</TableCell>
                    <TableCell>{installation.soNumber}</TableCell>
                    <TableCell className="font-medium">{installation.account}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={installation.product}>
                        {installation.product}
                      </div>
                    </TableCell>
                    <TableCell>{installation.serialNo}</TableCell>
                    <TableCell>
                      <Badge className={getWarrantyColor(installation.warrantyStatus)}>
                        {installation.warrantyStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(installation.status)}>{installation.status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={installation.siteDetail}>
                        {installation.siteDetail}
                      </div>
                    </TableCell>
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
