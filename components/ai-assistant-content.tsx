"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Sparkles, Send, Mic, Copy, ThumbsUp, ThumbsDown, Zap, TrendingUp, Users, Target, Calendar, MessageSquare } from "lucide-react"

export function AIAssistantContent() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI CRM Assistant. I can help you with lead prioritization, meeting preparation, email drafts, and activity recommendations. How can I assist you today?",
      timestamp: "10:00 AM"
    }
  ])

  const automations = [
    {
      id: 1,
      name: "Auto-schedule follow-ups",
      description: "Automatically schedule follow-up tasks after meetings",
      status: "active",
      savings: "2 hrs/week"
    },
    {
      id: 2,
      name: "Lead scoring",
      description: "AI-powered lead scoring based on engagement",
      status: "active",
      savings: "5 hrs/week"
    },
    {
      id: 3,
      name: "Email templates",
      description: "Smart email suggestions based on context",
      status: "active",
      savings: "3 hrs/week"
    },
    {
      id: 4,
      name: "Meeting summaries",
      description: "Auto-generate meeting notes and action items",
      status: "inactive",
      savings: "4 hrs/week"
    }
  ]

  const insights = [
    {
      type: "opportunity",
      title: "High-value opportunity detected",
      description: "TSAR Labcare showing strong buying signals - 92% close probability",
      action: "Prepare Proposal",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      type: "risk",
      title: "At-risk account",
      description: "No engagement from Kerala Agricultural University in 30 days",
      action: "Schedule Call",
      icon: Users,
      color: "text-red-600"
    },
    {
      type: "optimization",
      title: "Meeting optimization",
      description: "Your Tuesday meetings can be combined to save 2 hours",
      action: "Optimize Schedule",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      type: "lead",
      title: "Warm lead detected",
      description: "Eurofins has visited pricing page 5 times this week",
      action: "Contact Now",
      icon: Target,
      color: "text-purple-600"
    }
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, {
        role: "user",
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }])
      setMessage("")
      
      // Simulate AI response
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          role: "assistant",
          content: "I understand you want to know about lead prioritization. Based on your current pipeline, I recommend focusing on TSAR Labcare (92% close probability) and Eurofins (high engagement score). Would you like me to prepare detailed action plans for these leads?",
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }])
      }, 1000)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-500 mt-1">Your intelligent CRM companion powered by advanced AI</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          AI Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                AI Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                      <div className={`rounded-lg p-3 ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Button variant="ghost" size="sm">
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input Area */}
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Ask me anything about your CRM data..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    What are my top leads?
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    Prepare for today's meetings
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    Email draft for follow-up
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                AI Insights
              </CardTitle>
              <CardDescription>Proactive recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.title} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <insight.icon className={`w-5 h-5 ${insight.color} mt-0.5`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Automations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            AI Automations
          </CardTitle>
          <CardDescription>Tasks being handled automatically by AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {automations.map((automation) => (
              <div key={automation.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{automation.name}</h4>
                  <Badge className={automation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {automation.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{automation.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-600 font-medium">Saves {automation.savings}</span>
                  <Button size="sm" variant="ghost">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}