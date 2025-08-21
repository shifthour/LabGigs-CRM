"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, Phone, Mail, Building2 } from "lucide-react"
import { AddAccountModal } from "./add-account-modal"

const accounts = [
  {
    id: 1,
    accountName: "3B BlackBio Biotech India Ltd.",
    city: "BHOPAL/Madhya Pradesh/India",
    region: "Central",
    area: "MP",
    contactName: "Dr. Akhilesh R",
    contactNo: "+91-755-407784",
    assignedTo: "Hari Kumar K",
    industry: "Biotechnology",
    status: "Active",
    lastActivity: "2 days ago",
  },
  {
    id: 2,
    accountName: "3M India Ltd.",
    city: "BANGALORE/Karnataka/India",
    region: "South",
    area: "KA",
    contactName: "D J Balaji Rao",
    contactNo: "",
    assignedTo: "Hari Kumar K",
    industry: "Manufacturing",
    status: "Active",
    lastActivity: "1 week ago",
  },
  {
    id: 3,
    accountName: "A E International",
    city: "/DHAKA/Bangladesh",
    region: "International",
    area: "BD",
    contactName: "Md. Rasel Shah",
    contactNo: "",
    assignedTo: "Hari Kumar K",
    industry: "Trading",
    status: "Active",
    lastActivity: "3 days ago",
  },
  {
    id: 4,
    accountName: "A Molecular Research Center",
    city: "Ahmedabad/Gujarat/India",
    region: "West",
    area: "GJ",
    contactName: "Supratech Geno",
    contactNo: "",
    assignedTo: "Arvind K",
    industry: "Research",
    status: "Active",
    lastActivity: "5 days ago",
  },
  {
    id: 5,
    accountName: "TSAR Labcare",
    city: "BANGALORE/Karnataka",
    region: "South",
    area: "KA",
    contactName: "Mr. Mahesh",
    contactNo: "",
    assignedTo: "Pauline",
    industry: "Laboratory Services",
    status: "Active",
    lastActivity: "1 day ago",
  },
]

const regions = ["All", "North", "South", "East", "West", "Central", "International"]
const industries = ["All", "Biotechnology", "Manufacturing", "Trading", "Research", "Laboratory Services", "Healthcare"]
const statuses = ["All", "Active", "Inactive", "Prospect"]

export function AccountsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedIndustry, setSelectedIndustry] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "prospect":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts Management</h1>
          <p className="text-gray-600">Manage your customer accounts and relationships</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddAccountModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,899</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,654</div>
            <p className="text-xs text-muted-foreground">94% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Region</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">South</div>
            <p className="text-xs text-muted-foreground">1,245 accounts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Search & Filters</CardTitle>
          <CardDescription>Filter and search through your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search accounts by name, contact, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
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
          <CardTitle>Accounts List</CardTitle>
          <CardDescription>1-25 of 3899 accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>City/State/Country</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Contact No</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.accountName}</TableCell>
                    <TableCell>{account.city}</TableCell>
                    <TableCell>{account.region}</TableCell>
                    <TableCell>{account.contactName}</TableCell>
                    <TableCell>{account.contactNo || "—"}</TableCell>
                    <TableCell>{account.industry}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
                    </TableCell>
                    <TableCell>{account.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
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

      {/* Add Account Modal */}
      <AddAccountModal isOpen={isAddAccountModalOpen} onClose={() => setIsAddAccountModalOpen(false)} />
    </div>
  )
}
