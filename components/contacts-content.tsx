"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Contact, Users, Phone, Mail, MapPin, Building2, Search, Filter, Plus, Eye, Edit, MoreHorizontal, Star, Target, TrendingUp, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ContactsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const contactsStats = [
    {
      title: "Total Contacts",
      value: "1,247",
      change: "+12.5%",
      icon: Contact,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Contacts",
      value: "1,089",
      change: "+8.2%", 
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "New This Month",
      value: "45",
      change: "+15.3%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "High Value",
      value: "89",
      change: "+5.1%",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  const contacts = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      title: "Research Director",
      company: "Kerala Agricultural University",
      phone: "+91 98765 43210",
      email: "priya.sharma@kau.in",
      location: "Thrissur, Kerala",
      status: "active",
      lastContact: "2 days ago",
      dealValue: "₹8,50,000",
      tags: ["Decision Maker", "Research"],
      priority: "high",
      avatar: "PS"
    },
    {
      id: 2,
      name: "Mr. Rajesh Kumar", 
      title: "Lab Manager",
      company: "Eurofins Advinus",
      phone: "+91 90123 45678",
      email: "rajesh.k@eurofins.com",
      location: "Bangalore, Karnataka",
      status: "active",
      lastContact: "1 week ago",
      dealValue: "₹12,75,000",
      tags: ["Hot Lead", "Procurement"],
      priority: "high",
      avatar: "RK"
    },
    {
      id: 3,
      name: "Ms. Anjali Menon",
      title: "Purchase Head",
      company: "Thermo Fisher Scientific",
      phone: "+91 87654 32109",
      email: "anjali.menon@thermofisher.com",
      location: "Chennai, Tamil Nadu",
      status: "active",
      lastContact: "3 days ago",
      dealValue: "₹6,25,000",
      tags: ["Negotiating", "Instruments"],
      priority: "medium",
      avatar: "AM"
    },
    {
      id: 4,
      name: "Dr. Anu Rang",
      title: "Senior Scientist",
      company: "JNCASR",
      phone: "+91 91234 56789",
      email: "anu.rang@jncasr.ac.in",
      location: "Bangalore, Karnataka",
      status: "active",
      lastContact: "5 days ago",
      dealValue: "₹4,50,000",
      tags: ["Research", "Academia"],
      priority: "medium",
      avatar: "AR"
    },
    {
      id: 5,
      name: "Mr. Sanjay Patel",
      title: "Operations Manager",
      company: "Bio-Rad Laboratories",
      phone: "+91 98876 54321",
      email: "sanjay.patel@biorad.com",
      location: "Mumbai, Maharashtra",
      status: "inactive",
      lastContact: "2 weeks ago",
      dealValue: "₹9,80,000",
      tags: ["Contract Pending", "Follow-up"],
      priority: "low",
      avatar: "SP"
    },
    {
      id: 6,
      name: "Ms. Pauline D'Souza",
      title: "Quality Head",
      company: "Guna Foods",
      phone: "+91 95432 10987",
      email: "pauline@gunafoods.com",
      location: "Goa",
      status: "active",
      lastContact: "4 days ago",
      dealValue: "₹3,25,000",
      tags: ["Food Testing", "Quality"],
      priority: "medium",
      avatar: "PD"
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800", 
      low: "bg-gray-100 text-gray-800"
    }
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "active") return matchesSearch && contact.status === "active"
    if (selectedTab === "high-priority") return matchesSearch && contact.priority === "high"
    if (selectedTab === "recent") return matchesSearch && ["2 days ago", "3 days ago", "4 days ago", "5 days ago"].includes(contact.lastContact)
    
    return matchesSearch
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 mt-1">Manage and track all your customer contacts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {contactsStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change} vs last month</p>
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
              placeholder="Search contacts by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="high-priority">High Priority</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ContactsTable contacts={filteredContacts} />
          </TabsContent>
          <TabsContent value="active" className="space-y-4">
            <ContactsTable contacts={filteredContacts} />
          </TabsContent>
          <TabsContent value="high-priority" className="space-y-4">
            <ContactsTable contacts={filteredContacts} />
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            <ContactsTable contacts={filteredContacts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ContactsTable({ contacts }: { contacts: any[] }) {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800", 
      low: "bg-gray-100 text-gray-800"
    }
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact List</CardTitle>
        <CardDescription>Complete overview of your contact database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Company & Title</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Deal Value</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {contact.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contact.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{contact.company}</p>
                      <p className="text-sm text-gray-500">{contact.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-1" />
                        {contact.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {contact.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(contact.status)}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadge(contact.priority)}>
                      {contact.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">{contact.dealValue}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{contact.lastContact}</span>
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
                          Edit Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Call Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Target className="mr-2 h-4 w-4" />
                          Create Opportunity
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