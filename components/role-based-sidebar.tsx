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
  CheckCircle,
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
        { name: "Deals", href: "/deals", icon: Handshake, badge: "15" },
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
        { name: "Deals", href: "/deals", icon: Handshake, badge: "15" },
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
        { name: "Invoices", href: "/invoices", icon: Receipt, badge: "45" },
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
        { name: "Deals", href: "/deals", icon: Handshake, badge: "8" },
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
        { name: "Deals", href: "/deals", icon: Handshake, badge: "15" },
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
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [navigationStats, setNavigationStats] = useState<any>(null)
  const [statsLoaded, setStatsLoaded] = useState(false)
  const pathname = usePathname()
  
  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])
  
  // Load navigation stats with caching
  useEffect(() => {
    loadNavigationStats()
  }, [])
  
  const loadNavigationStats = async (forceRefresh = false) => {
    try {
      // Check cache first (unless forcing refresh)
      if (!forceRefresh) {
        const cachedStats = localStorage.getItem(`navigation-stats`)
        const cacheTime = localStorage.getItem(`navigation-stats-time`)
        
        if (cachedStats && cacheTime) {
          const cacheAge = Date.now() - parseInt(cacheTime)
          const fiveMinutes = 5 * 60 * 1000
          
          if (cacheAge < fiveMinutes) {
            // Use cached data immediately
            setNavigationStats(JSON.parse(cachedStats))
            setStatsLoaded(true)
            return
          }
        }
      }
      
      // Fetch fresh data - ALL counts without filtering
      const response = await fetch(`/api/navigation-stats`)
      
      if (response.ok) {
        const data = await response.json()
        setNavigationStats(data.stats)
        setStatsLoaded(true)
        
        // Cache the results
        localStorage.setItem(`navigation-stats`, JSON.stringify(data.stats))
        localStorage.setItem(`navigation-stats-time`, Date.now().toString())
      }
    } catch (error) {
      console.error('Error loading navigation stats:', error)
      setStatsLoaded(true) // Show UI even if stats fail
    }
  }
  
  // Expose refresh function globally for other components to trigger
  useEffect(() => {
    window.refreshNavigationStats = () => loadNavigationStats(true)
    return () => {
      delete window.refreshNavigationStats
    }
  }, [])
  
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }
  
  const getBadge = (routePath: string) => {
    if (!statsLoaded) return "..." // Show loading state
    
    switch (routePath) {
      case "/leads": return navigationStats?.leads ? formatCount(navigationStats.leads) : "0"
      case "/contacts": return navigationStats?.contacts ? formatCount(navigationStats.contacts) : "0"
      case "/accounts": return navigationStats?.accounts ? formatCount(navigationStats.accounts) : "0"
      case "/deals": return navigationStats?.deals ? formatCount(navigationStats.deals) : "0"
      case "/products": return navigationStats?.products ? formatCount(navigationStats.products) : "0"
      case "/quotations": return navigationStats?.quotations ? formatCount(navigationStats.quotations) : "0"
      case "/sales-orders": return navigationStats?.salesOrders ? formatCount(navigationStats.salesOrders) : "0"
      case "/installations": return navigationStats?.installations ? formatCount(navigationStats.installations) : "0"
      case "/amc": return navigationStats?.amc ? formatCount(navigationStats.amc) : "0"
      case "/complaints": return navigationStats?.complaints ? formatCount(navigationStats.complaints) : "0"
      default: return null
    }
  }
  
  // Use current user's role, fallback to Sales Manager
  const currentRole = currentUser?.role?.name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Sales Manager"
  let navigation = roleBasedNavigation[currentRole] || roleBasedNavigation["Sales Manager"] || []
  
  // Update navigation with real counts using getBadge function
  navigation = navigation.map(item => {
    if (item.type === "category" && item.children) {
      return {
        ...item,
        children: item.children.map(child => ({
          ...child,
          badge: getBadge(child.href) || child.badge
        }))
      }
    }
    return item
  })
  
  // Update admin links based on user type
  if (currentUser?.is_admin || currentUser?.is_super_admin) {
    navigation = navigation.map(item => {
      if (item.type === "category" && item.children) {
        return {
          ...item,
          children: item.children.map(child => {
            if (child.href === "/admin") {
              // Company admins go to company-admin page, super admins go to admin page
              return {
                ...child,
                name: currentUser?.is_super_admin ? "Admin" : "Company Admin",
                href: currentUser?.is_super_admin ? "/admin" : "/company-admin"
              }
            }
            return child
          })
        }
      }
      return item
    })
  } else {
    // Filter out Admin link for non-admin users
    navigation = navigation.map(item => {
      if (item.type === "category" && item.children) {
        return {
          ...item,
          children: item.children.filter(child => child.href !== "/admin")
        }
      }
      return item
    }).filter(item => item.href !== "/admin") // Also remove direct admin links
  }
  
  // Initialize with no categories expanded by default  
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

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
      
      // Only expand the category if we're actively in one of its child pages
      if (activeCategory) {
        newExpanded.push(activeCategory)
      }
      
      // Don't expand anything by default on dashboard
      // User must click to expand categories
      
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
          <nav className="space-y-1">
            {navigation.map((item) => {
              if (item.type === "category") {
                const isExpanded = expandedCategories.includes(item.name)
                const hasActiveChild = item.children?.some(child => pathname === child.href)
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleCategory(item.name)}
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                        hasActiveChild
                          ? "bg-blue-50 text-blue-700 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        collapsed && "justify-center",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "flex-shrink-0 w-5 h-5 transition-colors",
                          collapsed ? "mr-0" : "mr-3",
                          hasActiveChild ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600",
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
                    </button>
                    
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

      </div>
    </TooltipProvider>
  )
}
