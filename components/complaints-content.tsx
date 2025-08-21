"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, AlertTriangle, Clock, Brain, Zap } from "lucide-react"
import { AIComplaintResolution } from "@/components/ai-complaint-resolution"
import { ComplaintData } from "@/lib/ai-services"

const complaints = [
  {
    id: "2016-17/010",
    date: "27/02/2017",
    accountName: "JNCASR",
    region: "",
    contactName: "Dr. Anu Rang",
    productService: "ND 1000 Spectrophotometer-ND 1000",
    serialNo: "",
    complaintType: "No Warranty/AMC",
    severity: "High",
    status: "New",
    closingDate: "",
    assignedTo: "Hari Kumar",
    description: "Equipment not functioning properly, requires immediate attention",
  },
  {
    id: "2016-17/009",
    date: "20/01/2017",
    accountName: "NIIVEDI",
    region: "",
    contactName: "",
    productService: "VERTICAL AUTOCLAVE (BSE-A65)",
    serialNo: "",
    complaintType: "Under Warranty",
    severity: "High",
    status: "In Progress",
    closingDate: "",
    assignedTo: "Hari Kumar",
    description: "Autoclave door seal issue, steam leakage observed",
  },
  {
    id: "2016-17/008",
    date: "13/01/2017",
    accountName: "Sri Devaraj Urs",
    region: "",
    contactName: "Dr. Dayanand",
    productService: "540NM filter for Elisa Reader",
    serialNo: "",
    complaintType: "No Warranty/AMC",
    severity: "Medium",
    status: "Resolved",
    closingDate: "25/01/2017",
    assignedTo: "Hari Kumar",
    description: "Filter replacement required for proper functioning",
  },
  {
    id: "2016-17/007",
    date: "13/01/2017",
    accountName: "Christian Medical",
    region: "",
    contactName: "Mr. Dwarkesh",
    productService: "Annual Maintenance Contract for",
    serialNo: "",
    complaintType: "Under AMC",
    severity: "Low",
    status: "Closed",
    closingDate: "20/01/2017",
    assignedTo: "Hari Kumar",
    description: "Routine maintenance completed successfully",
  },
]

const complaintTypes = ["All", "No Warranty/AMC", "Under Warranty", "Under AMC"]
const severities = ["All", "Low", "Medium", "High", "Critical"]
const statuses = ["All", "New", "In Progress", "Resolved", "Closed", "Escalated"]

export function ComplaintsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedSeverity, setSelectedSeverity] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "escalated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints Management</h1>
          <p className="text-gray-600">Track and resolve customer complaints efficiently</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Log Complaint
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">223</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Search & Filters</CardTitle>
          <CardDescription>Filter and search through complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search complaints by ID, account, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Complaint Type" />
              </SelectTrigger>
              <SelectContent>
                {complaintTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                {severities.map((severity) => (
                  <SelectItem key={severity} value={severity}>
                    {severity}
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
          <CardTitle>Complaints List</CardTitle>
          <CardDescription>1-25 of 70 complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complaint #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Product/Service</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.id}</TableCell>
                    <TableCell>{complaint.date}</TableCell>
                    <TableCell className="font-medium">{complaint.accountName}</TableCell>
                    <TableCell>{complaint.contactName || "—"}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={complaint.productService}>
                        {complaint.productService}
                      </div>
                    </TableCell>
                    <TableCell>{complaint.complaintType}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(complaint.severity)}>{complaint.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                    </TableCell>
                    <TableCell>{complaint.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="AI Resolution">
                          <Brain className="w-4 h-4" />
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

      {/* AI Complaint Resolution Section */}
      <AIComplaintResolution complaint={complaints[0] as ComplaintData} />
    </div>
  )
}
