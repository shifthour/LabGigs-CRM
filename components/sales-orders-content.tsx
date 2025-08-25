"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, ShoppingCart, Truck, Upload } from "lucide-react"
import { AddSalesOrderModal } from "@/components/add-sales-order-modal"
import { DataImportModal } from "@/components/data-import-modal"
import { useToast } from "@/hooks/use-toast"
import storageService from "@/lib/localStorage-service"

const salesOrders = [
  {
    id: "SO-2025-001",
    date: "20/07/2025",
    account: "TSAR Labcare",
    contactName: "Mr. Mahesh",
    product: "TRICOLOR MULTICHANNEL FIBRINOMETER",
    amount: "₹8,50,000",
    status: "Confirmed",
    deliveryDate: "15/08/2025",
    assignedTo: "Pauline",
    paymentStatus: "Advance Received",
  },
  {
    id: "SO-2025-002",
    date: "18/07/2025",
    account: "Eurofins Advinus",
    contactName: "Dr. Research Head",
    product: "LABORATORY FREEZE DRYER/LYOPHILIZER",
    amount: "₹12,00,000",
    status: "Processing",
    deliveryDate: "25/08/2025",
    assignedTo: "Pauline",
    paymentStatus: "Pending",
  },
  {
    id: "SO-2025-003",
    date: "15/07/2025",
    account: "Kerala Agricultural University",
    contactName: "Dr. Department Head",
    product: "ND 1000 Spectrophotometer",
    amount: "₹4,75,000",
    status: "Delivered",
    deliveryDate: "10/07/2025",
    assignedTo: "Hari Kumar K",
    paymentStatus: "Paid",
  },
  {
    id: "SO-2025-004",
    date: "12/07/2025",
    account: "ASN Fuels Private",
    contactName: "Mr. Naveen G",
    product: "LAF-02 Application Equipment",
    amount: "₹3,25,000",
    status: "Shipped",
    deliveryDate: "20/07/2025",
    assignedTo: "Pauline",
    paymentStatus: "Advance Received",
  },
]

const statuses = ["All", "Draft", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]
const paymentStatuses = ["All", "Pending", "Advance Received", "Paid", "Overdue"]

export function SalesOrdersContent() {
  const { toast } = useToast()
  const [salesOrdersList, setSalesOrdersList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [salesOrdersStats, setSalesOrdersStats] = useState({
    total: 0,
    totalValue: 0,
    pendingDelivery: 0,
    avgValue: 0
  })
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All")
  const [isAddSalesOrderModalOpen, setIsAddSalesOrderModalOpen] = useState(false)
  const [isDataImportModalOpen, setIsDataImportModalOpen] = useState(false)

  // Load sales orders from localStorage on component mount
  useEffect(() => {
    loadSalesOrders()
  }, [])

  const loadSalesOrders = () => {
    const storedOrders = storageService.getAll<any>('salesOrders')
    console.log("loadSalesOrders - storedOrders:", storedOrders)
    setSalesOrdersList(storedOrders)
    
    // Calculate stats
    const stats = storageService.getStats('salesOrders')
    const pendingDelivery = storedOrders.filter(order => 
      order.status === 'Confirmed' || order.status === 'Processing' || order.status === 'Shipped'
    ).length
    
    const totalValue = storedOrders.reduce((sum, order) => {
      const value = parseFloat(order.amount?.replace(/[₹,]/g, '') || '0')
      return sum + value
    }, 0)
    
    const avgValue = storedOrders.length > 0 ? totalValue / storedOrders.length : 0
    
    setSalesOrdersStats({
      total: stats.total,
      totalValue: totalValue,
      pendingDelivery: pendingDelivery,
      avgValue: avgValue
    })
  }
  
  const handleSaveSalesOrder = (salesOrderData: any) => {
    console.log("handleSaveSalesOrder called with:", salesOrderData)
    
    const newSalesOrder = storageService.create('salesOrders', salesOrderData)
    console.log("New sales order created:", newSalesOrder)
    
    if (newSalesOrder) {
      // Force immediate refresh from localStorage
      const refreshedOrders = storageService.getAll<any>('salesOrders')
      console.log("Force refresh - all sales orders:", refreshedOrders)
      setSalesOrdersList(refreshedOrders)
      
      // Update stats
      loadSalesOrders()
      
      toast({
        title: "Sales order created",
        description: `Sales order ${newSalesOrder.id || newSalesOrder.orderId} has been successfully created.`
      })
      setIsAddSalesOrderModalOpen(false)
    } else {
      console.error("Failed to create sales order")
      toast({
        title: "Error",
        description: "Failed to create sales order",
        variant: "destructive"
      })
    }
  }
  
  const handleImportData = (importedOrders: any[]) => {
    console.log('Imported sales orders:', importedOrders)
    const createdOrders = storageService.createMany('salesOrders', importedOrders)
    
    // Immediately add imported orders to state
    setSalesOrdersList(prevOrders => [...prevOrders, ...createdOrders])
    
    // Update stats
    loadSalesOrders()
    
    toast({
      title: "Data imported",
      description: `Successfully imported ${createdOrders.length} sales orders.`
    })
  }
  
  // Filter orders based on search and filters
  const filteredOrders = salesOrdersList.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.account?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "All" || order.paymentStatus === selectedPaymentStatus

    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "advance received":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600">Manage and track your sales orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsDataImportModalOpen(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Orders
          </Button>
          <Button onClick={() => setIsAddSalesOrderModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOrdersStats.total}</div>
            <p className="text-xs text-muted-foreground">+{storageService.getStats('salesOrders').thisMonthCount} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(salesOrdersStats.totalValue / 10000000).toFixed(1)}Cr</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOrdersStats.pendingDelivery}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{salesOrdersStats.avgValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Search & Filters</CardTitle>
          <CardDescription>Filter and search through your sales orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders by ID, account, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((status) => (
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
          <CardTitle>Sales Orders List</CardTitle>
          <CardDescription>Showing {filteredOrders.length} of {salesOrdersList.length} sales orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="font-medium">{order.account}</TableCell>
                    <TableCell>{order.contactName}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={order.product}>
                        {order.product}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{order.amount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    </TableCell>
                    <TableCell>{order.deliveryDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Track">
                          <Truck className="w-4 h-4" />
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

      {/* Add Sales Order Modal */}
      <AddSalesOrderModal
        isOpen={isAddSalesOrderModalOpen}
        onClose={() => setIsAddSalesOrderModalOpen(false)}
        onSave={handleSaveSalesOrder}
      />
      
      {/* DataImportModal component */}
      <DataImportModal 
        isOpen={isDataImportModalOpen} 
        onClose={() => setIsDataImportModalOpen(false)}
        moduleType="salesOrders"
        onImport={handleImportData}
      />
    </div>
  )
}
