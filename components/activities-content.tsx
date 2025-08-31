"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, Edit, Activity, Phone, Mail, Calendar, FileText } from "lucide-react"

interface Activity {
  id: string
  date: string
  type: string
  account: string
  linkTo: string
  contactName: string
  productService: string
  status: string
  assignedTo: string
  notes: string
}

const activityTypes = ["All", "Call", "Email", "Meeting", "Task", "Follow-up", "Demo"]
const statuses = ["All", "Completed", "In Progress", "Scheduled", "Cancelled", "Sent"]
const linkTypes = ["All", "Lead", "Opportunity", "Account", "Installation", "Complaint", "AMC"]

export function ActivitiesContent() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [statsLoaded, setStatsLoaded] = useState(false)
  const [activityStats, setActivityStats] = useState({
    total: 0,
    completedToday: 0,
    scheduled: 0,
    overdue: 0
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedLinkType, setSelectedLinkType] = useState("All")

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      // Generate activities from leads and deals data
      const [leadsRes, dealsRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/deals')
      ])
      
      const leadsData = await leadsRes.json()
      const dealsData = await dealsRes.json()
      
      const leads = leadsData.leads || []
      const deals = dealsData.deals || []
      
      // Create activities from leads
      const leadActivities = leads.map((lead: any, index: number) => ({
        id: `LEAD-${lead.id.slice(0, 8)}`,
        date: new Date(lead.created_at).toLocaleDateString('en-GB'),
        type: lead.lead_status === 'New' ? 'Lead Created' : 'Lead Updated',
        account: lead.account_name,
        linkTo: 'Lead',
        contactName: lead.contact_name || 'Unknown',
        productService: lead.product_name || 'General Inquiry',
        status: lead.lead_status === 'Qualified' ? 'Completed' : 
                lead.lead_status === 'New' ? 'In Progress' : 'Scheduled',
        assignedTo: lead.assigned_to || 'Unassigned',
        notes: lead.notes || 'Lead activity'
      }))
      
      // Create activities from deals
      const dealActivities = deals.map((deal: any, index: number) => ({
        id: `DEAL-${deal.id.slice(0, 8)}`,
        date: new Date(deal.created_at).toLocaleDateString('en-GB'),
        type: 'Deal Created',
        account: deal.account_name,
        linkTo: 'Opportunity',
        contactName: deal.contact_person,
        productService: deal.product,
        status: deal.status === 'Active' ? 'In Progress' : 
                deal.status === 'Won' ? 'Completed' : 'Scheduled',
        assignedTo: deal.assigned_to || 'Unassigned',
        notes: deal.last_activity || 'Deal activity'
      }))
      
      const allActivities = [...leadActivities, ...dealActivities]
        .sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - 
                       new Date(a.date.split('/').reverse().join('-')).getTime())
      
      setActivities(allActivities)
      
      // Calculate stats
      const today = new Date().toLocaleDateString('en-GB')
      const completedToday = allActivities.filter(act => 
        act.date === today && act.status === 'Completed'
      ).length
      
      const scheduled = allActivities.filter(act => act.status === 'Scheduled').length
      const overdue = allActivities.filter(act => {
        const actDate = new Date(act.date.split('/').reverse().join('-'))
        return actDate < new Date() && act.status !== 'Completed'
      }).length
      
      setActivityStats({
        total: allActivities.length,
        completedToday,
        scheduled,
        overdue
      })
      setStatsLoaded(true)
      
    } catch (error) {
      console.error('Error loading activities:', error)
      setStatsLoaded(true)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "sent":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "call":
        return Phone
      case "email":
        return Mail
      case "meeting":
        return Calendar
      case "task":
        return FileText
      default:
        return Activity
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities Management</h1>
          <p className="text-gray-600">Track and manage all your sales activities</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{!statsLoaded ? "..." : activityStats.total}</div>
            <p className="text-xs text-muted-foreground">From leads and deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{!statsLoaded ? "..." : activityStats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Activities completed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{!statsLoaded ? "..." : activityStats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Scheduled activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{!statsLoaded ? "..." : activityStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Search & Filters</CardTitle>
          <CardDescription>Filter and search through your activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities by account, contact, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLinkType} onValueChange={setSelectedLinkType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Link To" />
              </SelectTrigger>
              <SelectContent>
                {linkTypes.map((linkType) => (
                  <SelectItem key={linkType} value={linkType}>
                    {linkType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities List</CardTitle>
          <CardDescription>Recent activities and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Act #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Link To</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Product/Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => {
                  const TypeIcon = getTypeIcon(activity.type)
                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.id}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="w-4 h-4 text-gray-500" />
                          <span>{activity.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{activity.account}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{activity.linkTo}</Badge>
                      </TableCell>
                      <TableCell>{activity.contactName}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={activity.productService}>
                          {activity.productService}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                      </TableCell>
                      <TableCell>{activity.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
