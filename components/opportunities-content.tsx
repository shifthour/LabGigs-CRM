"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

interface Opportunity {
  id: string
  accountName: string
  contactPerson: string
  product: string
  value: string
  stage: string
  probability: string
  expectedCloseDate: string
  lastActivity: string
  source: string
  assignedTo: string
  priority: "High" | "Medium" | "Low"
  status: "Active" | "Won" | "Lost" | "On Hold"
}

const mockOpportunities: Opportunity[] = [
  {
    id: "OPP-001",
    accountName: "IIT Delhi",
    contactPerson: "Dr. Rajesh Kumar",
    product: "Freeze Dryer FD-10",
    value: "₹15,50,000",
    stage: "Proposal",
    probability: "75%",
    expectedCloseDate: "2024-09-15",
    lastActivity: "Proposal sent",
    source: "Website Inquiry",
    assignedTo: "Amit Sharma",
    priority: "High",
    status: "Active",
  },
  {
    id: "OPP-002",
    accountName: "AIIMS New Delhi",
    contactPerson: "Dr. Priya Singh",
    product: "Autoclave AC-50",
    value: "₹8,75,000",
    stage: "Negotiation",
    probability: "85%",
    expectedCloseDate: "2024-08-30",
    lastActivity: "Price negotiation",
    source: "Referral",
    assignedTo: "Neha Gupta",
    priority: "High",
    status: "Active",
  },
  {
    id: "OPP-003",
    accountName: "Tata Institute",
    contactPerson: "Dr. Suresh Patel",
    product: "Centrifuge CF-20",
    value: "₹12,25,000",
    stage: "Demo",
    probability: "60%",
    expectedCloseDate: "2024-10-05",
    lastActivity: "Demo scheduled",
    source: "Cold Call",
    assignedTo: "Rahul Verma",
    priority: "Medium",
    status: "Active",
  },
  {
    id: "OPP-004",
    accountName: "CSIR Lab",
    contactPerson: "Dr. Meera Joshi",
    product: "Spectrophotometer SP-100",
    value: "₹22,00,000",
    stage: "Qualification",
    probability: "45%",
    expectedCloseDate: "2024-11-20",
    lastActivity: "Requirements gathering",
    source: "Trade Show",
    assignedTo: "Vikash Singh",
    priority: "Medium",
    status: "Active",
  },
  {
    id: "OPP-005",
    accountName: "Biocon Research",
    contactPerson: "Dr. Anita Reddy",
    product: "Bioreactor BR-500",
    value: "₹35,00,000",
    stage: "Proposal",
    probability: "70%",
    expectedCloseDate: "2024-09-30",
    lastActivity: "Technical discussion",
    source: "Partner Referral",
    assignedTo: "Amit Sharma",
    priority: "High",
    status: "Active",
  },
]

export function OpportunitiesContent() {
  const { toast } = useToast()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [opportunitiesStats, setOpportunitiesStats] = useState({
    total: 0,
    thisMonth: 0,
    totalValue: 0,
    weightedValue: 0
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [activeTab, setActiveTab] = useState("list")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Load opportunities from localStorage on component mount
  useEffect(() => {
    loadOpportunities()
  }, [])

  const loadOpportunities = () => {
    const storedOpportunities = storageService.getAll<Opportunity>('opportunities')
    console.log("loadOpportunities - storedOpportunities:", storedOpportunities)
    setOpportunities(storedOpportunities)
    
    // Calculate stats
    const stats = storageService.getStats('opportunities')
    const thisMonth = storedOpportunities.filter(opp => 
      new Date(opp.expectedCloseDate).getMonth() === new Date().getMonth()
    ).length
    
    const totalValue = storedOpportunities.reduce((sum, opp) => 
      sum + Number.parseFloat(opp.value.replace(/[₹,]/g, "")), 0
    )
    
    const weightedValue = storedOpportunities.reduce(
      (sum, opp) =>
        sum +
        Number.parseFloat(opp.value.replace(/[₹,]/g, "")) * (Number.parseFloat(opp.probability.replace("%", "")) / 100),
      0,
    )
    
    setOpportunitiesStats({
      total: stats.total,
      thisMonth: thisMonth,
      totalValue: totalValue,
      weightedValue: weightedValue
    })
  }

  const handleImportData = (importedOpportunities: any[]) => {
    console.log('Imported opportunities:', importedOpportunities)
    const createdOpportunities = storageService.createMany('opportunities', importedOpportunities)
    
    // Immediately add imported opportunities to state
    setOpportunities(prevOpportunities => [...prevOpportunities, ...createdOpportunities])
    
    // Update stats
    loadOpportunities()
    
    toast({
      title: "Data imported",
      description: `Successfully imported ${createdOpportunities.length} opportunities.`
    })
  }

  // Convert opportunities to the format expected by AI services
  const opportunityData: OpportunityData[] = useMemo(
    () =>
      opportunities.map((opp) => ({
        id: opp.id,
        accountName: opp.accountName,
        contactName: opp.contactPerson,
        product: opp.product,
        value: opp.value,
        stage: opp.stage,
        probability: opp.probability,
        expectedClose: opp.expectedCloseDate,
        source: opp.source,
      })),
    [opportunities],
  )

  // Generate AI insights
  const aiInsights: AIInsight[] = useMemo(() => {
    return AIInsightsService.generateDashboardInsights([], opportunityData, [])
  }, [opportunityData])

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = selectedStage === "all" || opportunity.stage === selectedStage
    const matchesPriority = selectedPriority === "all" || opportunity.priority === selectedPriority

    return matchesSearch && matchesStage && matchesPriority
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

  const handleSaveOpportunity = (opportunityData: any) => {
    console.log("handleSaveOpportunity called with:", opportunityData)
    
    const newOpportunity = storageService.create('opportunities', opportunityData)
    console.log("New opportunity created:", newOpportunity)
    
    if (newOpportunity) {
      // Force immediate refresh from localStorage
      const refreshedOpportunities = storageService.getAll<Opportunity>('opportunities')
      console.log("Force refresh - all opportunities:", refreshedOpportunities)
      setOpportunities(refreshedOpportunities)
      
      // Update stats
      loadOpportunities()
      
      toast({
        title: "Opportunity created",
        description: `Opportunity ${newOpportunity.accountName || newOpportunity.id} has been successfully created.`
      })
      setIsAddDialogOpen(false)
    } else {
      console.error("Failed to create opportunity")
      toast({
        title: "Error",
        description: "Failed to create opportunity",
        variant: "destructive"
      })
    }
  }
  
  const handleUpdateOpportunity = (updatedOpportunity: any) => {
    console.log('Updating opportunity:', updatedOpportunity)
    
    const updated = storageService.update('opportunities', selectedOpportunity?.id, updatedOpportunity)
    if (updated) {
      setOpportunities(prevOpportunities => 
        prevOpportunities.map(opp => opp.id === selectedOpportunity?.id ? updated : opp)
      )
      
      // Update stats
      loadOpportunities()
      
      toast({
        title: "Opportunity updated",
        description: `Opportunity ${updated.accountName || updated.id} has been successfully updated.`
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update opportunity",
        variant: "destructive"
      })
    }
    
    setIsEditDialogOpen(false)
    setSelectedOpportunity(null)
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
                <p className="text-2xl font-bold">{opportunitiesStats.total}</p>
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
                <p className="text-2xl font-bold">₹{(opportunitiesStats.totalValue / 100000).toFixed(1)}L</p>
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
                <p className="text-2xl font-bold">₹{(opportunitiesStats.weightedValue / 100000).toFixed(1)}L</p>
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
                <p className="text-2xl font-bold">{opportunitiesStats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Opportunities List</TabsTrigger>
          <TabsTrigger value="analytics">
            <Brain className="w-4 h-4 mr-2" />
            AI Analytics
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Zap className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="tools">AI Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search opportunities..."
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
                    <SelectItem value="Qualification">Qualification</SelectItem>
                    <SelectItem value="Demo">Demo</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Table */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunities ({filteredOpportunities.length})</CardTitle>
              <CardDescription>Track and manage your sales opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Close Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpportunities.map((opportunity) => (
                      <TableRow key={opportunity.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{opportunity.accountName}</p>
                            <p className="text-sm text-gray-500">{opportunity.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{opportunity.contactPerson}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{opportunity.product}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{opportunity.value}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStageColor(opportunity.stage)}>{opportunity.stage}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{opportunity.probability}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{opportunity.expectedCloseDate}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(opportunity.priority)}>{opportunity.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedOpportunity(opportunity)
                                setIsEditDialogOpen(true)
                              }}
                              title="Edit Opportunity"
                            >
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
        </TabsContent>

        <TabsContent value="analytics">
          <AIPredictiveAnalytics opportunities={opportunityData} />
        </TabsContent>

        <TabsContent value="insights">
          <AIInsightsPanel insights={aiInsights} title="Opportunity Insights" />
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIEmailGenerator />
            <AIProductRecommendations opportunities={opportunityData} />
          </div>
        </TabsContent>
      </Tabs>

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
              // Collect form data and create opportunity
              const formData = {
                id: `OPP-${Date.now()}`,
                accountName: (document.getElementById('accountName') as HTMLInputElement)?.value || '',
                contactPerson: (document.getElementById('contactPerson') as HTMLInputElement)?.value || '',
                product: (document.getElementById('product') as HTMLInputElement)?.value || '',
                value: (document.getElementById('value') as HTMLInputElement)?.value || '',
                stage: 'Qualification',
                probability: (document.getElementById('probability') as HTMLInputElement)?.value || '25%',
                expectedCloseDate: (document.getElementById('closeDate') as HTMLInputElement)?.value || '',
                lastActivity: 'Created',
                source: 'Manual Entry',
                assignedTo: 'Admin',
                priority: 'Medium',
                status: 'Active'
              }
              handleSaveOpportunity(formData)
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
          {selectedOpportunity && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-accountName">Account Name</Label>
                <Input id="edit-accountName" defaultValue={selectedOpportunity.accountName} placeholder="Enter account name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactPerson">Contact Person</Label>
                <Input id="edit-contactPerson" defaultValue={selectedOpportunity.contactPerson} placeholder="Enter contact person" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product">Product</Label>
                <Input id="edit-product" defaultValue={selectedOpportunity.product} placeholder="Enter product" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Value</Label>
                <Input id="edit-value" defaultValue={selectedOpportunity.value} placeholder="Enter value" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stage">Stage</Label>
                <Select defaultValue={selectedOpportunity.stage}>
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
                <Label htmlFor="edit-probability">Probability</Label>
                <Input id="edit-probability" defaultValue={selectedOpportunity.probability} placeholder="Enter probability %" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-closeDate">Expected Close Date</Label>
                <Input id="edit-closeDate" type="date" defaultValue={selectedOpportunity.expectedCloseDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select defaultValue={selectedOpportunity.priority}>
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
                <Textarea id="edit-notes" placeholder="Enter any additional notes" />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedOpportunity) {
                const formData = {
                  ...selectedOpportunity,
                  accountName: (document.getElementById('edit-accountName') as HTMLInputElement)?.value || selectedOpportunity.accountName,
                  contactPerson: (document.getElementById('edit-contactPerson') as HTMLInputElement)?.value || selectedOpportunity.contactPerson,
                  product: (document.getElementById('edit-product') as HTMLInputElement)?.value || selectedOpportunity.product,
                  value: (document.getElementById('edit-value') as HTMLInputElement)?.value || selectedOpportunity.value,
                  probability: (document.getElementById('edit-probability') as HTMLInputElement)?.value || selectedOpportunity.probability,
                  expectedCloseDate: (document.getElementById('edit-closeDate') as HTMLInputElement)?.value || selectedOpportunity.expectedCloseDate,
                }
                handleUpdateOpportunity(formData)
              }
            }}>Update Deal</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        moduleType="opportunities"
        onImport={handleImportData}
      />
    </div>
  )
}
