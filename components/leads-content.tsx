"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Plus, Download, Edit, Phone, Users, Target, TrendingUp, Clock, Zap, Filter, Mail, MessageCircle, Upload, Save, X, CheckCircle, Search, Coins } from "lucide-react"
import { exportToExcel, formatDateForExcel } from "@/lib/excel-export"
import { AILeadScore } from "@/components/ai-lead-score"
import { AIEmailGenerator } from "@/components/ai-email-generator"
import { AIRecommendationService, type LeadData } from "@/lib/ai-services"
import AgenticAIService from "@/lib/agentic-ai-service"
import { AILeadIntelligenceCard } from "@/components/ai-lead-intelligence-card"
import { DataImportModal } from "@/components/data-import-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AddLeadModalSimplified } from "@/components/add-lead-modal-simplified"

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
  </svg>
)

// Smart Product Display Component
const ProductsDisplay = ({ leadProducts, totalBudget }: { leadProducts: any[], totalBudget: number }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (!leadProducts || leadProducts.length === 0) {
    return <span className="text-gray-400 text-sm">No products</span>
  }

  if (leadProducts.length === 1) {
    // Single product - show name clearly
    const product = leadProducts[0]
    return (
      <div>
        <p className="text-sm font-medium">{product.product_name}</p>
        <div className="text-xs text-gray-500 space-y-1 mt-1">
          <p>Qty: {product.quantity}</p>
          <p>Total: {formatCurrency(product.total_amount || 0)}</p>
        </div>
      </div>
    )
  }

  // Multiple products - show smart summary
  const firstProduct = leadProducts[0]
  const remainingCount = leadProducts.length - 1
  
  return (
    <div>
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">{firstProduct.product_name}</p>
        <Popover>
          <PopoverTrigger asChild>
            <Badge 
              variant="outline" 
              className="text-xs cursor-pointer hover:bg-blue-50 hover:border-blue-300"
            >
              +{remainingCount} more
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">All Products ({leadProducts.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {leadProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                    <div>
                      <div className="font-medium">{product.product_name}</div>
                      <div className="text-xs text-gray-500">Qty: {product.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(product.total_amount || 0)}</div>
                      <div className="text-xs text-gray-500">
                        @ {formatCurrency(product.price_per_unit || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Budget:</span>
                  <span className="text-blue-600">{formatCurrency(totalBudget)}</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="text-xs text-gray-500 space-y-1 mt-1">
        <p>Products: {leadProducts.length}</p>
        <p>Total: {formatCurrency(totalBudget)}</p>
      </div>
    </div>
  )
}



export function LeadsContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [leadsList, setLeadsList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("All")
  const [selectedAssignedTo, setSelectedAssignedTo] = useState("All")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)
  const [statsLoaded, setStatsLoaded] = useState(false)
  const [leadsStats, setLeadsStats] = useState({
    total: 0,
    qualified: 0,
    conversionRate: 0,
    totalPipelineValue: 0
  })

  // Load leads from localStorage on component mount
  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      // Load ALL leads without any filtering
      const response = await fetch(`/api/leads`)
      
      if (response.ok) {
        const apiLeads = await response.json()
        
        // For each lead, fetch its products from lead_products table
        const leadsWithProducts = await Promise.all(
          apiLeads.map(async (lead: any) => {
            try {
              // Try to fetch lead products
              const productsResponse = await fetch(`/api/leads/${lead.id}/products`)
              let leadProducts = []
              
              if (productsResponse.ok) {
                const responseData = await productsResponse.json()
                leadProducts = responseData.products || responseData || []
              }
              
              // If no products in junction table, use legacy single product
              if (leadProducts.length === 0 && lead.product_name) {
                leadProducts = [{
                  product_name: lead.product_name,
                  quantity: lead.quantity || 1,
                  price_per_unit: lead.price_per_unit || 0,
                  total_amount: (lead.quantity || 1) * (lead.price_per_unit || 0)
                }]
              }
              
              return { ...lead, leadProducts }
            } catch (error) {
              console.error(`Error fetching products for lead ${lead.id}:`, error)
              // Fallback to legacy single product
              const fallbackProducts = lead.product_name ? [{
                product_name: lead.product_name,
                quantity: lead.quantity || 1,
                price_per_unit: lead.price_per_unit || 0,
                total_amount: (lead.quantity || 1) * (lead.price_per_unit || 0)
              }] : []
              return { ...lead, leadProducts: fallbackProducts }
            }
          })
        )
        
        // Transform API data to match UI format
        const transformedLeads = leadsWithProducts.map((lead: any) => ({
          id: lead.id,
          date: new Date(lead.lead_date || lead.created_at).toLocaleDateString('en-GB'),
          leadName: lead.account_name,
          accountId: lead.account_id,
          accountName: lead.account_name,
          contactId: lead.contact_id,
          contactName: lead.contact_name,
          department: lead.department || '',
          contactNo: lead.phone,
          phone: lead.phone,
          email: lead.email,
          whatsapp: lead.whatsapp || lead.phone,
          assignedTo: lead.assigned_to,
          product: lead.product_name, // Keep for backward compatibility
          productId: lead.product_id,
          leadSource: lead.lead_source,
          salesStage: lead.lead_status,
          leadStatus: lead.lead_status,
          status: 'active',
          priority: lead.priority || 'medium',
          location: lead.location || '',
          city: lead.city || '',
          state: lead.state || '',
          country: lead.country || '',
          address: lead.address || '',
          closingDate: lead.expected_closing_date || '',
          buyerRef: lead.buyer_ref || '',
          budget: lead.budget,
          quantity: lead.quantity,
          pricePerUnit: lead.price_per_unit,
          expectedClosingDate: lead.expected_closing_date,
          nextFollowupDate: lead.next_followup_date,
          notes: lead.notes,
          // Add multiple products support
          leadProducts: lead.leadProducts || [],
          totalProducts: lead.leadProducts?.length || 0,
          calculatedBudget: lead.leadProducts?.reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0) || lead.budget || 0
        }))
        
        console.log("loadLeads - API leads:", transformedLeads)
        setLeadsList(transformedLeads)
        
        // Calculate stats
        const qualifiedLeads = transformedLeads.filter((lead: any) => 
          lead.salesStage === 'Qualified' || lead.salesStage === 'Proposal' || lead.salesStage === 'Negotiation'
        ).length
        const conversionRate = transformedLeads.length > 0 ? Math.round((qualifiedLeads / transformedLeads.length) * 100) : 0
        
        // Calculate total pipeline value from calculated budgets (multiple products support)
        const totalPipelineValue = transformedLeads.reduce((sum: number, lead: any) => {
          const budget = parseFloat(lead.calculatedBudget) || parseFloat(lead.budget) || 0
          return sum + budget
        }, 0)
        
        setLeadsStats({
          total: transformedLeads.length,
          qualified: qualifiedLeads,
          conversionRate: conversionRate,
          totalPipelineValue: totalPipelineValue
        })
        setStatsLoaded(true)
        
        return
      }
    } catch (error) {
      console.error('Error loading leads from API:', error)
      toast({
        title: "Error",
        description: "Failed to load leads from database",
        variant: "destructive"
      })
      setStatsLoaded(true)
    }
  }

  const stats = [
    {
      title: "Total Leads",
      value: !statsLoaded ? "..." : leadsStats.total.toString(),
      change: { value: "+18.6%", type: "positive" as const, period: "from last month" },
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      trend: "up" as const,
    },
    {
      title: "Qualified Leads",
      value: !statsLoaded ? "..." : leadsStats.qualified.toString(),
      change: { value: "+12.4%", type: "positive" as const, period: "from last month" },
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      trend: "up" as const,
    },
    {
      title: "Qualification Rate",
      value: !statsLoaded ? "..." : `${leadsStats.conversionRate}%`,
      change: { value: "+2.3%", type: "positive" as const, period: "improvement" },
      icon: TrendingUp,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      trend: "up" as const,
    },
    {
      title: "Total Pipeline Value",
      value: !statsLoaded ? "..." : `₹${leadsStats.totalPipelineValue.toLocaleString()}`,
      change: { value: "+15.2%", type: "positive" as const, period: "from last month" },
      icon: Coins,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
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
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        lead.leadName?.toLowerCase().includes(searchLower) ||
        lead.contactName?.toLowerCase().includes(searchLower) ||
        lead.city?.toLowerCase().includes(searchLower) ||
        lead.state?.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.phone?.includes(searchTerm)
      if (!matchesSearch) return false
    }
    
    // Stage filter
    if (selectedStage !== "All" && lead.leadStatus !== selectedStage) {
      return false
    }
    
    // Assigned to filter  
    if (selectedAssignedTo !== "All" && lead.assignedTo !== selectedAssignedTo) {
      return false
    }
    
    
    return true
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

  const handleImportData = async (importedLeads: any[]) => {
    try {
      const companyId = localStorage.getItem('currentCompanyId') || 'de19ccb7-e90d-4507-861d-a3aecf5e3f29'
      
      // Save imported leads to database instead of localStorage
      const promises = importedLeads.map(async (leadData) => {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            companyId,
            ...leadData
          })
        })
        return response.json()
      })
      
      await Promise.all(promises)
      
      // Reload leads from database
      loadLeads()
      
      toast({
        title: "Data imported",
        description: `Successfully imported ${importedLeads.length} leads to database.`
      })
    } catch (error) {
      console.error('Error importing leads:', error)
      toast({
        title: "Import failed",
        description: "Failed to import leads to database",
        variant: "destructive"
      })
    }
  }

  const handleEditLead = (lead: any) => {
    router.push(`/leads/edit/${lead.id}`)
  }

  const handleAddLead = () => {
    router.push('/leads/add')
  }

  const handleSaveLead = async (leadData: any) => {
    try {
      const companyId = localStorage.getItem('currentCompanyId') || 'de19ccb7-e90d-4507-861d-a3aecf5e3f29'
      
      const leadToSave = {
        account_id: leadData.account_id,
        account_name: leadData.account_name,
        contact_id: leadData.contact_id,
        contact_name: leadData.contact_name,
        department: leadData.department || '',
        phone: leadData.phone,
        email: leadData.email,
        whatsapp: leadData.phone || leadData.whatsapp,
        lead_source: leadData.lead_source,
        product_id: leadData.product_id,
        product_name: leadData.product_name,
        lead_status: leadData.lead_status,
        assigned_to: leadData.assigned_to,
        lead_date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        location: leadData.location || '',
        city: leadData.city,
        state: leadData.state,
        country: leadData.country,
        address: leadData.address,
        buyer_ref: leadData.buyer_ref || '',
        budget: leadData.budget,
        quantity: leadData.quantity,
        price_per_unit: leadData.price_per_unit,
        expected_closing_date: leadData.expected_closing_date,
        next_followup_date: leadData.next_followup_date,
        notes: leadData.notes,
        // Include selected products for multiple product support
        selected_products: leadData.selected_products
      }
      
      // Check if lead status is changing to "Qualified" (for deal creation)
      const wasQualified = editingLead?.leadStatus === 'Qualified' || editingLead?.salesStage === 'Qualified'
      const isNowQualified = leadData.lead_status === 'Qualified'
      const shouldCreateDeal = editingLead && !wasQualified && isNowQualified
      
      let response
      if (editingLead) {
        // Update existing lead
        response = await fetch('/api/leads', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: editingLead.id,
            companyId,
            ...leadToSave
          })
        })
      } else {
        // Create new lead
        response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            companyId,
            ...leadToSave
          })
        })
      }

      if (!response.ok) {
        throw new Error(`Failed to ${editingLead ? 'update' : 'create'} lead`)
      }

      const savedLead = await response.json()
      
      // If lead was qualified, create a deal automatically
      if (shouldCreateDeal) {
        try {
          await createDealFromLead(savedLead)
        } catch (dealError) {
          console.error('Error creating deal from qualified lead:', dealError)
          // Don't fail the lead update if deal creation fails
          toast({
            title: "Warning",
            description: "Lead updated but failed to create deal. Please create deal manually.",
            variant: "destructive"
          })
        }
      }
      
      // Transform API response to match UI format
      const transformedLead = {
        id: savedLead.id,
        date: new Date(savedLead.lead_date).toLocaleDateString('en-GB'),
        leadName: savedLead.account_name,
        accountId: savedLead.account_id,
        accountName: savedLead.account_name,
        contactId: savedLead.contact_id,
        contactName: savedLead.contact_name,
        department: savedLead.department || '',
        contactNo: savedLead.phone,
        phone: savedLead.phone,
        email: savedLead.email,
        whatsapp: savedLead.whatsapp,
        assignedTo: savedLead.assigned_to,
        product: savedLead.product_name,
        productId: savedLead.product_id,
        leadSource: savedLead.lead_source,
        salesStage: savedLead.lead_status,
        leadStatus: savedLead.lead_status,
        status: 'active',
        priority: savedLead.priority || 'medium',
        location: savedLead.location || '',
        city: savedLead.city || '',
        state: savedLead.state || '',
        country: savedLead.country || '',
        address: savedLead.address || '',
        closingDate: savedLead.expected_closing_date || '',
        buyerRef: savedLead.buyer_ref || '',
        budget: savedLead.budget,
        quantity: savedLead.quantity,
        pricePerUnit: savedLead.price_per_unit,
        expectedClosingDate: savedLead.expected_closing_date,
        nextFollowupDate: savedLead.next_followup_date,
        notes: savedLead.notes
      }
      
      if (editingLead) {
        setLeadsList(prevLeads => 
          prevLeads.map(lead => lead.id === editingLead.id ? transformedLead : lead)
        )
        
        if (shouldCreateDeal) {
          toast({
            title: "Success",
            description: "Lead qualified and deal created successfully! Check the Deals tab."
          })
        } else {
          toast({
            title: "Success",
            description: "Lead updated successfully"
          })
        }
      } else {
        setLeadsList(prevLeads => [transformedLead, ...prevLeads])
        toast({
          title: "Success",
          description: "Lead created successfully"
        })
      }
      
      // Update stats
      loadLeads()
      
      // Close modal
      setIsAddLeadModalOpen(false)
      setEditingLead(null)
      
    } catch (error) {
      console.error('Error saving lead:', error)
      toast({
        title: "Error",
        description: "Failed to save lead",
        variant: "destructive"
      })
      throw error
    }
  }

  const createDealFromLead = async (lead: any) => {
    
    // Determine primary product name for deal name
    const primaryProductName = lead.leadProducts && lead.leadProducts.length > 0 
      ? lead.leadProducts[0].product_name 
      : lead.product_name || 'Products'
    
    const dealData = {
      deal_name: `${lead.account_name} - ${primaryProductName}${lead.leadProducts && lead.leadProducts.length > 1 ? ` +${lead.leadProducts.length - 1} more` : ''}`,
      account_name: lead.account_name,
      contact_person: lead.contact_name || lead.lead_name || 'Unknown Contact',
      product: primaryProductName, // Keep for backward compatibility
      value: lead.calculatedBudget || lead.budget || 0,
      stage: 'Qualification',
      probability: 25,
      expected_close_date: lead.expected_closing_date,
      assigned_to: lead.assigned_to,
      priority: 'Medium',
      status: 'Active',
      source: lead.lead_source,
      source_lead_id: lead.id,
      last_activity: 'Created from qualified lead',
      notes: `Converted from lead: ${lead.id}. Original notes: ${lead.notes || 'None'}`,
      
      // Copy ALL lead data - contact information
      phone: lead.phone,
      email: lead.email,
      whatsapp: lead.whatsapp,
      
      // Copy lead relations
      product_id: lead.product_id,
      account_id: lead.account_id,
      contact_id: lead.contact_id,
      
      // Copy location information
      location: lead.location,
      city: lead.city,
      state: lead.state,
      department: lead.department,
      
      // Products will be fetched and added below
      selected_products: [],
      
      // Copy lead tracking and dates
      lead_date: lead.lead_date,
      closing_date: lead.closing_date,
      next_followup_date: lead.next_followup_date,
      buyer_ref: lead.buyer_ref,
      
      // Copy financial details
      budget: lead.budget,
      quantity: lead.quantity,
      price_per_unit: lead.price_per_unit
    }

    // Get REAL products from lead_products table
    try {
      console.log(`Fetching products for lead ${lead.id} (${lead.account_name})`);
      const leadProductsResponse = await fetch(`/api/leads/${lead.id}/products`);
      const leadProductsData = await leadProductsResponse.json();
      const realProducts = leadProductsData.products || [];
      
      console.log(`Lead ${lead.account_name} has ${realProducts.length} products:`, realProducts);
      
      if (realProducts.length > 0) {
        dealData.selected_products = realProducts.map((product: any) => ({
          product_id: null, // Handle invalid UUIDs
          product_name: product.product_name,
          quantity: product.quantity || 1,
          price_per_unit: product.price_per_unit || 0,
          total_amount: (product.quantity || 1) * (product.price_per_unit || 0)
        }));
      } else if (lead.product_name) {
        // Fallback to legacy single product
        dealData.selected_products = [{
          product_id: null,
          product_name: lead.product_name,
          quantity: lead.quantity || 1,
          price_per_unit: lead.price_per_unit || 0,
          total_amount: (lead.quantity || 1) * (lead.price_per_unit || 0)
        }];
      }
    } catch (error) {
      console.error('Error fetching lead products for conversion:', error);
      // Fallback to legacy approach
      if (lead.product_name) {
        dealData.selected_products = [{
          product_id: null,
          product_name: lead.product_name,
          quantity: lead.quantity || 1,
          price_per_unit: lead.price_per_unit || 0,
          total_amount: (lead.quantity || 1) * (lead.price_per_unit || 0)
        }];
      }
    }

    console.log('Final deal data with products:', dealData);

    const response = await fetch('/api/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dealData)
    })

    if (!response.ok) {
      throw new Error('Failed to create deal from lead')
    }

    return response.json()
  }

  const handleExport = async () => {
    try {
      const success = await exportToExcel(filteredLeads, {
        filename: `leads_${new Date().toISOString().split('T')[0]}`,
        sheetName: 'Leads',
        columns: [
          { key: 'id', label: 'Lead ID', width: 12 },
          { key: 'leadName', label: 'Company Name', width: 20 },
          { key: 'contactName', label: 'Contact Person', width: 18 },
          { key: 'contactNo', label: 'Contact Phone', width: 15 },
          { key: 'email', label: 'Email', width: 25 },
          { key: 'whatsapp', label: 'WhatsApp', width: 15 },
          { key: 'city', label: 'City', width: 15 },
          { key: 'state', label: 'State', width: 15 },
          { key: 'location', label: 'Location', width: 20 },
          { key: 'product', label: 'Product Interest', width: 25 },
          { key: 'salesStage', label: 'Sales Stage', width: 15 },
          { key: 'priority', label: 'Priority', width: 12 },
          { key: 'assignedTo', label: 'Assigned To', width: 15 },
          { key: 'closingDate', label: 'Closing Date', width: 15 },
          { key: 'status', label: 'Status', width: 12 },
          { key: 'date', label: 'Created Date', width: 15 }
        ]
      })
      
      if (success) {
        toast({
          title: "Export completed",
          description: "Leads data has been exported to Excel file."
        })
      } else {
        toast({
          title: "Export failed",
          description: "Failed to export leads data. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export failed",
        description: "Failed to export leads data. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600">Track and manage your sales leads effectively</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddLead}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
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
            iconColor={stat.iconColor}
            iconBg={stat.iconBg}
          />
        ))}
      </div>

      {/* Lead Search & Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lead Search & Filters</CardTitle>
          <CardDescription>Filter and search through your leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search leads by name, contact, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stages</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Disqualified">Disqualified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAssignedTo} onValueChange={setSelectedAssignedTo}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Assigned</SelectItem>
                {Array.from(new Set(leadsList.map(lead => lead.assignedTo).filter(Boolean))).map(assignedTo => (
                  <SelectItem key={assignedTo} value={assignedTo}>{assignedTo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Leads List</CardTitle>
            <CardDescription>Latest leads and their current status</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-14">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  {/* Account Details */}
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
                    {lead.department && lead.department !== "None" && (
                      <p className="text-sm font-medium text-blue-600 mb-1">Department: {lead.department}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {lead.city && lead.state ? `${lead.city}, ${lead.state}` : 
                       lead.city ? lead.city : 
                       lead.state ? lead.state : 
                       lead.location || 'Location not specified'}
                    </p>
                  </div>
                  
                  {/* Contact Details - Just beside account */}
                  <div className="ml-14">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p className="font-medium">Contact: {lead.contactName}</p>
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
                  
                  {/* Product Details - beside contact */}
                  <div className="ml-14">
                    <div className="flex items-start gap-x-14">
                      {/* Smart Products Display */}
                      <ProductsDisplay 
                        leadProducts={lead.leadProducts} 
                        totalBudget={lead.calculatedBudget} 
                      />
                      <div className="text-xs text-gray-500">
                        <p>Stage: {lead.leadStatus || lead.salesStage}</p>
                        <p>Assigned to: {lead.assignedTo}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
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

      {/* AI Intelligence Section - Real-time analysis using agentic AI */}
      <AILeadIntelligenceCard leads={leadsList} />

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

      {/* Add/Edit Lead Modal - Simplified Version */}
      <AddLeadModalSimplified
        isOpen={isAddLeadModalOpen}
        onClose={() => {
          setIsAddLeadModalOpen(false)
          setEditingLead(null)
        }}
        onSave={handleSaveLead}
        editingLead={editingLead}
      />
    </div>
  )
}
