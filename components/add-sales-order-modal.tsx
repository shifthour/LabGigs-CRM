"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Plus, Minus, User, FileText, Truck, Settings, Save, X, Calendar } from "lucide-react"

interface AddSalesOrderModalProps {
  isOpen: boolean
  onClose: () => void
}

interface OrderItem {
  id: string
  product: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  taxRate: number
  amount: number
  deliveryDate: string
}

interface FormData {
  // Customer Information
  accountName: string
  contactPerson: string
  customerEmail: string
  customerPhone: string
  billingAddress: string
  shippingAddress: string
  
  // Order Details
  orderDate: string
  quotationRef: string
  customerPO: string
  expectedDelivery: string
  shippingMethod: string
  notes: string
  
  // Payment & Business
  assignedTo: string
  priority: string
  currency: string
  paymentStatus: string
  paymentTerms: string
  advanceAmount: string
  
  // Logistics
  installationRequired: boolean
  trainingRequired: boolean
  warrantyPeriod: string
  serviceContract: boolean
}

export function AddSalesOrderModal({ isOpen, onClose }: AddSalesOrderModalProps) {
  const [formData, setFormData] = useState<FormData>({
    accountName: "",
    contactPerson: "",
    customerEmail: "",
    customerPhone: "",
    billingAddress: "",
    shippingAddress: "",
    orderDate: new Date().toISOString().split('T')[0],
    quotationRef: "",
    customerPO: "",
    expectedDelivery: "",
    shippingMethod: "Standard Delivery",
    notes: "",
    assignedTo: "",
    priority: "Medium",
    currency: "INR",
    paymentStatus: "Pending",
    paymentTerms: "50% Advance, 50% on Delivery",
    advanceAmount: "",
    installationRequired: false,
    trainingRequired: false,
    warrantyPeriod: "12 months",
    serviceContract: false
  })

  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "1",
      product: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      amount: 0,
      deliveryDate: ""
    }
  ])

  const [activeTab, setActiveTab] = useState("customer")

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      product: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      amount: 0,
      deliveryDate: ""
    }
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        // Calculate amount when quantity, unit price, or discount changes
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const subtotal = updated.quantity * updated.unitPrice
          const discountAmount = subtotal * (updated.discount / 100)
          const taxableAmount = subtotal - discountAmount
          const taxAmount = taxableAmount * (updated.taxRate / 100)
          updated.amount = taxableAmount + taxAmount
        }
        return updated
      }
      return item
    }))
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      return sum + itemSubtotal
    }, 0)
    
    const totalDiscount = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      return sum + (itemSubtotal * item.discount / 100)
    }, 0)
    
    const taxableAmount = subtotal - totalDiscount
    const totalTax = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const itemDiscount = itemSubtotal * (item.discount / 100)
      const itemTaxable = itemSubtotal - itemDiscount
      return sum + (itemTaxable * item.taxRate / 100)
    }, 0)
    
    const grandTotal = taxableAmount + totalTax
    
    return { subtotal, totalDiscount, taxableAmount, totalTax, grandTotal }
  }

  const handleSubmit = () => {
    const totals = calculateTotals()
    const salesOrderData = {
      ...formData,
      items,
      totals,
      orderId: `SO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    }
    
    console.log("Sales Order Data:", salesOrderData)
    onClose()
  }

  // Options
  const accounts = ["TSAR Labcare", "Eurofins Advinus", "Kerala Agricultural University", "JNCASR", "Guna Foods", "Bio-Rad Laboratories"]
  const products = ["TRICOLOR MULTICHANNEL FIBRINOMETER", "LABORATORY FREEZE DRYER/LYOPHILIZER", "ND 1000 Spectrophotometer", "Automated Media Preparator", "Bio-Safety Cabinet"]
  const assignees = ["Hari Kumar K", "Prashanth Sandilya", "Vijay Muppala", "Pauline"]
  const priorities = ["Low", "Medium", "High", "Urgent"]
  const paymentStatuses = ["Pending", "Advance Received", "Partially Paid", "Paid", "Overdue"]
  const shippingMethods = ["Standard Delivery", "Express Delivery", "Customer Pickup", "Installation Service"]
  const warrantyPeriods = ["6 months", "12 months", "18 months", "24 months", "36 months"]

  const totals = calculateTotals()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <span>Create Sales Order</span>
          </DialogTitle>
          <DialogDescription>
            Convert quotation to confirmed sales order with delivery terms
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Customer</span>
            </TabsTrigger>
            <TabsTrigger value="order" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Order Details</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Items</span>
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Delivery & Terms</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountName" className="text-sm font-medium">
                      Account Name <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.accountName} onValueChange={(value) => handleInputChange("accountName", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account} value={account}>{account}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contactPerson" className="text-sm font-medium">
                      Contact Person <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                      placeholder="Primary contact person"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      placeholder="customer@example.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingAddress" className="text-sm font-medium">Billing Address</Label>
                    <Textarea
                      id="billingAddress"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                      placeholder="Enter billing address"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingAddress" className="text-sm font-medium">Shipping Address</Label>
                    <Textarea
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
                      placeholder="Enter shipping address"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="order" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="orderDate" className="text-sm font-medium">
                      Order Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={formData.orderDate}
                      onChange={(e) => handleInputChange("orderDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quotationRef" className="text-sm font-medium">Quotation Reference</Label>
                    <Input
                      id="quotationRef"
                      value={formData.quotationRef}
                      onChange={(e) => handleInputChange("quotationRef", e.target.value)}
                      placeholder="QTN-2025-001"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPO" className="text-sm font-medium">Customer PO Number</Label>
                    <Input
                      id="customerPO"
                      value={formData.customerPO}
                      onChange={(e) => handleInputChange("customerPO", e.target.value)}
                      placeholder="Customer purchase order"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expectedDelivery" className="text-sm font-medium">
                      Expected Delivery <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expectedDelivery"
                      type="date"
                      value={formData.expectedDelivery}
                      onChange={(e) => handleInputChange("expectedDelivery", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingMethod" className="text-sm font-medium">Shipping Method</Label>
                    <Select value={formData.shippingMethod} onValueChange={(value) => handleInputChange("shippingMethod", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingMethods.map((method) => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Order Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Special instructions, delivery notes, etc."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Order Items</CardTitle>
                <Button onClick={addItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product/Service</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-20">Qty</TableHead>
                        <TableHead className="w-24">Unit Price</TableHead>
                        <TableHead className="w-20">Discount %</TableHead>
                        <TableHead className="w-20">Tax %</TableHead>
                        <TableHead className="w-32">Delivery Date</TableHead>
                        <TableHead className="w-24">Amount</TableHead>
                        <TableHead className="w-12">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select
                              value={item.product}
                              onValueChange={(value) => updateItem(item.id, "product", value)}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product} value={product}>{product}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, "description", e.target.value)}
                              placeholder="Product description"
                              className="w-48"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={item.discount}
                              onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.taxRate}
                              onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={item.deliveryDate}
                              onChange={(e) => updateItem(item.id, "deliveryDate", e.target.value)}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            ₹{item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {items.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals Summary */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-end">
                    <div className="w-80 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{totals.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Discount:</span>
                        <span>- ₹{totals.totalDiscount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxable Amount:</span>
                        <span>₹{totals.taxableAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Tax:</span>
                        <span>₹{totals.totalTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Grand Total:</span>
                        <span>₹{totals.grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment & Delivery Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignedTo" className="text-sm font-medium">
                      Assigned To <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignees.map((assignee) => (
                          <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="paymentStatus" className="text-sm font-medium">Payment Status</Label>
                    <Select value={formData.paymentStatus} onValueChange={(value) => handleInputChange("paymentStatus", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="paymentTerms" className="text-sm font-medium">Payment Terms</Label>
                    <Input
                      id="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="advanceAmount" className="text-sm font-medium">Advance Amount (₹)</Label>
                    <Input
                      id="advanceAmount"
                      type="number"
                      step="0.01"
                      value={formData.advanceAmount}
                      onChange={(e) => handleInputChange("advanceAmount", e.target.value)}
                      placeholder="Advance received"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="warrantyPeriod" className="text-sm font-medium">Warranty Period</Label>
                    <Select value={formData.warrantyPeriod} onValueChange={(value) => handleInputChange("warrantyPeriod", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {warrantyPeriods.map((period) => (
                          <SelectItem key={period} value={period}>{period}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Service Options */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Additional Services</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="installationRequired"
                        checked={formData.installationRequired}
                        onCheckedChange={(checked) => handleInputChange("installationRequired", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="installationRequired" className="text-sm font-medium">Installation Required</Label>
                        <p className="text-xs text-gray-500">Professional installation service</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="trainingRequired"
                        checked={formData.trainingRequired}
                        onCheckedChange={(checked) => handleInputChange("trainingRequired", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="trainingRequired" className="text-sm font-medium">Training Required</Label>
                        <p className="text-xs text-gray-500">User training and documentation</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="serviceContract"
                        checked={formData.serviceContract}
                        onCheckedChange={(checked) => handleInputChange("serviceContract", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="serviceContract" className="text-sm font-medium">Annual Service Contract</Label>
                        <p className="text-xs text-gray-500">Extended maintenance support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <div className="flex space-x-2">
            <Button onClick={handleSubmit} variant="outline">
              Save as Draft
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}