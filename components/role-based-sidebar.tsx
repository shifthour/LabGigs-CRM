"use client"

// Force refresh - updated categorized navigation

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Home,
  Package,
  UserCheck,
  Activity,
  FileText,
  AlertTriangle,
  Wrench,
  Settings,
  BarChart3,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Beaker,
  Handshake,
  ShoppingCart,
  FolderOpen,
  Bell,
  MessageSquare,
  Users,
  Zap,
  Briefcase,
  Store,
  Mic,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Brain,
  Contact,
  LifeBuoy,
  Ticket,
  Lightbulb,
  Receipt,
} from "lucide-react"

// Define user roles and their accessible modules with categorized structure based on Zoho CRM design
const roleBasedNavigation = {
  "Sales Manager": [
    { name: "Dashboard", href: "/", icon: Home, badge: null, type: "item" },
    {
      name: "Activities",
      icon: Activity,
      type: "category",
      children: [
        { name: "Daily Hub", href: "/activities/daily-hub", icon: Calendar, badge: "12" },
        { name: "AI Assistant", href: "/activities/ai-assistant", icon: Brain, badge: "NEW" },
        { name: "Follow-ups", href: "/activities/follow-ups", icon: Bell, badge: "8" },
      ]
    },
    {
      name: "Sales",
      icon: ShoppingBag,
      type: "category", 
      children: [
        { name: "Leads", href: "/leads", icon: UserCheck, badge: "298" },
        { name: "Contacts", href: "/contacts", icon: Contact, badge: "1.2K" },
        { name: "Accounts", href: "/accounts", icon: Building2, badge: "3.9K" },
        { name: "Deals", href: "/opportunities", icon: Handshake, badge: "15" },
      ]
    },
    {
      name: "Inventory",
      icon: Package,
      type: "category",
      children: [
        { name: "Products", href: "/products", icon: Package, badge: "2K+" },
        { name: "Quotations", href: "/quotations", icon: FileText, badge: "12" },
        { name: "Sales Orders", href: "/sales-orders", icon: ShoppingCart, badge: "23" },
        { name: "Invoices", href: "/invoices", icon: FileText, badge: "45" },
      ]
    },
    {
      name: "Services", 
      icon: Wrench,
      type: "category",
      children: [
        { name: "Installations", href: "/installations", icon: Wrench, badge: "8" },
        { name: "AMC", href: "/amc", icon: Calendar, badge: "89" },
        { name: "Complaints", href: "/complaints", icon: AlertTriangle, badge: "23" },
      ]
    },
    {
      name: "Projects",
      icon: Briefcase, 
      type: "category",
      children: [
        { name: "Projects", href: "/projects", icon: Briefcase, badge: "12" },
        { name: "Gig Workspace", href: "/gig-workspace", icon: Users, badge: "156" },
      ]
    },
    {
      name: "Support",
      icon: LifeBuoy,
      type: "category",
      children: [
        { name: "Cases", href: "/cases", icon: Ticket, badge: "23" },
        { name: "Solutions", href: "/solutions", icon: Lightbulb, badge: "89" },
      ]
    },
    {
      name: "Reports & Admin",
      icon: BarChart3,
      type: "category",
      children: [
        { name: "MIS Reports", href: "/mis-reports", icon: BarChart3, badge: null },
        { name: "Doc Library", href: "/doc-library", icon: FolderOpen, badge: "270" },
        { name: "Admin", href: "/admin", icon: Settings, badge: null },
      ]
    },
  ],
  "Service Manager": [
    { name: "Dashboard", href: "/", icon: Home, badge: null, type: "item" },
    {
      name: "Activities",
      icon: Activity,
      type: "category",
      children: [
        { name: "Daily Hub", href: "/activities/daily-hub", icon: Calendar, badge: "10" },
        { name: "AI Assistant", href: "/activities/ai-assistant", icon: Brain, badge: "NEW" },
        { name: "Follow-ups", href: "/activities/follow-ups", icon: Bell, badge: "6" },
      ]
    },
    {
      name: "Services",
      icon: Wrench,
      type: "category",
      children: [
        { name: "Installations", href: "/installations", icon: Wrench, badge: "8" },
        { name: "AMC", href: "/amc", icon: Calendar, badge: "89" },
        { name: "Complaints", href: "/complaints", icon: AlertTriangle, badge: "23" },
      ]
    },
    {
      name: "Projects",
      icon: Briefcase,
      type: "category",
      children: [
        { name: "Projects", href: "/projects", icon: Briefcase, badge: "12" },
        { name: "Gig Workspace", href: "/gig-workspace", icon: Users, badge: "45" },
      ]
    },
    {
      name: "Support",
      icon: LifeBuoy,
      type: "category",
      children: [
        { name: "Cases", href: "/cases", icon: Ticket, badge: "15" },
        { name: "Solutions", href: "/solutions", icon: Lightbulb, badge: "45" },
      ]
    },
    {
      name: "Reports & Admin",
      icon: BarChart3,
      type: "category",
      children: [
        { name: "Doc Library", href: "/doc-library", icon: FolderOpen, badge: "270" },
      ]
    },
  ],
  "Marketing Manager": [
    { name: "Dashboard", href: "/", icon: Home, badge: null, type: "item" },
    {
      name: "Activities",
      icon: Activity,
      type: "category",
      children: [
        { name: "Daily Hub", href: "/activities/daily-hub", icon: Calendar, badge: "14" },
        { name: "AI Assistant", href: "/activities/ai-assistant", icon: Brain, badge: "NEW" },
        { name: "Follow-ups", href: "/activities/follow-ups", icon: Bell, badge: "9" },
      ]
    },
    {
      name: "Sales",
      icon: ShoppingBag,
      type: "category",
      children: [
        { name: "Leads", href: "/leads", icon: UserCheck, badge: "298" },
        { name: "Contacts", href: "/contacts", icon: Contact, badge: "1.2K" },
        { name: "Accounts", href: "/accounts", icon: Building2, badge: "3.9K" },
        { name: "Deals", href: "/opportunities", icon: Handshake, badge: "8" },
      ]
    },
    {
      name: "Support",
      icon: LifeBuoy,
      type: "category",
      children: [
        { name: "Cases", href: "/cases", icon: Ticket, badge: "12" },
        { name: "Solutions", href: "/solutions", icon: Lightbulb, badge: "25" },
      ]
    },
    {
      name: "Reports & Admin",
      icon: BarChart3,
      type: "category",
      children: [
        { name: "MIS Reports", href: "/mis-reports", icon: BarChart3, badge: null },
        { name: "Doc Library", href: "/doc-library", icon: FolderOpen, badge: "270" },
      ]
    },
  ],
  "Project Manager": [
    { name: "Dashboard", href: "/", icon: Home, badge: null, type: "item" },
    {
      name: "Activities",
      icon: Activity,
      type: "category",
      children: [
        { name: "Daily Hub", href: "/activities/daily-hub", icon: Calendar, badge: "18" },
        { name: "AI Assistant", href: "/activities/ai-assistant", icon: Brain, badge: "NEW" },
        { name: "Follow-ups", href: "/activities/follow-ups", icon: Bell, badge: "7" },
      ]
    },
    {
      name: "Projects",
      icon: Briefcase,
      type: "category",
      children: [
        { name: "Projects", href: "/projects", icon: Briefcase, badge: "12" },
        { name: "Installations", href: "/installations", icon: Wrench, badge: "8" },
        { name: "Gig Workspace", href: "/gig-workspace", icon: Users, badge: "156" },
      ]
    },
    {
      name: "Support",
      icon: LifeBuoy,
      type: "category",
      children: [
        { name: "Cases", href: "/cases", icon: Ticket, badge: "18" },
        { name: "Solutions", href: "/solutions", icon: Lightbulb, badge: "67" },
      ]
    },
    {
      name: "Reports & Admin",
      icon: BarChart3,
      type: "category",
      children: [
        { name: "Doc Library", href: "/doc-library", icon: FolderOpen, badge: "270" },
      ]
    },
    { name: "Accounts", href: "/accounts", icon: Building2, badge: "1.2K", type: "item" },
  ],
  "Sales Rep": [
    { name: "Dashboard", href: "/", icon: Home, badge: null, type: "item" },
    {
      name: "Activities",
      icon: Activity,
      type: "category",
      children: [
        { name: "Daily Hub", href: "/activities/daily-hub", icon: Calendar, badge: "9" },
        { name: "AI Assistant", href: "/activities/ai-assistant", icon: Brain, badge: "NEW" },
        { name: "Follow-ups", href: "/activities/follow-ups", icon: Bell, badge: "5" },
      ]
    },
    {
      name: "Sales",
      icon: ShoppingBag,
      type: "category",
      children: [
        { name: "Leads", href: "/leads", icon: UserCheck, badge: "45" },
        { name: "Contacts", href: "/contacts", icon: Contact, badge: "234" },
        { name: "Accounts", href: "/accounts", icon: Building2, badge: "234" },
        { name: "Deals", href: "/opportunities", icon: Handshake, badge: "8" },
      ]
    },
    {
      name: "Support",
      icon: LifeBuoy,
      type: "category",
      children: [
        { name: "Cases", href: "/cases", icon: Ticket, badge: "8" },
        { name: "Solutions", href: "/solutions", icon: Lightbulb, badge: "12" },
      ]
    },
    {
      name: "Reports & Admin",
      icon: BarChart3,
      type: "category",
      children: [
        { name: "Doc Library", href: "/doc-library", icon: FolderOpen, badge: "270" },
      ]
    },
  ],
  Admin: [
    { name: "Dashboard", href: "/", icon: Home, badge: null, type: "item" },
    {
      name: "Activities",
      icon: Activity,
      type: "category",
      children: [
        { name: "Daily Hub", href: "/activities/daily-hub", icon: Calendar, badge: "15" },
        { name: "AI Assistant", href: "/activities/ai-assistant", icon: Brain, badge: "NEW" },
        { name: "Follow-ups", href: "/activities/follow-ups", icon: Bell, badge: "10" },
      ]
    },
    {
      name: "Sales",
      icon: ShoppingBag,
      type: "category",
      children: [
        { name: "Leads", href: "/leads", icon: UserCheck, badge: "298" },
        { name: "Contacts", href: "/contacts", icon: Contact, badge: "1.2K" },
        { name: "Accounts", href: "/accounts", icon: Building2, badge: "3.9K" },
        { name: "Deals", href: "/opportunities", icon: Handshake, badge: "15" },
      ]
    },
    {
      name: "Inventory",
      icon: Package,
      type: "category",
      children: [
        { name: "Products", href: "/products", icon: Package, badge: "2K+" },
        { name: "Quotations", href: "/quotations", icon: FileText, badge: "12" },
        { name: "Sales Orders", href: "/sales-orders", icon: ShoppingCart, badge: "23" },
        { name: "Invoices", href: "/invoices", icon: FileText, badge: "45" },
      ]
    },
    {
      name: "Services",
      icon: Wrench,
      type: "category",
      children: [
        { name: "Installations", href: "/installations", icon: Wrench, badge: "8" },
        { name: "AMC", href: "/amc", icon: Calendar, badge: "89" },
        { name: "Complaints", href: "/complaints", icon: AlertTriangle, badge: "23" },
      ]
    },
    {
      name: "Projects",
      icon: Briefcase,
      type: "category",
      children: [
        { name: "Projects", href: "/projects", icon: Briefcase, badge: "12" },
        { name: "Gig Workspace", href: "/gig-workspace", icon: Users, badge: "156" },
      ]
    },
    {
      name: "Support",
      icon: LifeBuoy,
      type: "category",
      children: [
        { name: "Cases", href: "/cases", icon: Ticket, badge: "23" },
        { name: "Solutions", href: "/solutions", icon: Lightbulb, badge: "89" },
      ]
    },
    {
      name: "Reports & Admin",
      icon: BarChart3,
      type: "category",
      children: [
        { name: "MIS Reports", href: "/mis-reports", icon: BarChart3, badge: null },
        { name: "Doc Library", href: "/doc-library", icon: FolderOpen, badge: "270" },
        { name: "Admin", href: "/admin", icon: Settings, badge: null },
      ]
    },
  ],
}

export function RoleBasedSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  
  // Use Sales Manager role by default (shows all navigation items)
  const currentRole = "Sales Manager"
  const navigation = roleBasedNavigation[currentRole] || []
  
  // Initialize with Activities category expanded by default (as per screenshot design)  
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Activities"])

  // Get active category based on current path
  const getActiveCategory = () => {
    for (const item of navigation) {
      if (item.type === "category" && item.children) {
        const hasActiveChild = item.children.some(child => pathname === child.href)
        if (hasActiveChild) {
          return item.name
        }
      }
    }
    return null
  }

  // Update expanded categories when navigation changes
  useEffect(() => {
    const activeCategory = getActiveCategory()
    
    setExpandedCategories(prev => {
      const newExpanded = []
      
      // Always add the active category (the one containing the current page)
      if (activeCategory) {
        newExpanded.push(activeCategory)
      }
      
      // If no active category and we're on dashboard, expand Activities by default
      if (!activeCategory && pathname === "/") {
        newExpanded.push("Activities")
      }
      
      return newExpanded
    })
  }, [pathname])

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      if (prev.includes(categoryName)) {
        // Remove the category from expanded list (allow all categories to be minimized)
        return prev.filter(name => name !== categoryName)
      } else {
        return [...prev, categoryName]
      }
    })
  }


  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <Beaker className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">LabGig</h1>
                  <p className="text-xs text-gray-500">
                    CRM System.
                    <br />
                    AI Powered
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn("ml-auto hover:bg-gray-100", collapsed && "mx-auto")}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav 
            className="space-y-1"
            onMouseLeave={() => {
              if (!collapsed) {
                setExpandedCategories([])
              }
            }}
          >
            {navigation.map((item) => {
              if (item.type === "category") {
                const isExpanded = expandedCategories.includes(item.name)
                const hasActiveChild = item.children?.some(child => pathname === child.href)
                
                return (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => {
                      if (!collapsed) {
                        setExpandedCategories([item.name])
                      }
                    }}
                  >
                    {/* Invisible hover zone that extends upward to catch cursor from previous expanded items */}
                    <div 
                      className="absolute -top-4 left-0 right-0 h-4 z-10"
                      onMouseEnter={() => {
                        if (!collapsed) {
                          setExpandedCategories([item.name])
                        }
                      }}
                    />
                    <div
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer relative",
                        "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        collapsed && "justify-center",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "flex-shrink-0 w-5 h-5 transition-colors",
                          collapsed ? "mr-0" : "mr-3",
                          "text-gray-400 group-hover:text-gray-600",
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </>
                      )}
                    </div>
                    
                    {!collapsed && isExpanded && item.children && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isActive = pathname === child.href
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                                "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              )}
                            >
                              <child.icon
                                className={cn(
                                  "flex-shrink-0 w-4 h-4 mr-3 transition-colors",
                                  "text-gray-400 group-hover:text-gray-600"
                                )}
                              />
                              <span className="flex-1">{child.name}</span>
                              {child.badge && (
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "ml-auto text-xs",
                                    "bg-gray-100 text-gray-600"
                                  )}
                                >
                                  {child.badge}
                                </Badge>
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              } else {
                // Regular navigation item
                const isActive = pathname === item.href
                const NavItem = (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      collapsed && "justify-center",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0 w-5 h-5 transition-colors",
                        collapsed ? "mr-0" : "mr-3",
                        isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600",
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-auto text-xs",
                              isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600",
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                )

                if (collapsed) {
                  return (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                      <TooltipContent side="right" className="flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return NavItem
              }
            })}
          </nav>
        </ScrollArea>

        {/* Footer with user info */}
        <div className="p-3 border-t border-gray-200">
          {!collapsed ? (
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                PS
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Prashanth S.</p>
                <p className="text-xs text-gray-500 truncate">{currentRole}</p>
              </div>
              <div className="relative">
                <Bell className="w-4 h-4 text-gray-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium mx-auto cursor-pointer">
                  PS
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Prashanth Sandilya</p>
                <p className="text-xs text-muted-foreground">{currentRole}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
