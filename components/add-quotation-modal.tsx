"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Plus, Minus, User, Building, Calculator, Settings, Save, X } from "lucide-react"

interface AddQuotationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (quotationData: any) => void
  editingQuotation?: any
}

interface QuotationItem {
  id: string
  product: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  taxRate: number
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
  
  // Quotation Details
  quotationDate: string
  validUntil: string
  reference: string
  subject: string
  notes: string
  terms: string
  
  // Business Settings
  assignedTo: string
  priority: string
  currency: string
  taxType: string
  paymentTerms: string
  deliveryTerms: string
}

export function AddQuotationModal({ isOpen, onClose, onSave, editingQuotation }: AddQuotationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    accountName: editingQuotation?.accountName || "",
    contactPerson: editingQuotation?.contactName || "",
    customerEmail: editingQuotation?.customerEmail || "",
    customerPhone: editingQuotation?.customerPhone || "",
    billingAddress: editingQuotation?.billingAddress || "",
    shippingAddress: editingQuotation?.shippingAddress || "",
    quotationDate: editingQuotation?.quotationDate || new Date().toISOString().split('T')[0],
    validUntil: editingQuotation?.validUntil || "",
    reference: editingQuotation?.reference || "",
    subject: editingQuotation?.subject || "",
    notes: editingQuotation?.notes || "",
    terms: editingQuotation?.terms || "Payment: 50% advance, 50% on delivery\nDelivery: 4-6 weeks from order confirmation\nValidity: 30 days from quotation date",
    assignedTo: editingQuotation?.assignedTo || "",
    priority: editingQuotation?.priority || "Medium",
    currency: editingQuotation?.currency || "INR",
    taxType: editingQuotation?.taxType || "GST",
    paymentTerms: editingQuotation?.paymentTerms || "50% Advance, 50% on Delivery",
    deliveryTerms: editingQuotation?.deliveryTerms || "4-6 weeks"
  })

  const [items, setItems] = useState<QuotationItem[]>(
    editingQuotation?.items || [
      {
        id: "1",
        product: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 18,
        amount: 0
      }
    ]
  )

  const [activeTab, setActiveTab] = useState("customer")

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      product: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      amount: 0
    }
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
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
    const quotationData = {
      ...formData,
      items,
      totals,
      quotationId: editingQuotation?.quotationId || `QTN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      status: editingQuotation?.status || "Draft",
      date: editingQuotation?.date || new Date().toLocaleDateString('en-GB'),
      amount: `₹${totals.grandTotal.toLocaleString()}`,
      revision: editingQuotation?.revision || "Rev-0"
    }
    
    console.log("Quotation Data:", quotationData)
    
    if (onSave) {
      onSave(quotationData)
    } else {
      onClose()
    }
  }

  // Options
  const accounts = ["TSAR Labcare", "Eurofins Advinus", "Kerala Agricultural University", "JNCASR", "Guna Foods", "Bio-Rad Laboratories"]
  const products = ["TRICOLOR MULTICHANNEL FIBRINOMETER", "LABORATORY FREEZE DRYER/LYOPHILIZER", "ND 1000 Spectrophotometer", "Automated Media Preparator", "Bio-Safety Cabinet"]
  const assignees = ["Hari Kumar K", "Prashanth Sandilya", "Vijay Muppala", "Pauline"]
  const priorities = ["Low", "Medium", "High", "Urgent"]
  const currencies = ["INR", "USD", "EUR"]
  const paymentTermsOptions = ["Immediate Payment", "Net 15", "Net 30", "50% Advance, 50% on Delivery", "25% Advance, 75% on Delivery"]

  const totals = calculateTotals()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>{editingQuotation ? 'Edit Quotation' : 'Create New Quotation'}</span>
          </DialogTitle>
          <DialogDescription>
            {editingQuotation ? 'Update the quotation details' : 'Create a professional quotation for your customer'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Customer</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Items</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Terms</span>
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
                      placeholder="Enter shipping address (if different)"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quotation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quotationDate" className="text-sm font-medium">
                      Quotation Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quotationDate"
                      type="date"
                      value={formData.quotationDate}
                      onChange={(e) => handleInputChange("quotationDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="validUntil" className="text-sm font-medium">
                      Valid Until <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => handleInputChange("validUntil", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reference" className="text-sm font-medium">Reference Number</Label>
                    <Input
                      id="reference"
                      value={formData.reference}
                      onChange={(e) => handleInputChange("reference", e.target.value)}
                      placeholder="Customer reference"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Quotation subject line"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Notes & Comments</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Internal notes and comments"
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Quotation Items</CardTitle>
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

          <TabsContent value="terms" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Terms & Settings</CardTitle>
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

                  <div>
                    <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="paymentTerms" className="text-sm font-medium">Payment Terms</Label>
                    <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange("paymentTerms", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTermsOptions.map((term) => (
                          <SelectItem key={term} value={term}>{term}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryTerms" className="text-sm font-medium">Delivery Terms</Label>
                    <Input
                      id="deliveryTerms"
                      value={formData.deliveryTerms}
                      onChange={(e) => handleInputChange("deliveryTerms", e.target.value)}
                      placeholder="e.g., 4-6 weeks"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="terms" className="text-sm font-medium">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => handleInputChange("terms", e.target.value)}
                    placeholder="Terms and conditions"
                    className="mt-1 min-h-[120px]"
                  />
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
              {editingQuotation ? 'Update Quotation' : 'Create Quotation'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}