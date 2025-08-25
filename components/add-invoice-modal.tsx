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
import { Receipt, Plus, Minus, User, FileText, IndianRupee, Settings, Save, X, Calendar } from "lucide-react"

interface AddInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

interface InvoiceItem {
  id: string
  product: string
  description: string
  hsnCode: string
  quantity: number
  unitPrice: number
  discount: number
  taxRate: number
  taxAmount: number
  amount: number
}

interface FormData {
  // Customer Information
  accountName: string
  contactPerson: string
  customerEmail: string
  customerPhone: string
  billingAddress: string
  shippingAddress: string
  gstNumber: string
  panNumber: string
  
  // Invoice Details
  invoiceDate: string
  dueDate: string
  salesOrderRef: string
  challanNumber: string
  placeOfSupply: string
  invoiceType: string
  notes: string
  
  // Business Settings
  assignedTo: string
  priority: string
  currency: string
  paymentStatus: string
  paymentMethod: string
  
  // Tax & Compliance
  taxType: string
  reverseCharge: boolean
  exportInvoice: boolean
  eInvoice: boolean
  
  // Bank Details
  bankName: string
  accountNumber: string
  ifscCode: string
  branchName: string
}

export function AddInvoiceModal({ isOpen, onClose }: AddInvoiceModalProps) {
  const [formData, setFormData] = useState<FormData>({
    accountName: "",
    contactPerson: "",
    customerEmail: "",
    customerPhone: "",
    billingAddress: "",
    shippingAddress: "",
    gstNumber: "",
    panNumber: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    salesOrderRef: "",
    challanNumber: "",
    placeOfSupply: "",
    invoiceType: "Tax Invoice",
    notes: "",
    assignedTo: "",
    priority: "Medium",
    currency: "INR",
    paymentStatus: "Unpaid",
    paymentMethod: "Bank Transfer",
    taxType: "GST",
    reverseCharge: false,
    exportInvoice: false,
    eInvoice: false,
    bankName: "State Bank of India",
    accountNumber: "",
    ifscCode: "",
    branchName: ""
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      product: "",
      description: "",
      hsnCode: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      taxAmount: 0,
      amount: 0
    }
  ])

  const [activeTab, setActiveTab] = useState("customer")

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      product: "",
      description: "",
      hsnCode: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      taxAmount: 0,
      amount: 0
    }
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        // Calculate amounts when quantity, unit price, discount, or tax rate changes
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount' || field === 'taxRate') {
          const subtotal = updated.quantity * updated.unitPrice
          const discountAmount = subtotal * (updated.discount / 100)
          const taxableAmount = subtotal - discountAmount
          updated.taxAmount = taxableAmount * (updated.taxRate / 100)
          updated.amount = taxableAmount + updated.taxAmount
        }
        return updated
      }
      return item
    }))
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
    
    const totalDiscount = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      return sum + (itemSubtotal * item.discount / 100)
    }, 0)
    
    const taxableAmount = subtotal - totalDiscount
    const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0)
    const grandTotal = taxableAmount + totalTax
    
    // Calculate CGST, SGST for intra-state or IGST for inter-state
    const isInterState = formData.placeOfSupply !== "Karnataka" // Assuming company is in Karnataka
    const cgst = isInterState ? 0 : totalTax / 2
    const sgst = isInterState ? 0 : totalTax / 2
    const igst = isInterState ? totalTax : 0
    
    return { 
      subtotal, 
      totalDiscount, 
      taxableAmount, 
      totalTax, 
      grandTotal,
      cgst,
      sgst, 
      igst,
      isInterState
    }
  }

  const handleSubmit = () => {
    const totals = calculateTotals()
    const invoiceData = {
      ...formData,
      items,
      totals,
      invoiceId: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    }
    
    console.log("Invoice Data:", invoiceData)
    onClose()
  }

  // Options
  const accounts = ["TSAR Labcare", "Eurofins Advinus", "Kerala Agricultural University", "JNCASR", "Guna Foods", "Bio-Rad Laboratories"]
  const products = ["TRICOLOR MULTICHANNEL FIBRINOMETER", "LABORATORY FREEZE DRYER/LYOPHILIZER", "ND 1000 Spectrophotometer", "Automated Media Preparator", "Bio-Safety Cabinet"]
  const assignees = ["Hari Kumar K", "Prashanth Sandilya", "Vijay Muppala", "Pauline"]
  const priorities = ["Low", "Medium", "High", "Urgent"]
  const paymentStatuses = ["Unpaid", "Partially Paid", "Paid", "Overdue", "Cancelled"]
  const paymentMethods = ["Bank Transfer", "Cheque", "Cash", "UPI", "Credit Card", "Online Payment"]
  const invoiceTypes = ["Tax Invoice", "Proforma Invoice", "Credit Note", "Debit Note", "Export Invoice"]
  const states = ["Karnataka", "Tamil Nadu", "Kerala", "Andhra Pradesh", "Telangana", "Maharashtra", "Gujarat", "Delhi", "Other"]

  const totals = calculateTotals()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Create New Invoice</span>
          </DialogTitle>
          <DialogDescription>
            Generate GST compliant invoice for completed sales orders
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Customer</span>
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Invoice Details</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center space-x-2">
              <IndianRupee className="w-4 h-4" />
              <span>Items & Tax</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Payment & Bank</span>
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
                    <Label htmlFor="gstNumber" className="text-sm font-medium">
                      GST Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                      placeholder="29AABCU9603R1ZX"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="panNumber" className="text-sm font-medium">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange("panNumber", e.target.value)}
                      placeholder="AABCU9603R"
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
                      placeholder="accounts@customer.com"
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
                    <Label htmlFor="billingAddress" className="text-sm font-medium">
                      Billing Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="billingAddress"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                      placeholder="Complete billing address with pincode"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingAddress" className="text-sm font-medium">Shipping Address</Label>
                    <Textarea
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
                      placeholder="Shipping address (if different from billing)"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="invoiceDate" className="text-sm font-medium">
                      Invoice Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dueDate" className="text-sm font-medium">
                      Due Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="invoiceType" className="text-sm font-medium">Invoice Type</Label>
                    <Select value={formData.invoiceType} onValueChange={(value) => handleInputChange("invoiceType", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {invoiceTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salesOrderRef" className="text-sm font-medium">Sales Order Reference</Label>
                    <Input
                      id="salesOrderRef"
                      value={formData.salesOrderRef}
                      onChange={(e) => handleInputChange("salesOrderRef", e.target.value)}
                      placeholder="SO-2025-001"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="challanNumber" className="text-sm font-medium">Delivery Challan No.</Label>
                    <Input
                      id="challanNumber"
                      value={formData.challanNumber}
                      onChange={(e) => handleInputChange("challanNumber", e.target.value)}
                      placeholder="DC-001"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="placeOfSupply" className="text-sm font-medium">
                      Place of Supply <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.placeOfSupply} onValueChange={(value) => handleInputChange("placeOfSupply", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Invoice Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Special notes, payment instructions, etc."
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                {/* Compliance Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">GST & Compliance Options</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="reverseCharge"
                        checked={formData.reverseCharge}
                        onCheckedChange={(checked) => handleInputChange("reverseCharge", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="reverseCharge" className="text-sm font-medium">Reverse Charge</Label>
                        <p className="text-xs text-gray-500">Tax payable by recipient</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="exportInvoice"
                        checked={formData.exportInvoice}
                        onCheckedChange={(checked) => handleInputChange("exportInvoice", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="exportInvoice" className="text-sm font-medium">Export Invoice</Label>
                        <p className="text-xs text-gray-500">Zero-rated supply for exports</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="eInvoice"
                        checked={formData.eInvoice}
                        onCheckedChange={(checked) => handleInputChange("eInvoice", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="eInvoice" className="text-sm font-medium">E-Invoice</Label>
                        <p className="text-xs text-gray-500">Generate IRN for B2B transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Invoice Items</CardTitle>
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
                        <TableHead className="w-20">HSN Code</TableHead>
                        <TableHead className="w-16">Qty</TableHead>
                        <TableHead className="w-24">Unit Price</TableHead>
                        <TableHead className="w-16">Disc %</TableHead>
                        <TableHead className="w-16">Tax %</TableHead>
                        <TableHead className="w-24">Tax Amount</TableHead>
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
                              value={item.hsnCode}
                              onChange={(e) => updateItem(item.id, "hsnCode", e.target.value)}
                              placeholder="84219900"
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                              className="w-16"
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
                              className="w-16"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.taxRate}
                              onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)}
                              className="w-16"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            ₹{item.taxAmount.toLocaleString()}
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

                {/* Tax Summary */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-end">
                    <div className="w-96 space-y-2">
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
                      
                      {totals.isInterState ? (
                        <div className="flex justify-between">
                          <span>IGST (Integrated GST):</span>
                          <span>₹{totals.igst.toLocaleString()}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>CGST (Central GST):</span>
                            <span>₹{totals.cgst.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SGST (State GST):</span>
                            <span>₹{totals.sgst.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      
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

          <TabsContent value="payment" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Terms & Bank Details</CardTitle>
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
                    <Label htmlFor="paymentMethod" className="text-sm font-medium">Preferred Payment Method</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
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

                {/* Bank Details */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-900">Company Bank Details</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankName" className="text-sm font-medium">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="branchName" className="text-sm font-medium">Branch Name</Label>
                      <Input
                        id="branchName"
                        value={formData.branchName}
                        onChange={(e) => handleInputChange("branchName", e.target.value)}
                        placeholder="Branch name and location"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountNumber" className="text-sm font-medium">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        placeholder="Bank account number"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ifscCode" className="text-sm font-medium">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={formData.ifscCode}
                        onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                        placeholder="SBIN0001234"
                        className="mt-1"
                      />
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
              Generate Invoice
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}