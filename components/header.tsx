"use client"

import { useState } from "react"
import { Bell, User, Settings, LogOut, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    title: "New lead assigned",
    description: "TSAR Labcare - Fibrinometer inquiry",
    time: "2 min ago",
    type: "lead",
    unread: true,
  },
  {
    id: 2,
    title: "Quotation approved",
    description: "Eurofins Advinus - ₹12,00,000",
    time: "1 hour ago",
    type: "quotation",
    unread: true,
  },
  {
    id: 3,
    title: "Installation completed",
    description: "Kerala Agricultural University",
    time: "3 hours ago",
    type: "installation",
    unread: false,
  },
]

export function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // This would typically come from a global state or API call
  const companyLogo = "/company-logo.png" // Default fallback
  const companyName = "LabGig" // Default fallback

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Company Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={companyLogo || "/placeholder.svg"}
                alt={`${companyName} Logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.nextElementSibling?.classList.remove("hidden")
                }}
              />
              <span className="text-white font-bold text-sm hidden">{companyName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
              <p className="text-xs text-gray-500">
                CRM System.
                <br />
                AI Powered
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Messages */}
          <Button variant="ghost" size="sm" className="relative">
            <MessageSquare className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-blue-500">
              2
            </Badge>
          </Button>

          {/* Enhanced Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {notifications.filter((n) => n.unread).length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all read
                  </Button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn("p-4 border-b hover:bg-gray-50 cursor-pointer", notification.unread && "bg-blue-50")}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={cn("w-2 h-2 rounded-full mt-2", notification.unread ? "bg-blue-500" : "bg-gray-300")}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Enhanced User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">PS</AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">Prashanth Sandilya</p>
                  <p className="text-xs text-gray-500">Sales Manager</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Prashanth Sandilya</p>
                  <p className="text-xs text-muted-foreground">prashanth@labgig.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
