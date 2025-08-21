"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Clock, Users, Calendar, CheckCircle2, AlertCircle, Brain, Sparkles, Phone, Mail, MessageSquare, ArrowRight, TrendingUp, Filter } from "lucide-react"

export function FollowUpsContent() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const followUps = {
    overdue: [
      {
        id: 1,
        account: "Kerala Agricultural University",
        contact: "Dr. Priya Sharma",
        lastContact: "30 days ago",
        type: "Installation feedback",
        priority: "high",
        aiScore: 85,
        suggestedAction: "Call immediately - Risk of churn",
        preferredChannel: "phone"
      },
      {
        id: 2,
        account: "Eurofins Advinus",
        contact: "Mr. Rajesh Kumar",
        lastContact: "15 days ago",
        type: "Quotation follow-up",
        priority: "high",
        aiScore: 78,
        suggestedAction: "Send reminder email with discount offer",
        preferredChannel: "email"
      }
    ],
    today: [
      {
        id: 3,
        account: "TSAR Labcare",
        contact: "Mr. Mahesh",
        lastContact: "7 days ago",
        type: "Demo follow-up",
        priority: "high",
        aiScore: 92,
        suggestedAction: "Close the deal - High probability",
        preferredChannel: "phone"
      },
      {
        id: 4,
        account: "JNCASR",
        contact: "Dr. Anu Rang",
        lastContact: "3 days ago",
        type: "Support ticket",
        priority: "medium",
        aiScore: 65,
        suggestedAction: "Check resolution status",
        preferredChannel: "email"
      },
      {
        id: 5,
        account: "Guna Foods",
        contact: "Pauline",
        lastContact: "5 days ago",
        type: "Product inquiry",
        priority: "medium",
        aiScore: 72,
        suggestedAction: "Send product catalog",
        preferredChannel: "whatsapp"
      }
    ],
    upcoming: [
      {
        id: 6,
        account: "Bio-Rad Laboratories",
        contact: "Mr. Sanjay",
        dueDate: "Tomorrow",
        type: "Contract renewal",
        priority: "high",
        aiScore: 88,
        suggestedAction: "Prepare renewal proposal with upsell",
        preferredChannel: "meeting"
      },
      {
        id: 7,
        account: "Thermo Fisher",
        contact: "Ms. Anjali",
        dueDate: "In 3 days",
        type: "Training session",
        priority: "low",
        aiScore: 55,
        suggestedAction: "Confirm attendance and materials",
        preferredChannel: "email"
      }
    ]
  }

  const stats = {
    total: 12,
    overdue: 2,
    todayDue: 5,
    completed: 3,
    responseRate: 78
  }

  const aiRecommendations = [
    {
      title: "Batch follow-ups",
      description: "Group 5 similar follow-ups into one email campaign",
      impact: "Save 2 hours",
      action: "Create Campaign"
    },
    {
      title: "Best time to call",
      description: "Your contacts are most responsive between 10-11 AM",
      impact: "40% better response",
      action: "Schedule Calls"
    },
    {
      title: "Auto-follow templates",
      description: "AI has prepared 3 personalized templates",
      impact: "5x faster",
      action: "Use Templates"
    }
  ]

  const getChannelIcon = (channel: string) => {
    switch(channel) {
      case 'phone': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />
      case 'meeting': return <Users className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-ups</h1>
          <p className="text-gray-500 mt-1">AI-powered follow-up management and reminders</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Set Reminder
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Follow-ups</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Today</p>
                <p className="text-2xl font-bold">{stats.todayDue}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold">{stats.responseRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <Progress value={stats.responseRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Smart suggestions to optimize your follow-up process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-purple-100">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">
                        {rec.impact}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Follow-up Lists */}
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Queue</CardTitle>
          <CardDescription>Organized by priority and timing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overdue" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overdue" className="relative">
                Overdue
                {followUps.overdue.length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 px-1">
                    {followUps.overdue.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="today">
                Today
                <Badge variant="default" className="ml-2 h-5 px-1">
                  {followUps.today.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming
                <Badge variant="outline" className="ml-2 h-5 px-1">
                  {followUps.upcoming.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overdue" className="space-y-4 mt-4">
              {followUps.overdue.map((followUp) => (
                <div key={followUp.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{followUp.account}</h3>
                        <Badge variant="destructive" className="text-xs">Overdue</Badge>
                        <Badge className="text-xs bg-purple-100 text-purple-800">
                          AI Score: {followUp.aiScore}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {followUp.contact}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Last contact: {followUp.lastContact}
                        </span>
                        <span>{followUp.type}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-3 p-2 bg-white rounded">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <p className="text-sm text-purple-900">{followUp.suggestedAction}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        {getChannelIcon(followUp.preferredChannel)}
                        <span className="ml-2">Contact Now</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="today" className="space-y-4 mt-4">
              {followUps.today.map((followUp) => (
                <div key={followUp.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{followUp.account}</h3>
                        {followUp.priority === 'high' && <Badge variant="destructive" className="text-xs">High Priority</Badge>}
                        <Badge className="text-xs bg-purple-100 text-purple-800">
                          AI Score: {followUp.aiScore}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {followUp.contact}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Last contact: {followUp.lastContact}
                        </span>
                        <span>{followUp.type}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-3 p-2 bg-purple-50 rounded">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <p className="text-sm text-purple-900">{followUp.suggestedAction}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Button size="sm" variant={followUp.priority === 'high' ? 'default' : 'outline'}>
                        {getChannelIcon(followUp.preferredChannel)}
                        <span className="ml-2">Follow-up</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4 mt-4">
              {followUps.upcoming.map((followUp) => (
                <div key={followUp.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{followUp.account}</h3>
                        <Badge variant="outline" className="text-xs">{followUp.dueDate}</Badge>
                        <Badge className="text-xs bg-purple-100 text-purple-800">
                          AI Score: {followUp.aiScore}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {followUp.contact}
                        </span>
                        <span>{followUp.type}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-3 p-2 bg-gray-50 rounded">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <p className="text-sm text-gray-700">{followUp.suggestedAction}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Button size="sm" variant="outline">
                        {getChannelIcon(followUp.preferredChannel)}
                        <span className="ml-2">Schedule</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}