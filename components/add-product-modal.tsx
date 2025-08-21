"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, Minus, Upload, ChevronDown, ChevronRight, X, FileText } from "lucide-react"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
}

interface RateDetail {
  id: string
  currency: string
  uom: string
  rate: string
  taxMapping: string
  taxDetail: string
  crAccount: string
}

interface BOMItem {
  id: string
  name: string
  qty: string
  mandatory: boolean
  section: string
}

interface Document {
  id: string
  name: string
  size: string
  type: string
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    principal: "",
    category: "",
    subCategory: "",
    productName: "",
    isPublic: true,
    isSpares: false,
    isActive: true,
    referenceNo: "",
    barCode: "",
    uom: "",
    hsnCode: "",
    minOrder: "1.00",
    purAccount: "",
    branchDivision: "",
    gstRate: "0",
    assignedTo: "",
    specification: "",
  })

  const [rateDetails, setRateDetails] = useState<RateDetail[]>([
    { id: "1", currency: "", uom: "", rate: "0.00", taxMapping: "Local Sale", taxDetail: "", crAccount: "" },
    { id: "2", currency: "", uom: "", rate: "0.00", taxMapping: "Interstate Sale", taxDetail: "", crAccount: "" },
  ])

  const [bomItems, setBomItems] = useState<BOMItem[]>([])
  const [documents, setDocuments] = useState<Document[]>([])

  const [isProductInfoOpen, setIsProductInfoOpen] = useState(true)
  const [isSpecificationOpen, setIsSpecificationOpen] = useState(true)
  const [isRateDetailOpen, setIsRateDetailOpen] = useState(true)
  const [isBOMOpen, setIsBOMOpen] = useState(true)
  const [isDocumentOpen, setIsDocumentOpen] = useState(true)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addRateDetail = () => {
    const newRate: RateDetail = {
      id: Date.now().toString(),
      currency: "",
      uom: "",
      rate: "0.00",
      taxMapping: "Local Sale",
      taxDetail: "",
      crAccount: "",
    }
    setRateDetails((prev) => [...prev, newRate])
  }

  const removeRateDetail = (id: string) => {
    setRateDetails((prev) => prev.filter((rate) => rate.id !== id))
  }

  const updateRateDetail = (id: string, field: string, value: string) => {
    setRateDetails((prev) => prev.map((rate) => (rate.id === id ? { ...rate, [field]: value } : rate)))
  }

  const addBOMItem = () => {
    const newItem: BOMItem = {
      id: Date.now().toString(),
      name: "",
      qty: "",
      mandatory: false,
      section: "",
    }
    setBomItems((prev) => [...prev, newItem])
  }

  const removeBOMItem = (id: string) => {
    setBomItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateBOMItem = (id: string, field: string, value: string | boolean) => {
    setBomItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const newDoc: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          type: file.type || "application/octet-stream",
        }
        setDocuments((prev) => [...prev, newDoc])
      })
    }
  }

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const handleSubmit = () => {
    console.log("Product Data:", { formData, rateDetails, bomItems, documents })
    onClose()
  }

  const productTypes = ["Product", "Service", "Bundle", "Digital"]
  const principals = [
    "Affinite Instrument",
    "Airone Source Pvt Ltd",
    "Alliance Bio Expertise",
    "ALPHAVITA Bio Scientific",
    "ALSIN Technology Services",
  ]
  const categories = ["Laboratory Equipment", "Consumables", "Chemicals", "Software", "Services"]
  const subCategories = ["Analytical Instruments", "Safety Equipment", "Storage Solutions", "Testing Kits"]
  const uomOptions = ["Piece", "Set", "Kg", "Liter", "Meter", "Box", "Pack"]
  const currencies = ["INR", "USD", "EUR", "GBP"]
  const taxMappings = ["Local Sale", "Interstate Sale", "Export", "Exempt"]
  const branches = ["Main Branch", "North Division", "South Division", "East Division", "West Division"]
  const accounts = ["Sales Account", "Service Account", "Rental Account"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Add New Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Information */}
          <Collapsible open={isProductInfoOpen} onOpenChange={setIsProductInfoOpen}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-700">Product Information</CardTitle>
                    {isProductInfoOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="principal">Principal *</Label>
                      <Select
                        value={formData.principal}
                        onValueChange={(value) => handleInputChange("principal", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select principal" />
                        </SelectTrigger>
                        <SelectContent>
                          {principals.map((principal) => (
                            <SelectItem key={principal} value={principal}>
                              {principal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subCategory">Sub Category</Label>
                      <Select
                        value={formData.subCategory}
                        onValueChange={(value) => handleInputChange("subCategory", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub category" />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories.map((subCategory) => (
                            <SelectItem key={subCategory} value={subCategory}>
                              {subCategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="productName">Product Name *</Label>
                      <Input
                        id="productName"
                        value={formData.productName}
                        onChange={(e) => handleInputChange("productName", e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="public"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleInputChange("isPublic", checked as boolean)}
                      />
                      <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spares"
                        checked={formData.isSpares}
                        onCheckedChange={(checked) => handleInputChange("isSpares", checked as boolean)}
                      />
                      <Label htmlFor="spares">Spares</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="active"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label htmlFor="referenceNo">Reference No (Model)</Label>
                      <Input
                        id="referenceNo"
                        value={formData.referenceNo}
                        onChange={(e) => handleInputChange("referenceNo", e.target.value)}
                        placeholder="Enter reference number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="barCode">Bar Code</Label>
                      <Input
                        id="barCode"
                        value={formData.barCode}
                        onChange={(e) => handleInputChange("barCode", e.target.value)}
                        placeholder="Enter bar code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="uom">UOM</Label>
                      <Select value={formData.uom} onValueChange={(value) => handleInputChange("uom", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select UOM" />
                        </SelectTrigger>
                        <SelectContent>
                          {uomOptions.map((uom) => (
                            <SelectItem key={uom} value={uom}>
                              {uom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hsnCode">HSN Code</Label>
                      <Input
                        id="hsnCode"
                        value={formData.hsnCode}
                        onChange={(e) => handleInputChange("hsnCode", e.target.value)}
                        placeholder="Enter HSN code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minOrder">Min Order</Label>
                      <Input
                        id="minOrder"
                        type="number"
                        step="0.01"
                        value={formData.minOrder}
                        onChange={(e) => handleInputChange("minOrder", e.target.value)}
                        placeholder="1.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="purAccount">Pur Account *</Label>
                      <Select
                        value={formData.purAccount}
                        onValueChange={(value) => handleInputChange("purAccount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account} value={account}>
                              {account}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="branchDivision">Branch/Division</Label>
                      <Select
                        value={formData.branchDivision}
                        onValueChange={(value) => handleInputChange("branchDivision", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="gstRate">GST Rate (%)</Label>
                      <div className="flex">
                        <Input
                          id="gstRate"
                          type="number"
                          value={formData.gstRate}
                          onChange={(e) => handleInputChange("gstRate", e.target.value)}
                          className="rounded-r-none"
                        />
                        <div className="bg-gray-100 border border-l-0 rounded-r px-3 flex items-center text-sm text-gray-600">
                          %
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="assignedTo">Assigned To * (Click to Edit)</Label>
                    <Input
                      id="assignedTo"
                      value={formData.assignedTo}
                      onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                      placeholder="Enter assigned person"
                    />
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Product Specification */}
          <Collapsible open={isSpecificationOpen} onOpenChange={setIsSpecificationOpen}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-700">Product Specification</CardTitle>
                    {isSpecificationOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="specification">Type: Text</Label>
                      <span className="text-sm text-gray-500">
                        Max. characters: 4000, {4000 - formData.specification.length} character(s) left.
                      </span>
                    </div>
                    <Textarea
                      id="specification"
                      value={formData.specification}
                      onChange={(e) => handleInputChange("specification", e.target.value)}
                      placeholder="Enter detailed product specifications..."
                      className="min-h-[120px]"
                      maxLength={4000}
                    />
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Rate Detail */}
          <Collapsible open={isRateDetailOpen} onOpenChange={setIsRateDetailOpen}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-700">Rate Detail</CardTitle>
                    {isRateDetailOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Pricing Configuration</h4>
                    <Button onClick={addRateDetail} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rate
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No.</TableHead>
                          <TableHead>Currency</TableHead>
                          <TableHead>UOM</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Tax Mapping</TableHead>
                          <TableHead>Tax Detail</TableHead>
                          <TableHead>Cr Account</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rateDetails.map((rate, index) => (
                          <TableRow key={rate.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Select
                                value={rate.currency}
                                onValueChange={(value) => updateRateDetail(rate.id, "currency", value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                      {currency}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={rate.uom}
                                onValueChange={(value) => updateRateDetail(rate.id, "uom", value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue placeholder="UOM" />
                                </SelectTrigger>
                                <SelectContent>
                                  {uomOptions.map((uom) => (
                                    <SelectItem key={uom} value={uom}>
                                      {uom}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={rate.rate}
                                onChange={(e) => updateRateDetail(rate.id, "rate", e.target.value)}
                                className="w-24"
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={rate.taxMapping}
                                onValueChange={(value) => updateRateDetail(rate.id, "taxMapping", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {taxMappings.map((mapping) => (
                                    <SelectItem key={mapping} value={mapping}>
                                      {mapping}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={rate.taxDetail}
                                onValueChange={(value) => updateRateDetail(rate.id, "taxDetail", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Tax Detail" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="GST 18%">GST 18%</SelectItem>
                                  <SelectItem value="GST 12%">GST 12%</SelectItem>
                                  <SelectItem value="GST 5%">GST 5%</SelectItem>
                                  <SelectItem value="Exempt">Exempt</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={rate.crAccount}
                                onValueChange={(value) => updateRateDetail(rate.id, "crAccount", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Account" />
                                </SelectTrigger>
                                <SelectContent>
                                  {accounts.map((account) => (
                                    <SelectItem key={account} value={account}>
                                      {account}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              {rateDetails.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRateDetail(rate.id)}
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
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* BOM/Spares/Accessories */}
          <Collapsible open={isBOMOpen} onOpenChange={setIsBOMOpen}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-700">BOM/Spares/Accessories</CardTitle>
                    {isBOMOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Bill of Materials & Components</h4>
                    <div className="flex space-x-2">
                      <Button onClick={addBOMItem} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                      <Button variant="outline" size="sm">
                        Copy BOM
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No.</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Mandatory</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bomItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                              No BOM items added yet. Click "Add" to add components.
                            </TableCell>
                          </TableRow>
                        ) : (
                          bomItems.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Input
                                  value={item.name}
                                  onChange={(e) => updateBOMItem(item.id, "name", e.target.value)}
                                  placeholder="Component name"
                                  className="w-48"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => updateBOMItem(item.id, "qty", e.target.value)}
                                  placeholder="Quantity"
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={item.mandatory}
                                  onCheckedChange={(checked) => updateBOMItem(item.id, "mandatory", checked as boolean)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.section}
                                  onChange={(e) => updateBOMItem(item.id, "section", e.target.value)}
                                  placeholder="Section"
                                  className="w-32"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeBOMItem(item.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Document List */}
          <Collapsible open={isDocumentOpen} onOpenChange={setIsDocumentOpen}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-700">Document List</CardTitle>
                    {isDocumentOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Product Documents & Attachments</h4>
                      <div>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="document-upload"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        />
                        <Button asChild size="sm">
                          <label htmlFor="document-upload" className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Attach Document
                          </label>
                        </Button>
                      </div>
                    </div>

                    {documents.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No documents attached yet</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Upload product manuals, specifications, or certificates
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.size}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument(doc.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Save Product
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Save & New
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
