"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Plus, Download, Eye, Edit, Phone, Users, Target, TrendingUp, Clock, Brain, Zap, Filter } from "lucide-react"
import { AILeadScore } from "@/components/ai-lead-score"
import { AIEmailGenerator } from "@/components/ai-email-generator"
import { AIRecommendationService, type LeadData } from "@/lib/ai-services"
import { AddLeadModal } from "@/components/add-lead-modal"

const leads = [
  {
    id: "006/25-26",
    date: "24/04/2025",
    leadName: "Guna Foods",
    location: "Villupuram/Tamil Nadu",
    contactName: "Pauline",
    contactNo: "",
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
    contactNo: "7975589338",
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
    contactNo: "080-41215491",
    assignedTo: "Vijay Muppala",
    product: "MICRO-VOLUME SPECTROPHOTOMETER",
    salesStage: "Prospecting",
    closingDate: "",
    buyerRef: "",
    priority: "high",
    status: "inactive",
  },
]

const stats = [
  {
    title: "Total Leads",
    value: "298",
    change: { value: "+8.2%", type: "positive" as const, period: "from last month" },
    icon: Users,
  },
  {
    title: "Qualified Leads",
    value: "156",
    change: { value: "+12.5%", type: "positive" as const, period: "from last month" },
    icon: Target,
  },
  {
    title: "Conversion Rate",
    value: "24.8%",
    change: { value: "+2.1%", type: "positive" as const, period: "from last month" },
    icon: TrendingUp,
  },
  {
    title: "Avg. Response Time",
    value: "2.4h",
    change: { value: "-0.3h", type: "positive" as const, period: "from last month" },
    icon: Clock,
  },
]

export function LeadsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [leadFilter, setLeadFilter] = useState("all")
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)

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

  const filteredLeads = leads.filter((lead) => {
    if (leadFilter === "active") {
      return lead.status === "active"
    }
    return true // Show all leads
  })

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
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddLeadModalOpen(true)}>
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
                All Leads ({leads.length})
              </Button>
              <Button
                variant={leadFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setLeadFilter("active")}
                className={leadFilter === "active" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Active Leads ({leads.filter((lead) => lead.status === "active").length})
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
                    <p className="text-xs text-gray-500">Contact: {lead.contactName}</p>
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
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Generate AI Email">
                      <Brain className="w-4 h-4" />
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
        <AIEmailGenerator lead={leads[0] as LeadData} context="follow-up" />

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
            {leads.slice(0, 2).map((lead, index) => {
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
            })}
          </CardContent>
        </Card>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal isOpen={isAddLeadModalOpen} onClose={() => setIsAddLeadModalOpen(false)} />
    </div>
  )
}
