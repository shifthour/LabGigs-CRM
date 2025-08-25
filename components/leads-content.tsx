"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Plus, Download, Edit, Phone, Users, Target, TrendingUp, Clock, Zap, Filter, Mail, MessageCircle, Upload, Save, X, CheckCircle } from "lucide-react"
import { AILeadScore } from "@/components/ai-lead-score"
import { AIEmailGenerator } from "@/components/ai-email-generator"
import { AIRecommendationService, type LeadData } from "@/lib/ai-services"
import { DataImportModal } from "@/components/data-import-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import storageService from "@/lib/localStorage-service"

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
  </svg>
)

const leads = [
  {
    id: "006/25-26",
    date: "24/04/2025",
    leadName: "Guna Foods",
    location: "Villupuram/Tamil Nadu",
    contactName: "Pauline",
    contactNo: "+91 95432 10987",
    email: "pauline@gunafoods.com",
    whatsapp: "+91 95432 10987",
    assignedTo: "Hari Kumar K",
    product: "ANALYTICAL BALANCE (AS 220.R2)",
    salesStage: "Prospecting",
    closingDate: "",
    buyerRef: "",
    priority: "high",
    status: "active",
  },
  {
    id: "001/25-26",
    date: "01/04/2025",
    leadName: "Agferm Innovation",
    location: "Hoskote/Karnataka",
    contactName: "Mr. Ibomcha",
    contactNo: "+91 79755 89338",
    email: "ibomcha@agferm.com",
    whatsapp: "+91 79755 89338",
    assignedTo: "Hari Kumar K",
    product: "LABORATORY FREEZE DRYER/LYOPHILIZER",
    salesStage: "Prospecting",
    closingDate: "30/06/2025",
    buyerRef: "",
    priority: "medium",
    status: "active",
  },
  {
    id: "252/24-25",
    date: "24/03/2025",
    leadName: "Abexome Biosciences",
    location: "Bangalore/Karnataka",
    contactName: "Dr. Smitha P",
    contactNo: "+91 80 41215491",
    email: "smitha.p@abexome.com",
    whatsapp: "+91 98765 43210",
    assignedTo: "Vijay Muppala",
    product: "MICRO-VOLUME SPECTROPHOTOMETER",
    salesStage: "Prospecting",
    closingDate: "",
    buyerRef: "",
    priority: "high",
    status: "inactive",
  },
]


export function LeadsContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [leadsList, setLeadsList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [leadFilter, setLeadFilter] = useState("all")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [leadsStats, setLeadsStats] = useState({
    total: 0,
    qualified: 0,
    conversionRate: 0,
    avgResponseTime: "0h"
  })

  // Load leads from localStorage on component mount
  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = () => {
    const storedLeads = storageService.getAll<any>('leads')
    console.log("loadLeads - storedLeads:", storedLeads)
    setLeadsList(storedLeads)
    
    // Calculate stats
    const stats = storageService.getStats('leads')
    const qualifiedLeads = storedLeads.filter(lead => lead.salesStage === 'Qualified' || lead.salesStage === 'Proposal' || lead.salesStage === 'Negotiation').length
    const conversionRate = storedLeads.length > 0 ? Math.round((qualifiedLeads / storedLeads.length) * 100) : 0
    
    setLeadsStats({
      total: stats.total,
      qualified: qualifiedLeads,
      conversionRate: conversionRate,
      avgResponseTime: "2.4h" // Static for now
    })
  }

  const stats = [
    {
      title: "Total Leads",
      value: leadsStats.total.toString(),
      change: { value: "+18.6%", type: "positive" as const, period: "from last month" },
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Qualified Leads",
      value: leadsStats.qualified.toString(),
      change: { value: "+12.4%", type: "positive" as const, period: "from last month" },
      icon: CheckCircle,
      trend: "up" as const,
    },
    {
      title: "Conversion Rate",
      value: `${leadsStats.conversionRate}%`,
      change: { value: "+2.3%", type: "positive" as const, period: "improvement" },
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Avg. Response Time",
      value: leadsStats.avgResponseTime,
      change: { value: "-0.5h", type: "positive" as const, period: "faster response" },
      icon: Clock,
      trend: "up" as const,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "prospecting":
        return "bg-blue-100 text-blue-800"
      case "qualified":
        return "bg-purple-100 text-purple-800"
      case "proposal":
        return "bg-orange-100 text-orange-800"
      case "negotiation":
        return "bg-yellow-100 text-yellow-800"
      case "closed won":
        return "bg-green-100 text-green-800"
      case "closed lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredLeads = leadsList.filter((lead) => {
    if (leadFilter === "active") {
      return lead.status === "active"
    }
    return true // Show all leads
  })

  const handleCommunicationAction = (type: string, contact: string, leadName: string) => {
    switch (type) {
      case 'call':
        if (contact) {
          window.open(`tel:${contact}`, '_self')
        }
        break
      case 'whatsapp':
        if (contact) {
          const message = `Hello! I'm reaching out regarding our discussion about laboratory equipment for ${leadName}. Could we schedule a time to discuss your requirements?`
          window.open(`https://wa.me/${contact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
        }
        break
      case 'email':
        if (contact) {
          const subject = `Follow-up: Laboratory Equipment Solutions for ${leadName}`
          const body = `Dear Team,\n\nI hope this email finds you well. I wanted to follow up on our recent discussion regarding laboratory equipment solutions for ${leadName}.\n\nI'd be happy to provide additional information about our products and discuss how we can meet your specific requirements.\n\nPlease let me know a convenient time for a detailed discussion.\n\nBest regards,\nSales Team`
          window.open(`mailto:${contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self')
        }
        break
    }
  }

  const handleImportData = (importedLeads: any[]) => {
    console.log('Imported leads:', importedLeads)
    const createdLeads = storageService.createMany('leads', importedLeads)
    
    // Immediately add imported leads to state
    setLeadsList(prevLeads => [...prevLeads, ...createdLeads])
    
    // Update stats
    loadLeads()
    
    toast({
      title: "Data imported",
      description: `Successfully imported ${createdLeads.length} leads.`
    })
  }

  const handleEditLead = (lead: any) => {
    setEditingLead(lead)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedLead: any) => {
    console.log('Updating lead:', updatedLead)
    
    const updated = storageService.update('leads', editingLead.id, updatedLead)
    if (updated) {
      setLeadsList(prevLeads => 
        prevLeads.map(lead => lead.id === editingLead.id ? updated : lead)
      )
      
      // Update stats
      loadLeads()
      
      toast({
        title: "Lead updated",
        description: `Lead ${updated.leadName || updated.id} has been successfully updated.`
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive"
      })
    }
    
    setIsEditModalOpen(false)
    setEditingLead(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600">Track and manage your sales leads effectively</p>
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
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/leads/add")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <EnhancedCard key={stat.title} title={stat.title} value={stat.value} change={stat.change} icon={stat.icon} />
        ))}
      </div>

      {/* Enhanced Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest leads and their current status</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Button
                variant={leadFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setLeadFilter("all")}
                className={leadFilter === "all" ? "bg-gray-800 hover:bg-gray-900" : ""}
              >
                All Leads ({leadsList.length})
              </Button>
              <Button
                variant={leadFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setLeadFilter("active")}
                className={leadFilter === "active" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Active Leads ({leadsList.filter((lead) => lead.status === "active").length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{lead.leadName}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          lead.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{lead.location}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Contact: {lead.contactName}</p>
                      {lead.contactNo && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          <span>{lead.contactNo}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{lead.product}</p>
                    <p className="text-xs text-gray-500">Assigned to: {lead.assignedTo}</p>
                  </div>
                  <div className="text-center">
                    <AILeadScore lead={lead as LeadData} />
                  </div>
                  <StatusIndicator
                    status={lead.priority}
                    variant={lead.priority === "high" ? "error" : lead.priority === "medium" ? "warning" : "success"}
                  />
                  <div className="flex space-x-1">
                    {/* Communication Buttons */}
                    {lead.contactNo && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCommunicationAction('call', lead.contactNo, lead.leadName)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        title="Call Contact"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    )}
                    {lead.whatsapp && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCommunicationAction('whatsapp', lead.whatsapp, lead.leadName)}
                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        title="WhatsApp Contact"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </Button>
                    )}
                    {lead.email && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCommunicationAction('email', lead.email, lead.leadName)}
                        className="text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {/* Action Buttons */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Edit Lead"
                      onClick={() => handleEditLead(lead)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leadsList.length > 0 && <AIEmailGenerator lead={leadsList[0] as LeadData} context="follow-up" />}

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 mr-3">
                <Zap className="w-5 h-5 text-white" />
              </div>
              AI Lead Intelligence
            </CardTitle>
            <CardDescription>Advanced insights and next best actions for your leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leadsList.length > 0 ? leadsList.slice(0, 2).map((lead, index) => {
              const nextAction = AIRecommendationService.getNextBestAction(lead as LeadData)
              return (
                <div key={lead.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{lead.leadName}</h4>
                    <AILeadScore lead={lead as LeadData} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-green-800 mb-1">{nextAction.title}</p>
                        <p className="text-gray-600">{nextAction.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Confidence: {Math.round(nextAction.confidence * 100)}%
                      </span>
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="text-center text-gray-500 py-4">
                No leads available for insights
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Import Modal */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        moduleType="leads"
        onImport={handleImportData}
      />

      {/* Edit Lead Modal */}
      {editingLead && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>Edit Lead: {editingLead.leadName}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Lead Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leadName">Lead/Company Name</Label>
                  <Input
                    id="leadName"
                    defaultValue={editingLead.leadName}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input
                    id="contactName"
                    defaultValue={editingLead.contactName}
                    placeholder="Contact person name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue={editingLead.contactNo}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={editingLead.email}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    defaultValue={editingLead.whatsapp}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    defaultValue={editingLead.location}
                    placeholder="City, State"
                  />
                </div>
              </div>

              {/* Sales Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salesStage">Sales Stage</Label>
                  <Select defaultValue={editingLead.salesStage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospecting">Prospecting</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed-won">Closed Won</SelectItem>
                      <SelectItem value="closed-lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue={editingLead.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product Interest</Label>
                  <Input
                    id="product"
                    defaultValue={editingLead.product}
                    placeholder="Product or service"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select defaultValue={editingLead.assignedTo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hari Kumar K">Hari Kumar K</SelectItem>
                      <SelectItem value="Vijay Muppala">Vijay Muppala</SelectItem>
                      <SelectItem value="Prashanth Sandilya">Prashanth Sandilya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingDate">Expected Closing Date</Label>
                <Input
                  id="closingDate"
                  type="date"
                  defaultValue={editingLead.closingDate}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() => handleSaveEdit(editingLead)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
