"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Edit,
  TrendingUp,
  Calendar,
  IndianRupee,
  Target,
  Handshake,
  Brain,
  Zap,
  Download,
  Upload,
} from "lucide-react"
import { AIPredictiveAnalytics } from "@/components/ai-predictive-analytics"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { AIEmailGenerator } from "@/components/ai-email-generator"
import { AIProductRecommendations } from "@/components/ai-product-recommendations"
import { DataImportModal } from "@/components/data-import-modal"
import { AIInsightsService, type OpportunityData, type AIInsight } from "@/lib/ai-services"
import { useToast } from "@/hooks/use-toast"
import storageService from "@/lib/localStorage-service"

interface Deal {
  id: string
  deal_name: string
  account_name: string
  contact_person: string
  product: string
  value: number
  stage: string
  probability: number
  expected_close_date: string
  last_activity: string
  source: string
  source_lead_id?: string
  assigned_to: string
  priority: "High" | "Medium" | "Low"
  status: "Active" | "Won" | "Lost" | "On Hold"
  notes?: string
  created_at: string
  updated_at: string
}


export function OpportunitiesContent() {
  const { toast } = useToast()
  const [deals, setDeals] = useState<Deal[]>([])
  const [statsLoaded, setStatsLoaded] = useState(false)
  const [dealsStats, setDealsStats] = useState({
    total: 0,
    thisMonth: 0,
    totalValue: 0,
    weightedValue: 0
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedAssigned, setSelectedAssigned] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Load deals from database on component mount
  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      // Load ALL deals without any filtering
      const response = await fetch(`/api/deals`)
      
      if (response.ok) {
        const data = await response.json()
        const dealsArray = data.deals || []
        console.log("loadDeals - API deals:", dealsArray)
        setDeals(dealsArray)
        
        // Calculate stats
        const thisMonth = dealsArray.filter((deal: Deal) => 
          new Date(deal.expected_close_date).getMonth() === new Date().getMonth()
        ).length
        
        const totalValue = dealsArray.reduce((sum: number, deal: Deal) => 
          sum + (deal.value || 0), 0
        )
        
        const weightedValue = dealsArray.reduce((sum: number, deal: Deal) =>
          sum + ((deal.value || 0) * (deal.probability / 100)), 0
        )
        
        setDealsStats({
          total: dealsArray.length,
          thisMonth: thisMonth,
          totalValue: totalValue,
          weightedValue: weightedValue
        })
        setStatsLoaded(true)
      } else {
        console.error('Failed to fetch deals:', response.statusText)
        toast({
          title: "Error",
          description: "Failed to load deals from database",
          variant: "destructive"
        })
        setStatsLoaded(true)
      }
    } catch (error) {
      console.error('Error loading deals:', error)
      toast({
        title: "Error", 
        description: "Failed to load deals from database",
        variant: "destructive"
      })
      setStatsLoaded(true)
    }
  }

  const handleImportData = async (importedDeals: any[]) => {
    try {
      const promises = importedDeals.map(async (dealData) => {
        const response = await fetch('/api/deals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dealData)
        })
        return response.json()
      })
      
      await Promise.all(promises)
      
      // Reload deals from database
      loadDeals()
      
      toast({
        title: "Data imported",
        description: `Successfully imported ${importedDeals.length} deals to database.`
      })
    } catch (error) {
      console.error('Error importing deals:', error)
      toast({
        title: "Import failed",
        description: "Failed to import deals to database",
        variant: "destructive"
      })
    }
  }

  // Convert deals to the format expected by AI services
  const opportunityData: OpportunityData[] = useMemo(
    () =>
      deals.map((deal) => ({
        id: deal.id,
        accountName: deal.account_name,
        contactName: deal.contact_person,
        product: deal.product,
        value: `₹${deal.value.toLocaleString()}`,
        stage: deal.stage,
        probability: `${deal.probability}%`,
        expectedClose: deal.expected_close_date,
        source: deal.source,
      })),
    [deals],
  )

  // Generate AI insights
  const aiInsights: AIInsight[] = useMemo(() => {
    return AIInsightsService.generateDashboardInsights([], opportunityData, [])
  }, [opportunityData])

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = selectedStage === "all" || deal.stage === selectedStage
    const matchesAssigned = selectedAssigned === "all" || deal.assigned_to === selectedAssigned

    return matchesSearch && matchesStage && matchesAssigned
  })

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Qualification":
        return "bg-blue-100 text-blue-800"
      case "Demo":
        return "bg-purple-100 text-purple-800"
      case "Proposal":
        return "bg-orange-100 text-orange-800"
      case "Negotiation":
        return "bg-yellow-100 text-yellow-800"
      case "Closed Won":
        return "bg-green-100 text-green-800"
      case "Closed Lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSaveDeal = async (dealData: any) => {
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dealData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create deal')
      }
      
      const newDeal = await response.json()
      
      // Reload deals from database
      loadDeals()
      
      toast({
        title: "Deal created",
        description: `Deal ${newDeal.deal.account_name} has been successfully created.`
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error creating deal:', error)
      toast({
        title: "Error",
        description: "Failed to create deal",
        variant: "destructive"
      })
    }
  }
  
  const handleUpdateDeal = async (updatedDealData: any) => {
    try {
      const response = await fetch('/api/deals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedDeal?.id,
          ...updatedDealData
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update deal')
      }
      
      const updated = await response.json()
      
      // Reload deals from database
      loadDeals()
      
      toast({
        title: "Deal updated",
        description: `Deal ${updated.deal.account_name} has been successfully updated.`
      })
    } catch (error) {
      console.error('Error updating deal:', error)
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive"
      })
    }
    
    setIsEditDialogOpen(false)
    setSelectedDeal(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage and track your sales deals</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 mr-4">
                <Handshake className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold">{!statsLoaded ? "..." : dealsStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 mr-4">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold">{!statsLoaded ? "..." : `₹${(dealsStats.totalValue / 100000).toFixed(1)}L`}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 mr-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Weighted Pipeline</p>
                <p className="text-2xl font-bold">{!statsLoaded ? "..." : `₹${(dealsStats.weightedValue / 100000).toFixed(1)}L`}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100 mr-4">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{!statsLoaded ? "..." : dealsStats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deal Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Search & Filters</CardTitle>
          <CardDescription>Filter and search through your deals</CardDescription>
        </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search deals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Demo">Demo</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="WonDeal">WonDeal</SelectItem>
                    <SelectItem value="LostDeal">LostDeal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedAssigned} onValueChange={setSelectedAssigned}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assigned</SelectItem>
                    {Array.from(new Set(deals.map(deal => deal.assigned_to).filter(Boolean))).map(assigned => (
                      <SelectItem key={assigned} value={assigned}>{assigned}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Table */}
          <Card>
            <CardHeader>
              <CardTitle>Deals List</CardTitle>
              <CardDescription>Track and manage your sales deals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDeals.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No deals found</p>
                ) : (
                  filteredDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Account Info */}
                        <div>
                          <h3 className="font-semibold">{deal.account_name}</h3>
                          <p className="text-sm text-gray-500">{deal.id.slice(0, 8)}</p>
                          {deal.source_lead_id && (
                            <p className="text-xs text-blue-600">From Lead: {deal.source_lead_id.slice(0, 8)}</p>
                          )}
                        </div>
                        
                        {/* Contact Details */}
                        <div className="ml-14">
                          <div className="text-sm">
                            <span className="font-medium">{deal.contact_person}</span>
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="ml-14">
                          <div className="flex items-start gap-x-14">
                            <p className="text-sm font-medium">{deal.product}</p>
                            <div className="text-xs text-gray-500">
                              <p>Stage: {deal.stage}</p>
                              <p>Assigned to: {deal.assigned_to}</p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1 mt-1">
                            <p>Value: ₹{deal.value.toLocaleString()}</p>
                            <p>Probability: {deal.probability}%</p>
                            <p>Close Date: {deal.expected_close_date}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDeal(deal)
                              setIsEditDialogOpen(true)
                            }}
                            title="Edit Deal"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

      {/* Add Deal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
            <DialogDescription>Create a new sales deal to track in your pipeline.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input id="accountName" placeholder="Enter account name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" placeholder="Enter contact person" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Input id="product" placeholder="Enter product" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input id="value" placeholder="Enter value" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Qualification">Qualification</SelectItem>
                  <SelectItem value="Demo">Demo</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="probability">Probability</Label>
              <Input id="probability" placeholder="Enter probability %" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeDate">Expected Close Date</Label>
              <Input id="closeDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Enter any additional notes" />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Collect form data and create deal
              const formData = {
                deal_name: `${(document.getElementById('accountName') as HTMLInputElement)?.value || ''} - ${(document.getElementById('product') as HTMLInputElement)?.value || ''}`,
                account_name: (document.getElementById('accountName') as HTMLInputElement)?.value || '',
                contact_person: (document.getElementById('contactPerson') as HTMLInputElement)?.value || '',
                product: (document.getElementById('product') as HTMLInputElement)?.value || '',
                value: parseFloat((document.getElementById('value') as HTMLInputElement)?.value || '0'),
                stage: 'Qualification',
                probability: parseInt((document.getElementById('probability') as HTMLInputElement)?.value || '25'),
                expected_close_date: (document.getElementById('closeDate') as HTMLInputElement)?.value || '',
                last_activity: 'Created',
                source: 'Manual Entry',
                assigned_to: 'Admin',
                priority: 'Medium',
                status: 'Active'
              }
              handleSaveDeal(formData)
            }}>Create Deal</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Deal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>Update the sales deal information.</DialogDescription>
          </DialogHeader>
          {selectedDeal && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-accountName">Account Name</Label>
                <Input id="edit-accountName" defaultValue={selectedDeal.account_name} placeholder="Enter account name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactPerson">Contact Person</Label>
                <Input id="edit-contactPerson" defaultValue={selectedDeal.contact_person} placeholder="Enter contact person" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product">Product</Label>
                <Input id="edit-product" defaultValue={selectedDeal.product} placeholder="Enter product" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Value</Label>
                <Input id="edit-value" type="number" defaultValue={selectedDeal.value.toString()} placeholder="Enter value" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stage">Stage</Label>
                <Select defaultValue={selectedDeal.stage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Qualification">Qualification</SelectItem>
                    <SelectItem value="Demo">Demo</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Closed Won">Closed Won</SelectItem>
                    <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-probability">Probability (%)</Label>
                <Input id="edit-probability" type="number" min="0" max="100" defaultValue={selectedDeal.probability.toString()} placeholder="Enter probability %" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-closeDate">Expected Close Date</Label>
                <Input id="edit-closeDate" type="date" defaultValue={selectedDeal.expected_close_date} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select defaultValue={selectedDeal.priority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea id="edit-notes" defaultValue={selectedDeal.notes} placeholder="Enter any additional notes" />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedDeal) {
                const stageSelect = document.getElementById('edit-stage') as HTMLSelectElement
                const prioritySelect = document.getElementById('edit-priority') as HTMLSelectElement
                
                const formData = {
                  deal_name: `${(document.getElementById('edit-accountName') as HTMLInputElement)?.value || selectedDeal.account_name} - ${(document.getElementById('edit-product') as HTMLInputElement)?.value || selectedDeal.product}`,
                  account_name: (document.getElementById('edit-accountName') as HTMLInputElement)?.value || selectedDeal.account_name,
                  contact_person: (document.getElementById('edit-contactPerson') as HTMLInputElement)?.value || selectedDeal.contact_person,
                  product: (document.getElementById('edit-product') as HTMLInputElement)?.value || selectedDeal.product,
                  value: parseFloat((document.getElementById('edit-value') as HTMLInputElement)?.value || selectedDeal.value.toString()),
                  stage: stageSelect?.value || selectedDeal.stage,
                  probability: parseInt((document.getElementById('edit-probability') as HTMLInputElement)?.value || selectedDeal.probability.toString()),
                  expected_close_date: (document.getElementById('edit-closeDate') as HTMLInputElement)?.value || selectedDeal.expected_close_date,
                  priority: prioritySelect?.value || selectedDeal.priority,
                  notes: (document.getElementById('edit-notes') as HTMLTextAreaElement)?.value || selectedDeal.notes,
                  last_activity: 'Updated'
                }
                handleUpdateDeal(formData)
              }
            }}>Update Deal</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        moduleType="deals"
        onImport={handleImportData}
      />
    </div>
  )
}
