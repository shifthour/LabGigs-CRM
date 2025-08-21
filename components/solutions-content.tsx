"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, Beaker, Lightbulb } from "lucide-react"

const solutions = [
  {
    id: "SOL-001",
    title: "Complete Laboratory Setup for Biotechnology Research",
    category: "Laboratory Setup",
    client: "Biotech Research Institute",
    description: "End-to-end laboratory setup including equipment, safety systems, and workflow optimization",
    status: "Implemented",
    value: "₹45,00,000",
    startDate: "15/03/2025",
    completionDate: "20/06/2025",
    assignedTo: "Hari Kumar K",
    products: ["Biosafety Cabinet", "Centrifuge", "Incubator", "Autoclave"],
  },
  {
    id: "SOL-002",
    title: "Quality Control Laboratory for Pharmaceutical Company",
    category: "QC Laboratory",
    client: "PharmaCorp Ltd",
    description: "Comprehensive QC lab setup with analytical instruments and compliance systems",
    status: "In Progress",
    value: "₹67,50,000",
    startDate: "01/05/2025",
    completionDate: "30/08/2025",
    assignedTo: "Pauline",
    products: ["HPLC System", "Spectrophotometer", "Dissolution Tester", "Balance"],
  },
  {
    id: "SOL-003",
    title: "Food Testing Laboratory Modernization",
    category: "Food Testing",
    client: "Food Safety Authority",
    description: "Upgrade existing food testing lab with modern equipment and automation",
    status: "Proposed",
    value: "₹32,75,000",
    startDate: "15/08/2025",
    completionDate: "15/11/2025",
    assignedTo: "Arvind K",
    products: ["PCR System", "Microbiological Analyzer", "Chromatography System"],
  },
  {
    id: "SOL-004",
    title: "Environmental Testing Laboratory",
    category: "Environmental",
    client: "Environmental Monitoring Agency",
    description: "Complete environmental testing lab with water, air, and soil analysis capabilities",
    status: "Planning",
    value: "₹28,90,000",
    startDate: "01/09/2025",
    completionDate: "31/12/2025",
    assignedTo: "Hari Kumar K",
    products: ["Water Analyzer", "Air Quality Monitor", "Soil Testing Kit"],
  },
]

const categories = ["All", "Laboratory Setup", "QC Laboratory", "Food Testing", "Environmental", "Research", "Clinical"]
const statuses = ["All", "Proposed", "Planning", "In Progress", "Implemented", "On Hold", "Completed"]

export function SolutionsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "proposed":
        return "bg-blue-100 text-blue-800"
      case "planning":
        return "bg-purple-100 text-purple-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "implemented":
        return "bg-green-100 text-green-800"
      case "on hold":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laboratory Solutions</h1>
          <p className="text-gray-600">Comprehensive laboratory solutions and project management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Solution
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solutions</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+8 this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8.5Cr</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Project completion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solution Search & Filters</CardTitle>
          <CardDescription>Filter and search through your laboratory solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search solutions by title, client, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
          <CardTitle>Solutions List</CardTitle>
          <CardDescription>Laboratory solutions and project portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solution ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.map((solution) => (
                  <TableRow key={solution.id}>
                    <TableCell className="font-medium">{solution.id}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate font-medium" title={solution.title}>
                        {solution.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate" title={solution.description}>
                        {solution.description}
                      </div>
                    </TableCell>
                    <TableCell>{solution.category}</TableCell>
                    <TableCell className="font-medium">{solution.client}</TableCell>
                    <TableCell className="font-semibold">{solution.value}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(solution.status)}>{solution.status}</Badge>
                    </TableCell>
                    <TableCell>{solution.startDate}</TableCell>
                    <TableCell>{solution.completionDate}</TableCell>
                    <TableCell>{solution.assignedTo}</TableCell>
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
