"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, Activity, Phone, Mail, Calendar, FileText } from "lucide-react"

const activities = [
  {
    id: "ACT-001",
    date: "20/07/2025",
    type: "Call",
    account: "TSAR Labcare",
    linkTo: "Lead",
    contactName: "Mr. Mahesh",
    productService: "TRICOLOR MULTICHANNEL FIBRINOMETER",
    status: "Completed",
    assignedTo: "Pauline",
    notes: "Discussed product specifications and pricing",
  },
  {
    id: "ACT-002",
    date: "19/07/2025",
    type: "Email",
    account: "Eurofins Advinus",
    linkTo: "Opportunity",
    contactName: "Dr. Research Head",
    productService: "LABORATORY FREEZE DRYER",
    status: "Sent",
    assignedTo: "Pauline",
    notes: "Sent detailed quotation and technical specifications",
  },
  {
    id: "ACT-003",
    date: "18/07/2025",
    type: "Meeting",
    account: "ASN Fuels Private",
    linkTo: "Account",
    contactName: "Mr. Naveen G",
    productService: "LAF-02 Application",
    status: "Scheduled",
    assignedTo: "Pauline",
    notes: "Site visit scheduled for product demonstration",
  },
  {
    id: "ACT-004",
    date: "17/07/2025",
    type: "Task",
    account: "Kerala Agricultural University",
    linkTo: "Installation",
    contactName: "Dr. Department Head",
    productService: "ND 1000 Spectrophotometer",
    status: "In Progress",
    assignedTo: "Hari Kumar K",
    notes: "Installation planning and preparation",
  },
]

const activityTypes = ["All", "Call", "Email", "Meeting", "Task", "Follow-up", "Demo"]
const statuses = ["All", "Completed", "In Progress", "Scheduled", "Cancelled", "Sent"]
const linkTypes = ["All", "Lead", "Opportunity", "Account", "Installation", "Complaint", "AMC"]

export function ActivitiesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedLinkType, setSelectedLinkType] = useState("All")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "sent":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "call":
        return Phone
      case "email":
        return Mail
      case "meeting":
        return Calendar
      case "task":
        return FileText
      default:
        return Activity
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities Management</h1>
          <p className="text-gray-600">Track and manage all your sales activities</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+45 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Great progress!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Upcoming activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Search & Filters</CardTitle>
          <CardDescription>Filter and search through your activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities by account, contact, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
            <Select value={selectedLinkType} onValueChange={setSelectedLinkType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Link To" />
              </SelectTrigger>
              <SelectContent>
                {linkTypes.map((linkType) => (
                  <SelectItem key={linkType} value={linkType}>
                    {linkType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities List</CardTitle>
          <CardDescription>Recent activities and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Act #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Link To</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Product/Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => {
                  const TypeIcon = getTypeIcon(activity.type)
                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.id}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="w-4 h-4 text-gray-500" />
                          <span>{activity.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{activity.account}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{activity.linkTo}</Badge>
                      </TableCell>
                      <TableCell>{activity.contactName}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={activity.productService}>
                          {activity.productService}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                      </TableCell>
                      <TableCell>{activity.assignedTo}</TableCell>
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
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
