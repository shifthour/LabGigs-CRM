"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FieldConfig {
  field_name: string
  field_label: string
  field_type: string
  is_mandatory: boolean
  is_enabled: boolean
  field_options?: string[]
  placeholder?: string
  validation_rules?: any
  help_text?: string
}

interface DynamicFieldProps {
  config: FieldConfig
  value: any
  onChange: (fieldName: string, value: any) => void
  error?: string
  // For dependent dropdowns like subindustry
  dependentValues?: Record<string, any>
}

export function DynamicAccountField({
  config,
  value,
  onChange,
  error,
  dependentValues = {}
}: DynamicFieldProps) {
  const [subIndustries, setSubIndustries] = useState<string[]>([])
  const [loadingSubIndustries, setLoadingSubIndustries] = useState(false)

  // Load sub-industries when industry changes
  useEffect(() => {
    if (config.field_name === 'acct_sub_industry' && dependentValues.acct_industry) {
      loadSubIndustries(dependentValues.acct_industry)
    }
  }, [dependentValues.acct_industry, config.field_name])

  const loadSubIndustries = async (industry: string) => {
    setLoadingSubIndustries(true)
    try {
      const response = await fetch(`/api/industries?industry=${encodeURIComponent(industry)}`)
      if (response.ok) {
        const data = await response.json()
        setSubIndustries(data)
      }
    } catch (error) {
      console.error('Error loading sub-industries:', error)
    } finally {
      setLoadingSubIndustries(false)
    }
  }

  const handleChange = (newValue: any) => {
    onChange(config.field_name, newValue)
  }

  const getOptions = () => {
    // For dependent sub-industry dropdown
    if (config.field_name === 'acct_sub_industry') {
      return subIndustries
    }
    // For regular select fields
    return config.field_options || []
  }

  const renderField = () => {
    switch (config.field_type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            id={config.field_name}
            type={config.field_type}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        )

      case 'number':
        return (
          <Input
            id={config.field_name}
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={config.field_name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            className={error ? 'border-red-500' : ''}
            rows={3}
          />
        )

      case 'date':
        return (
          <Input
            id={config.field_name}
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        )

      case 'select':
      case 'select_dependent':
        const options = getOptions()
        const isDisabled = config.field_name === 'acct_sub_industry' && !dependentValues.acct_industry

        return (
          <Select
            value={value || ''}
            onValueChange={handleChange}
            disabled={isDisabled || loadingSubIndustries}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue
                placeholder={
                  loadingSubIndustries
                    ? 'Loading...'
                    : isDisabled
                    ? 'Select industry first'
                    : config.placeholder || `Select ${config.field_label.toLowerCase()}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={`${config.field_name}-${index}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            id={config.field_name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        )
    }
  }

  if (!config.is_enabled) {
    return null
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={config.field_name}>
        {config.field_label}
        {config.is_mandatory && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {config.help_text && (
        <p className="text-xs text-gray-500">{config.help_text}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
