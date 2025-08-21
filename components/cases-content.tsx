"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ticket, AlertCircle, CheckCircle2, Clock, User, Calendar, Search, Filter, Plus, Eye, Edit, MoreHorizontal, MessageSquare, Phone, Mail, TrendingUp, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CasesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const casesStats = [
    {
      title: "Total Cases",
      value: "247",
      change: "+8.2%",
      icon: Ticket,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Open Cases",
      value: "89",
      change: "+12.5%", 
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Resolved",
      value: "142",
      change: "+15.3%",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Resolution",
      value: "2.4 days",
      change: "-18.5%",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const cases = [
    {
      id: "CASE-2024-001",
      title: "Fibrinometer calibration issue",
      customer: "Kerala Agricultural University",
      contact: "Dr. Priya Sharma",
      priority: "high",
      status: "open",
      category: "Technical Support",
      createdDate: "2024-08-18",
      lastUpdate: "2 hours ago",
      assignedTo: "Rajesh Kumar",
      description: "Equipment showing inconsistent readings after recent software update",
      customerSatisfaction: null
    },
    {
      id: "CASE-2024-002", 
      title: "Missing accessories in shipment",
      customer: "Eurofins Advinus",
      contact: "Mr. Mahesh Patel",
      priority: "medium",
      status: "in-progress",
      category: "Delivery Issue",
      createdDate: "2024-08-17",
      lastUpdate: "1 day ago",
      assignedTo: "Anjali Menon",
      description: "Centrifuge accessories not included in latest order delivery",
      customerSatisfaction: null
    },
    {
      id: "CASE-2024-003",
      title: "Training request for new staff",
      customer: "TSAR Labcare",
      contact: "Ms. Pauline D'Souza",
      priority: "low",
      status: "resolved",
      category: "Training",
      createdDate: "2024-08-15",
      lastUpdate: "3 days ago",
      assignedTo: "Sanjay Verma",
      description: "On-site training needed for 5 new lab technicians",
      customerSatisfaction: 5
    },
    {
      id: "CASE-2024-004",
      title: "Software license activation problem",
      customer: "JNCASR",
      contact: "Dr. Anu Rang",
      priority: "high",
      status: "escalated",
      category: "Software Issue",
      createdDate: "2024-08-16",
      lastUpdate: "6 hours ago",
      assignedTo: "Technical Team",
      description: "Unable to activate premium features after license upgrade",
      customerSatisfaction: null
    },
    {
      id: "CASE-2024-005",
      title: "Warranty claim for defective part",
      customer: "Bio-Rad Laboratories",
      contact: "Mr. Sanjay Patel",
      priority: "medium",
      status: "pending",
      category: "Warranty",
      createdDate: "2024-08-19",
      lastUpdate: "4 hours ago",
      assignedTo: "Warranty Team",
      description: "Microscope objective lens showing manufacturing defect",
      customerSatisfaction: null
    },
    {
      id: "CASE-2024-006",
      title: "Installation scheduling request",
      customer: "Thermo Fisher Scientific",
      contact: "Ms. Anjali Menon",
      priority: "medium",
      status: "resolved",
      category: "Installation",
      createdDate: "2024-08-14",
      lastUpdate: "5 days ago",
      assignedTo: "Installation Team",
      description: "Schedule installation for new spectrometer equipment",
      customerSatisfaction: 4
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "bg-red-100 text-red-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      escalated: "bg-purple-100 text-purple-800",
      pending: "bg-gray-100 text-gray-800",
      closed: "bg-blue-100 text-blue-800"
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800", 
      low: "bg-green-100 text-green-800"
    }
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "open") return matchesSearch && caseItem.status === "open"
    if (selectedTab === "high-priority") return matchesSearch && caseItem.priority === "high"
    if (selectedTab === "resolved") return matchesSearch && caseItem.status === "resolved"
    
    return matchesSearch
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Cases</h1>
          <p className="text-gray-500 mt-1">Track and manage customer support cases and feedback</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Case
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {casesStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.title === "Avg Resolution" ? "text-green-600" : "text-blue-600"}`}>
                    {stat.change} vs last month
                  </p>
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
              placeholder="Search cases by ID, title, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All Cases</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="high-priority">High Priority</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <CasesTable cases={filteredCases} />
          </TabsContent>
          <TabsContent value="open" className="space-y-4">
            <CasesTable cases={filteredCases} />
          </TabsContent>
          <TabsContent value="high-priority" className="space-y-4">
            <CasesTable cases={filteredCases} />
          </TabsContent>
          <TabsContent value="resolved" className="space-y-4">
            <CasesTable cases={filteredCases} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CasesTable({ cases }: { cases: any[] }) {
  const getStatusBadge = (status: string) => {
    const variants = {
      open: "bg-red-100 text-red-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      escalated: "bg-purple-100 text-purple-800",
      pending: "bg-gray-100 text-gray-800",
      closed: "bg-blue-100 text-blue-800"
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800", 
      low: "bg-green-100 text-green-800"
    }
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cases Overview</CardTitle>
        <CardDescription>Complete list of customer support cases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Title & Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>
                    <div className="font-mono text-sm">{caseItem.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{caseItem.title}</p>
                      <p className="text-sm text-gray-500">{caseItem.customer}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-3 h-3 mr-1" />
                      {caseItem.contact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadge(caseItem.priority)}>
                      {caseItem.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(caseItem.status)}>
                      {caseItem.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{caseItem.category}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{caseItem.assignedTo}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {caseItem.lastUpdate}
                    </div>
                  </TableCell>
                  <TableCell>
                    {caseItem.customerSatisfaction ? (
                      <div className="flex items-center space-x-1">
                        {renderStars(caseItem.customerSatisfaction)}
                        <span className="text-sm text-gray-600 ml-1">
                          ({caseItem.customerSatisfaction}/5)
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Case
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Comment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Call Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
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