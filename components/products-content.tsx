"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, Package } from "lucide-react"
import { AIProductRecommendations } from "@/components/ai-product-recommendations"
import { AddProductModal } from "@/components/add-product-modal"

const products = [
  {
    id: 1,
    branch: "SPR System-",
    category: "Affinite Instrument",
    principal: "Affinite Instrument",
    productName: "ENABLING STATIC AND FLOW-BASED SPR ANALYSIS WITH P4PRO & AFF",
    refNo: "P4PRO & AFFIUMP",
    assignedTo: "Hari Kumar K, Prashanth Sandily",
    status: "Active",
    price: "₹12,50,000",
  },
  {
    id: 2,
    branch: "Lab Setup-",
    category: "Airone Source Pvt Ltd",
    principal: "Airone Source Pvt Ltd",
    productName: "ANNEXURE I (Production Area) Raw Material",
    refNo: "",
    assignedTo: "Hari Kumar K, Prashanth Sandily",
    status: "Active",
    price: "₹8,75,000",
  },
  {
    id: 3,
    branch: "Media Preparators-",
    category: "Alliance Bio Expertise",
    principal: "Alliance Bio Expertise",
    productName: "Automated Media Preparator - 1 To 10 Liters",
    refNo: "MEDIA WEL 10",
    assignedTo: "Hari Kumar K, Prashanth Sandily",
    status: "Active",
    price: "₹15,25,000",
  },
  {
    id: 4,
    branch: "Freezer-Laboratory Freezer",
    category: "ALPHAVITA Bio Scientific",
    principal: "ALPHAVITA Bio Scientific",
    productName: "Laboratory Freezer",
    refNo: "MDF- U549HI",
    assignedTo: "Hari Kumar K, Prashanth Sandily",
    status: "Active",
    price: "₹3,45,000",
  },
  {
    id: 5,
    branch: "Bio Safety Cabinet-",
    category: "ALSIN Technology Services",
    principal: "ALSIN Technology Services",
    productName: "ABSC4-B2-SS304 -Bio-Safety cabinet B2-SS 304- ALSIN",
    refNo: "ABSC4-B2-SS304",
    assignedTo: "Hari Kumar K, Prashanth Sandily",
    status: "Active",
    price: "₹4,85,000",
  },
]

const branches = [
  "All",
  "SPR System",
  "Lab Setup",
  "Media Preparators",
  "Freezer-Laboratory Freezer",
  "Bio Safety Cabinet",
  "Water Purification System",
]
const principals = [
  "All",
  "Affinite Instrument",
  "Airone Source Pvt Ltd",
  "Alliance Bio Expertise",
  "ALPHAVITA Bio Scientific",
  "ALSIN Technology Services",
]
const statuses = ["All", "Active", "Inactive", "Discontinued"]

export function ProductsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [selectedPrincipal, setSelectedPrincipal] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "discontinued":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Catalog</h1>
          <p className="text-gray-600">Manage your laboratory equipment and products</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Catalog
          </Button>
          <Button onClick={() => setIsAddProductModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,077</div>
            <p className="text-xs text-muted-foreground">+23 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,945</div>
            <p className="text-xs text-muted-foreground">94% of catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Well organized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Product Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,96,000</div>
            <p className="text-xs text-muted-foreground">Laboratory equipment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Search & Filters</CardTitle>
          <CardDescription>Filter and search through your product catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products by name, category, or reference number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Branch/Division" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPrincipal} onValueChange={setSelectedPrincipal}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Principal" />
              </SelectTrigger>
              <SelectContent>
                {principals.map((principal) => (
                  <SelectItem key={principal} value={principal}>
                    {principal}
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
          <CardTitle>Products List</CardTitle>
          <CardDescription>1-25 of 2077 products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch/Division</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Ref. No/ID</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.branch}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.principal}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={product.productName}>
                        {product.productName}
                      </div>
                    </TableCell>
                    <TableCell>{product.refNo || "—"}</TableCell>
                    <TableCell className="font-semibold">{product.price}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={product.assignedTo}>
                        {product.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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

      {/* AI Product Recommendations Section */}
      <AIProductRecommendations
        currentProduct="LABORATORY FREEZE DRYER/LYOPHILIZER"
        customerType="Research Institution"
        context="cross-sell"
      />

      {/* AddProductModal component */}
      <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)} />
    </div>
  )
}
