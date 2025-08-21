"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Users, Package, AlertTriangle, Calendar, Coins, Target, Plus, ArrowRight, Bell, Brain, Sparkles, Building2 } from "lucide-react"
import { SalesChart } from "@/components/sales-chart"
import { ComplaintsChart } from "@/components/complaints-chart"
import { Badge } from "@/components/ui/badge"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { AIInsightsService, LeadData, OpportunityData, ComplaintData } from "@/lib/ai-services"

const stats = [
  {
    title: "Total Revenue",
    value: "₹72,84,475",
    change: { value: "+12.5%", type: "positive" as const, period: "from last month" },
    icon: Coins,
    trend: "up" as const,
  },
  {
    title: "Active Leads",
    value: "298",
    change: { value: "+8.2%", type: "positive" as const, period: "from last month" },
    icon: Users,
    trend: "up" as const,
  },
  {
    title: "Products Sold",
    value: "1,247",
    change: { value: "+15.3%", type: "positive" as const, period: "from last month" },
    icon: Package,
    trend: "up" as const,
  },
  {
    title: "Open Complaints",
    value: "23",
    change: { value: "-5.1%", type: "negative" as const, period: "from last month" },
    icon: AlertTriangle,
    trend: "down" as const,
  },
]

const salesTargets = [
  { name: "Monthly Target", current: 42500, target: 50000, percentage: 85 },
  { name: "Quarterly Target", current: 128500, target: 150000, percentage: 86 },
  { name: "Annual Target", current: 485000, target: 600000, percentage: 81 },
]

const urgentTasks = [
  { title: "Follow up with TSAR Labcare", priority: "high", dueDate: "Today" },
  { title: "Prepare quotation for Eurofins", priority: "medium", dueDate: "Tomorrow" },
  { title: "Schedule installation visit", priority: "high", dueDate: "This week" },
]

export function DashboardContent() {
  // Sample data for AI insights
  const sampleLeads: LeadData[] = [
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
    }
  ]
  
  const sampleOpportunities: OpportunityData[] = [
    {
      id: "OPP-001",
      accountName: "TSAR Labcare",
      contactName: "Mr. Mahesh",
      product: "TRICOLOR MULTICHANNEL FIBRINOMETER",
      value: "₹8,50,000",
      stage: "Negotiation",
      probability: "85%",
      expectedClose: "30/08/2025",
      source: "Referral"
    }
  ]
  
  const sampleComplaints: ComplaintData[] = [
    {
      id: "2016-17/010",
      date: "27/02/2017",
      accountName: "JNCASR",
      contactName: "Dr. Anu Rang",
      productService: "ND 1000 Spectrophotometer-ND 1000",
      complaintType: "No Warranty/AMC",
      severity: "High",
      status: "New",
      description: "Equipment not functioning properly, requires immediate attention",
    }
  ]
  
  const aiInsights = AIInsightsService.generateDashboardInsights(
    sampleLeads,
    sampleOpportunities,
    sampleComplaints
  )

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Welcome Section with AI Context */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold">Welcome back, Prashanth!</h1>
                <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">
                  AI Active
                </Badge>
              </div>
              <p className="text-blue-100 mb-3">Your AI assistant has been busy analyzing your pipeline.</p>
              
              {/* AI-Generated Daily Summary */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>15 new leads scored</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>3 deals need attention</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Next month: +17% revenue predicted</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Smart Notifications */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer">
                  <Bell className="h-6 w-6" />
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </div>
                {/* Smart notification preview */}
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-gray-900 rounded-lg shadow-lg border opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium">TSAR Labcare deal at risk</span>
                        <Badge className="text-xs bg-red-100 text-red-800">Urgent</Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Eurofins: Ready for quote</span>
                        <Badge className="text-xs bg-green-100 text-green-800">Ready</Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">5 leads scored above 80%</span>
                        <Badge className="text-xs bg-blue-100 text-blue-800">Hot</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Status Indicator */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Brain className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <EnhancedCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Quick Actions Bar */}
      <Card className="border-dashed border-2 border-gray-200 hover:border-blue-300 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Quick Actions</h3>
              <p className="text-muted-foreground">Frequently used actions for faster workflow</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
              <Button variant="outline" size="sm">
                <Package className="w-4 h-4 mr-2" />
                New Product
              </Button>
              <Button variant="outline" size="sm">
                <Building2 className="w-4 h-4 mr-2" />
                New Account
              </Button>
              <Button variant="outline" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Log Complaint
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <ComplaintsChart />
      </div>

      {/* Sales Targets and Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Sales Targets
            </CardTitle>
            <CardDescription>Track your progress towards sales goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesTargets.map((target) => (
              <div key={target.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{target.name}</span>
                  <span className="text-gray-600">
                    ₹{target.current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / ₹{target.target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
                <Progress value={target.percentage} className="h-3" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{target.percentage}% completed</span>
                  <StatusIndicator
                    status={target.percentage >= 90 ? "On Track" : target.percentage >= 70 ? "Good" : "Behind"}
                    variant={target.percentage >= 90 ? "success" : target.percentage >= 70 ? "warning" : "error"}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {/* 🤖 AI Command Center - Unified AI Hub */}
      <Card className="border-l-4 border-l-gradient-to-r from-purple-500 to-blue-500 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 mr-3 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">🤖 AI Command Center</h3>
                <p className="text-sm text-gray-600 font-normal">Your Autonomous Sales Intelligence Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500 text-white animate-pulse">Live</Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">24/7 Active</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Priority Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg flex items-center text-red-700">
                <AlertTriangle className="w-5 h-5 mr-2" />
                🎯 Priority Tasks
                <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Revenue Impact Sorted</Badge>
              </h4>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Critical Priority Task */}
              <div className="p-4 rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all cursor-pointer shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="font-bold text-gray-900">Follow up with TSAR Labcare</p>
                      <Badge className="bg-red-100 text-red-800 text-xs font-bold">₹8.5L AT RISK</Badge>
                      <Badge className="bg-red-500 text-white text-xs">CRITICAL</Badge>
                    </div>
                    <div className="ml-6 space-y-1">
                      <p className="text-sm text-gray-700">🕐 Last contact: 5 days ago • 📊 AI Confidence: 85% close probability</p>
                      <p className="text-sm font-semibold text-red-700">🤖 AI Command: Call TODAY before 3 PM - Customer usually available 2-4 PM</p>
                      <p className="text-xs text-gray-600">💡 Talking points: Reference previous fibrinometer discussion, mention 15% early-bird discount</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-right text-xs text-gray-600">
                      <div className="font-semibold text-red-600">Impact: CRITICAL</div>
                      <div className="font-semibold text-red-600">Urgency: TODAY</div>
                    </div>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                      📞 Call Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* High Priority Task */}
              <div className="p-4 rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <p className="font-semibold text-gray-900">Generate quotation for Eurofins</p>
                      <Badge className="bg-green-100 text-green-800 text-xs">🔥 HOT LEAD</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">HIGH</Badge>
                    </div>
                    <div className="ml-6 space-y-1">
                      <p className="text-sm text-gray-700">📅 Requested: 2 days ago • 💰 Similar deals: ₹12L average • 🎯 Win rate: 78%</p>
                      <p className="text-sm font-semibold text-yellow-700">🤖 AI Recommendation: Use template QT-LAB-001, add 15% margin, include free training</p>
                      <p className="text-xs text-gray-600">⚡ Auto-generated quote ready - just needs your approval</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-right text-xs text-gray-600">
                      <div>Impact: High</div>
                      <div>Urgency: Medium</div>
                    </div>
                    <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                      📄 Review Quote
                    </Button>
                  </div>
                </div>
              </div>

              {/* Medium Priority Task */}
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="font-medium text-sm">Schedule installation - Kerala Agri University</p>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">PAID</Badge>
                    </div>
                    <p className="text-xs text-gray-600 ml-4">🤖 AI Insight: Customer prefers Mon-Wed mornings (9-11 AM)</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-blue-600">
                    📅 Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Intelligence Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Smart Insights & Alerts */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center text-purple-700">
                <Sparkles className="w-4 h-4 mr-2" />
                🔮 Smart Insights
              </h4>
              <div className="space-y-2">
                {aiInsights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border-l-4 border-l-purple-400 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                      </div>
                      <Badge 
                        className={insight.type === 'opportunity' ? 'bg-green-100 text-green-800' : 
                                 insight.type === 'risk' ? 'bg-red-100 text-red-800' : 
                                 'bg-blue-100 text-blue-800'}
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {/* Real-time Alert */}
                <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <p className="text-sm font-semibold text-red-800">🚨 Live Alert</p>
                  </div>
                  <p className="text-xs text-red-700 mt-1">Eurofins just visited pricing page 3x - High buying intent detected!</p>
                </div>
              </div>
            </div>

            {/* Auto-Actions Status */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center text-blue-700">
                <Target className="w-4 h-4 mr-2" />
                ⚡ Auto-Actions
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✅</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lead Scoring Complete</p>
                      <p className="text-xs text-gray-600">15 leads scored • 5 marked as hot</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-yellow-600 text-sm">⚡</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Risk Analysis Running</p>
                      <p className="text-xs text-gray-600">Analyzing 23 deals • ETA: 2 min</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">🎯</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Follow-up Reminders Sent</p>
                      <p className="text-xs text-gray-600">8 reminders • 3 SMS • 5 emails</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Predictions */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center text-green-700">
                <Brain className="w-4 h-4 mr-2" />
                📊 Predictions
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border-l-4 border-l-green-400 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">📈</span>
                      <p className="text-sm font-medium">Revenue Forecast</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">87% confidence</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Next month: ₹85.2L (+17%)</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border-l-4 border-l-orange-400 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600">⚠️</span>
                      <p className="text-sm font-medium">Churn Risk</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 text-xs">78% confidence</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">3 accounts at risk</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-blue-600">🎯</span>
                    <p className="text-sm font-medium">Hot Region</p>
                  </div>
                  <p className="text-xs text-gray-700">Tamil Nadu: +40% conversion</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">Focus Here!</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Command Center Status Bar */}
          <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">🤖 AI Command Center Status</p>
                  <p className="text-sm opacity-90">Monitoring 298 leads • 23 deals • 15 accounts • 47 tasks</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  📊 Full Analytics
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  💬 Chat with AI
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdvancedAnalytics />
    </div>
  )
}
