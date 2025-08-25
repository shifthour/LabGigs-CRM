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
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Package, IndianRupee, FileText, Settings, X, Save } from "lucide-react"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  // Basic Information
  productName: string
  category: string
  subCategory: string
  principal: string
  type: string
  refNo: string
  barCode: string
  
  // Specifications
  specifications: string
  uom: string
  minOrder: string
  hsnCode: string
  
  // Pricing
  basePrice: string
  currency: string
  gstRate: string
  taxMapping: string
  
  // Business Details
  assignedTo: string
  branchDivision: string
  isActive: boolean
  isPublic: boolean
  isSpares: boolean
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    category: "",
    subCategory: "",
    principal: "",
    type: "Product",
    refNo: "",
    barCode: "",
    specifications: "",
    uom: "Piece",
    minOrder: "1",
    hsnCode: "",
    basePrice: "",
    currency: "INR",
    gstRate: "18",
    taxMapping: "Local Sale",
    assignedTo: "",
    branchDivision: "",
    isActive: true,
    isPublic: true,
    isSpares: false,
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    console.log("Product Data:", formData)
    console.log("Uploaded Files:", uploadedFiles)
    onClose()
  }

  // Options for dropdowns
  const productTypes = ["Product", "Service", "Bundle", "Digital"]
  const categories = ["Laboratory Equipment", "Consumables", "Chemicals", "Software", "Services", "Analytical Instruments", "Safety Equipment"]
  const subCategories = ["Spectrophotometers", "Centrifuges", "Microscopes", "Freezers", "Incubators", "Balances", "pH Meters", "Autoclave", "Bio Safety Cabinet"]
  const principals = ["Affinite Instrument", "Airone Source Pvt Ltd", "Alliance Bio Expertise", "ALPHAVITA Bio Scientific", "ALSIN Technology Services", "Thermo Fisher", "Agilent", "Waters", "Shimadzu"]
  const uomOptions = ["Piece", "Set", "Kg", "Liter", "Meter", "Box", "Pack", "Unit"]
  const currencies = ["INR", "USD", "EUR", "GBP"]
  const taxMappings = ["Local Sale", "Interstate Sale", "Export", "Exempt"]
  const branches = ["Main Branch", "North Division", "South Division", "East Division", "West Division"]
  const assignees = ["Hari Kumar K", "Prashanth Sandilya", "Vijay Muppala", "Pauline"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Package className="w-6 h-6 text-blue-600" />
            <span>Add New Product</span>
          </DialogTitle>
          <DialogDescription>
            Fill in the product details to add it to your inventory catalog
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="specs" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Specifications</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center space-x-2">
              <IndianRupee className="w-4 h-4" />
              <span>Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="productName" className="text-sm font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => handleInputChange("productName", e.target.value)}
                      placeholder="Enter the full product name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">
                      Product Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subCategory" className="text-sm font-medium">Sub Category</Label>
                    <Select value={formData.subCategory} onValueChange={(value) => handleInputChange("subCategory", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="principal" className="text-sm font-medium">
                      Principal/Manufacturer <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.principal} onValueChange={(value) => handleInputChange("principal", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select principal" />
                      </SelectTrigger>
                      <SelectContent>
                        {principals.map((principal) => (
                          <SelectItem key={principal} value={principal}>{principal}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="refNo" className="text-sm font-medium">Model/Reference Number</Label>
                    <Input
                      id="refNo"
                      value={formData.refNo}
                      onChange={(e) => handleInputChange("refNo", e.target.value)}
                      placeholder="e.g., AC-500, FD-10"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="barCode" className="text-sm font-medium">Barcode/SKU</Label>
                    <Input
                      id="barCode"
                      value={formData.barCode}
                      onChange={(e) => handleInputChange("barCode", e.target.value)}
                      placeholder="Product barcode or SKU"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="specifications" className="text-sm font-medium">
                    Product Specifications & Description
                  </Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => handleInputChange("specifications", e.target.value)}
                    placeholder="Enter detailed product specifications, features, and technical details..."
                    className="mt-1 min-h-[120px]"
                    maxLength={2000}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {2000 - formData.specifications.length} characters remaining
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="uom" className="text-sm font-medium">
                      Unit of Measurement <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.uom} onValueChange={(value) => handleInputChange("uom", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uomOptions.map((uom) => (
                          <SelectItem key={uom} value={uom}>{uom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="minOrder" className="text-sm font-medium">Minimum Order Quantity</Label>
                    <Input
                      id="minOrder"
                      type="number"
                      min="1"
                      value={formData.minOrder}
                      onChange={(e) => handleInputChange("minOrder", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hsnCode" className="text-sm font-medium">HSN/SAC Code</Label>
                    <Input
                      id="hsnCode"
                      value={formData.hsnCode}
                      onChange={(e) => handleInputChange("hsnCode", e.target.value)}
                      placeholder="e.g., 84219900"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Product Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="space-y-1">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500">Upload files</span>
                          <span className="text-gray-500"> or drag and drop</span>
                        </label>
                        <p className="text-sm text-gray-500">PDF, DOC, XLS, JPG up to 10MB each</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
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
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="basePrice" className="text-sm font-medium">
                      Base Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={(e) => handleInputChange("basePrice", e.target.value)}
                        placeholder="0.00"
                        className="pl-8"
                      />
                      <IndianRupee className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                    </div>
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
                    <Label htmlFor="gstRate" className="text-sm font-medium">GST Rate (%)</Label>
                    <div className="relative mt-1">
                      <Input
                        id="gstRate"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.gstRate}
                        onChange={(e) => handleInputChange("gstRate", e.target.value)}
                        className="pr-8"
                      />
                      <span className="text-gray-400 absolute right-2.5 top-1/2 transform -translate-y-1/2">%</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="taxMapping" className="text-sm font-medium">Tax Category</Label>
                    <Select value={formData.taxMapping} onValueChange={(value) => handleInputChange("taxMapping", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {taxMappings.map((mapping) => (
                          <SelectItem key={mapping} value={mapping}>{mapping}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Calculation Display */}
                {formData.basePrice && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Price Breakdown</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>₹{parseFloat(formData.basePrice || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST ({formData.gstRate}%):</span>
                        <span>₹{((parseFloat(formData.basePrice || "0") * parseFloat(formData.gstRate || "0")) / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium text-blue-900 pt-2 border-t border-blue-200">
                        <span>Total Price:</span>
                        <span>₹{(parseFloat(formData.basePrice || "0") * (1 + parseFloat(formData.gstRate || "0") / 100)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
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
                    <Label htmlFor="branchDivision" className="text-sm font-medium">Branch/Division</Label>
                    <Select value={formData.branchDivision} onValueChange={(value) => handleInputChange("branchDivision", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status Checkboxes */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Product Status</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="isActive" className="text-sm font-medium">Active Product</Label>
                        <p className="text-xs text-gray-500">Product is available for sale and quotations</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleInputChange("isPublic", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="isPublic" className="text-sm font-medium">Public Visibility</Label>
                        <p className="text-xs text-gray-500">Product appears in public catalogs and website</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isSpares"
                        checked={formData.isSpares}
                        onCheckedChange={(checked) => handleInputChange("isSpares", checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="isSpares" className="text-sm font-medium">Spare/Accessory</Label>
                        <p className="text-xs text-gray-500">This product is a spare part or accessory</p>
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
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Product
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Save & Add Another
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}