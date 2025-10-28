"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  UserPlus,
  ArrowRight
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DynamicLeadField } from "./dynamic-lead-field"

interface FieldConfig {
  id: string
  field_name: string
  field_label: string
  field_type: string
  is_mandatory: boolean
  is_enabled: boolean
  field_section: string
  display_order: number
  field_options?: string[]
  placeholder?: string
  validation_rules?: any
  help_text?: string
}

const SECTION_LABELS: Record<string, string> = {
  basic_info: 'Basic Information',
  lead_details: 'Lead Details',
  contact_info: 'Contact Information',
  additional_info: 'Additional Information'
}

// Define section display order
const SECTION_ORDER = [
  'basic_info',
  'lead_details',
  'contact_info',
  'additional_info'
]

interface DynamicEditLeadContentProps {
  leadId: string
}

export function DynamicEditLeadContent({ leadId }: DynamicEditLeadContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showReview, setShowReview] = useState(false)
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [leadData, setLeadData] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const parsedUser = JSON.parse(user)
      setCurrentUser(parsedUser)
      loadFieldConfigurations(parsedUser.company_id)
      loadLeadData(leadId)
    }
  }, [leadId])

  const loadLeadData = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`)
      if (response.ok) {
        const data = await response.json()
        setLeadData(data)
        // Form data will be populated after field configs are loaded
      } else {
        toast({
          title: "Error",
          description: "Failed to load lead data",
          variant: "destructive"
        })
        router.push('/leads')
      }
    } catch (error) {
      console.error('Error loading lead:', error)
      toast({
        title: "Error",
        description: "Failed to load lead data",
        variant: "destructive"
      })
      router.push('/leads')
    }
  }

  const loadFieldConfigurations = async (companyId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/lead-fields?companyId=${companyId}`)
      if (response.ok) {
        const data: FieldConfig[] = await response.json()
        setFieldConfigs(data)

        // Initialize form data with lead values if available
        if (leadData) {
          const initialData: Record<string, any> = {}
          data
            .filter(f => f.is_enabled && f.field_name !== 'lead_id')
            .forEach(field => {
              initialData[field.field_name] = leadData[field.field_name] || ''
            })
          setFormData(initialData)
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load form configuration",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error loading field configs:', error)
      toast({
        title: "Error",
        description: "Failed to load form configuration",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Update form data when lead data is loaded
  useEffect(() => {
    if (leadData && fieldConfigs.length > 0) {
      const initializeFormData = async () => {
        const initialData: Record<string, any> = {}

        // First, populate all basic fields from lead data
        fieldConfigs
          .filter(f => f.is_enabled && f.field_name !== 'lead_id')
          .forEach(field => {
            initialData[field.field_name] = leadData[field.field_name] || ''
          })

        // Ensure account_id and contact are properly set from lead data
        const accountId = leadData.account_id || leadData.account
        const contactId = leadData.contact_id || leadData.contact

        if (accountId) {
          initialData.account_id = accountId
          initialData.account = accountId
        }

        if (contactId) {
          initialData.contact_id = contactId
          initialData.contact = contactId
        }

        // If there's a contact_id, fetch contact details to populate contact-related fields
        if (contactId) {
          try {
            const companyId = currentUser?.company_id
            const response = await fetch(`/api/contacts?companyId=${companyId}`)
            if (response.ok) {
              const contactsData = await response.json()
              const contacts = contactsData.contacts || contactsData || []
              const contact = contacts.find((c: any) => c.id === contactId)

              if (contact) {
                // Populate contact fields if they exist in field configs
                if (fieldConfigs.some(f => f.field_name === 'first_name' && f.is_enabled)) {
                  initialData.first_name = contact.first_name || leadData.first_name || ''
                }
                if (fieldConfigs.some(f => f.field_name === 'last_name' && f.is_enabled)) {
                  initialData.last_name = contact.last_name || leadData.last_name || ''
                }
                if (fieldConfigs.some(f => f.field_name === 'phone_number' && f.is_enabled)) {
                  initialData.phone_number = contact.phone_mobile || contact.phone_work || leadData.phone_number || leadData.phone || ''
                }
                if (fieldConfigs.some(f => f.field_name === 'email_address' && f.is_enabled)) {
                  initialData.email_address = contact.email_primary || leadData.email_address || leadData.email || ''
                }
                if (fieldConfigs.some(f => f.field_name === 'department' && f.is_enabled)) {
                  initialData.department = contact.department || leadData.department || ''
                }
              }
            }
          } catch (error) {
            console.error('Error fetching contact details:', error)
          }
        }

        console.log('Initialized form data:', initialData)
        setFormData(initialData)
      }

      initializeFormData()
    }
  }, [leadData, fieldConfigs, currentUser])

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    // Clear error when field is updated
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleAccountSelect = (accountData: any) => {
    // Auto-populate account-related fields if they exist
    setFormData(prev => ({
      ...prev,
      account_id: accountData.id
    }))
  }

  const handleContactSelect = (contactData: any) => {
    // Auto-populate contact-related fields
    setFormData(prev => {
      const updates: Record<string, any> = {}

      // Populate first_name if field exists
      if (contactData.first_name && fieldConfigs.some(f => f.field_name === 'first_name' && f.is_enabled)) {
        updates.first_name = contactData.first_name
      }

      // Populate last_name if field exists
      if (contactData.last_name && fieldConfigs.some(f => f.field_name === 'last_name' && f.is_enabled)) {
        updates.last_name = contactData.last_name
      }

      // Populate phone_number if field exists
      if (contactData.phone_number && fieldConfigs.some(f => f.field_name === 'phone_number' && f.is_enabled)) {
        updates.phone_number = contactData.phone_number
      }

      // Populate email_address if field exists
      if (contactData.email && fieldConfigs.some(f => f.field_name === 'email_address' && f.is_enabled)) {
        updates.email_address = contactData.email
      }

      return {
        ...prev,
        ...updates
      }
    })

    // Clear errors for auto-populated fields
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.first_name
      delete newErrors.last_name
      delete newErrors.phone_number
      delete newErrors.email_address
      return newErrors
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    fieldConfigs
      .filter(f => f.is_enabled && f.is_mandatory && f.field_name !== 'lead_id')
      .forEach(field => {
        const value = formData[field.field_name]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.field_name] = `${field.field_label} is required`
        }
      })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReview = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      // Scroll to first error
      const firstError = Object.keys(errors)[0]
      if (firstError) {
        document.getElementById(`field-${firstError}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setShowReview(true)
  }

  const handleSave = async () => {
    if (!currentUser?.company_id || !currentUser?.id) {
      toast({
        title: "Error",
        description: "User information not found",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          companyId: currentUser.company_id,
          ...formData
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Lead updated successfully"
        })
        router.push("/leads")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update lead",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getSectionFields = (section: string) => {
    return fieldConfigs
      .filter(f => f.field_section === section && f.is_enabled && f.field_name !== 'lead_id')
      .sort((a, b) => a.display_order - b.display_order)
  }

  const getEnabledSections = () => {
    const sections = Array.from(
      new Set(
        fieldConfigs
          .filter(f => f.is_enabled && f.field_name !== 'lead_id')
          .map(f => f.field_section)
      )
    )
    // Sort sections according to SECTION_ORDER
    return sections.sort((a, b) => {
      const indexA = SECTION_ORDER.indexOf(a)
      const indexB = SECTION_ORDER.indexOf(b)
      return indexA - indexB
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  const enabledSections = getEnabledSections()
  const totalFields = fieldConfigs.filter(f => f.is_enabled && f.field_name !== 'lead_id').length
  const filledFields = Object.keys(formData).filter(key => formData[key] && formData[key] !== '').length
  const progressPercentage = totalFields > 0 ? (filledFields / totalFields) * 100 : 0

  // Review page
  if (showReview) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <CheckCircle2 className="w-7 h-7 mr-3 text-green-600" />
                Review Lead Changes
              </h1>
              <p className="text-gray-600 mt-1">Please verify all changes before updating the lead</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Step 2 of 2
            </Badge>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-6 pr-4">
              {/* Summary Card */}
              {formData.contact_name && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <UserPlus className="w-8 h-8 text-blue-600" />
                      <div>
                        <h2 className="text-2xl font-bold text-blue-900">{formData.contact_name}</h2>
                        <p className="text-sm text-blue-700">
                          {formData.account_name || 'No company'} • {formData.lead_status || 'New'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review all sections */}
              {enabledSections.map(section => {
                const sectionFields = getSectionFields(section)
                const filledSectionFields = sectionFields.filter(f => formData[f.field_name])

                if (filledSectionFields.length === 0) return null

                return (
                  <Card key={section}>
                    <CardHeader>
                      <CardTitle className="text-lg">{SECTION_LABELS[section] || section}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sectionFields.map(field => {
                          const value = formData[field.field_name]
                          if (!value) return null

                          return (
                            <div key={field.id} className={field.field_type === 'textarea' ? 'md:col-span-2' : ''}>
                              <p className="text-sm font-medium text-gray-600">{field.field_label}</p>
                              <p className="text-gray-900 mt-1">
                                {value || '-'}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowReview(false)}
              disabled={saving}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <Button
              onClick={() => handleSave()}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Updating...' : 'Update Lead'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Form page - All fields on single page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/leads")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
              <p className="text-gray-600">Update the lead details below</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            Step 1 of 2
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {filledFields} of {totalFields} fields filled
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-6 pr-4">
            {/* Render all sections on one page */}
            {enabledSections.map(section => {
              const sectionFields = getSectionFields(section)
              if (sectionFields.length === 0) return null

              return (
                <Card key={section}>
                  <CardHeader>
                    <CardTitle>{SECTION_LABELS[section] || section}</CardTitle>
                    <CardDescription>
                      {sectionFields.filter(f => f.is_mandatory).length > 0 && (
                        <span className="text-red-600">* Required fields</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sectionFields.map(field => (
                        <div
                          key={field.id}
                          id={`field-${field.field_name}`}
                          className={field.field_type === 'textarea' ? 'md:col-span-2' : ''}
                        >
                          <DynamicLeadField
                            config={field}
                            value={formData[field.field_name]}
                            onChange={handleFieldChange}
                            error={errors[field.field_name]}
                            dependentValues={formData}
                            onAccountSelect={handleAccountSelect}
                            onContactSelect={handleContactSelect}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => router.push("/leads")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleReview}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue to Review
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
