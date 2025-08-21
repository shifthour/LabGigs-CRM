"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Package, AlertTriangle, Calendar, Download, Eye } from "lucide-react"

const reportCategories = [
  {
    title: "Sales Reports",
    description: "Revenue, targets, and performance analytics",
    reports: [
      { name: "Monthly Sales Report", lastGenerated: "Today", status: "Ready" },
      { name: "Sales Target vs Achievement", lastGenerated: "Yesterday", status: "Ready" },
      { name: "Product-wise Sales Analysis", lastGenerated: "2 days ago", status: "Ready" },
      { name: "Territory-wise Performance", lastGenerated: "3 days ago", status: "Ready" },
    ],
    icon: TrendingUp,
    color: "bg-green-100 text-green-800",
  },
  {
    title: "Customer Reports",
    description: "Account analysis and customer insights",
    reports: [
      { name: "Customer Acquisition Report", lastGenerated: "Today", status: "Ready" },
      { name: "Account Activity Summary", lastGenerated: "Yesterday", status: "Processing" },
      { name: "Customer Satisfaction Analysis", lastGenerated: "1 week ago", status: "Ready" },
      { name: "Top Customers by Revenue", lastGenerated: "2 days ago", status: "Ready" },
    ],
    icon: Users,
    color: "bg-blue-100 text-blue-800",
  },
  {
    title: "Product Reports",
    description: "Product performance and inventory insights",
    reports: [
      { name: "Product Performance Analysis", lastGenerated: "Today", status: "Ready" },
      { name: "Best Selling Products", lastGenerated: "Yesterday", status: "Ready" },
      { name: "Product Category Analysis", lastGenerated: "3 days ago", status: "Ready" },
      { name: "Inventory Status Report", lastGenerated: "1 week ago", status: "Scheduled" },
    ],
    icon: Package,
    color: "bg-purple-100 text-purple-800",
  },
  {
    title: "Service Reports",
    description: "AMC, installations, and service analytics",
    reports: [
      { name: "AMC Renewal Report", lastGenerated: "Today", status: "Ready" },
      { name: "Installation Status Report", lastGenerated: "Yesterday", status: "Ready" },
      { name: "Service Response Time Analysis", lastGenerated: "2 days ago", status: "Ready" },
      { name: "Complaint Resolution Report", lastGenerated: "3 days ago", status: "Processing" },
    ],
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-800",
  },
]

const quickStats = [
  { title: "Reports Generated", value: "156", period: "This Month", trend: "+12%" },
  { title: "Scheduled Reports", value: "23", period: "Active", trend: "+3%" },
  { title: "Data Sources", value: "8", period: "Connected", trend: "100%" },
  { title: "Users Accessing", value: "15", period: "This Week", trend: "+8%" },
]

export function MISReportsContent() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ready":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MIS Reports</h1>
          <p className="text-gray-600">Management Information System - Analytics and Reports</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <span className="text-green-600 font-medium">{stat.trend}</span>
                <span className="ml-1">{stat.period}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <category.icon className="w-5 h-5 mr-2" />
                {category.title}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.reports.map((report) => (
                  <div
                    key={report.name}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{report.name}</h4>
                      <p className="text-xs text-gray-500">Last generated: {report.lastGenerated}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="View Report">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Report Activity</CardTitle>
          <CardDescription>Latest report generations and scheduled tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                report: "Monthly Sales Report",
                action: "Generated",
                user: "System",
                time: "2 hours ago",
                status: "Success",
              },
              {
                report: "Customer Acquisition Report",
                action: "Generated",
                user: "Prashanth Sandilya",
                time: "4 hours ago",
                status: "Success",
              },
              {
                report: "Account Activity Summary",
                action: "Processing",
                user: "System",
                time: "6 hours ago",
                status: "In Progress",
              },
              {
                report: "Product Performance Analysis",
                action: "Scheduled",
                user: "Hari Kumar K",
                time: "1 day ago",
                status: "Pending",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{activity.report}</p>
                    <p className="text-xs text-gray-500">
                      {activity.action} by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
