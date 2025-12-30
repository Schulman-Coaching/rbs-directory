'use client'

import { useState } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { RBS_NEIGHBORHOODS, LANGUAGES } from '@/types'

export interface FilterValues {
  neighborhood?: string
  ageMin?: number
  ageMax?: number
  gender?: string
  instructorGender?: string
  language?: string
  priceMax?: number
}

interface FilterPanelProps {
  values: FilterValues
  onChange: (values: FilterValues) => void
  className?: string
}

const ageOptions = [
  { value: '0', label: 'כל הגילאים' },
  { value: '3', label: '3+' },
  { value: '5', label: '5+' },
  { value: '8', label: '8+' },
  { value: '10', label: '10+' },
  { value: '13', label: '13+' },
  { value: '16', label: '16+' },
]

const genderOptions = [
  { value: 'ALL', label: 'מעורב' },
  { value: 'MALE', label: 'בנים' },
  { value: 'FEMALE', label: 'בנות' },
]

const priceOptions = [
  { value: '0', label: 'כל המחירים' },
  { value: '100', label: 'עד ₪100' },
  { value: '200', label: 'עד ₪200' },
  { value: '300', label: 'עד ₪300' },
  { value: '500', label: 'עד ₪500' },
]

export function FilterPanel({ values, onChange, className }: FilterPanelProps) {
  const activeFiltersCount = Object.values(values).filter(Boolean).length

  const handleChange = (key: keyof FilterValues, value: string | undefined) => {
    const newValues: FilterValues = { ...values }
    if (value === '0' || value === 'ALL' || !value) {
      delete newValues[key]
    } else if (key === 'ageMin' || key === 'ageMax' || key === 'priceMax') {
      (newValues as Record<string, number | string | undefined>)[key] = parseInt(value)
    } else {
      (newValues as Record<string, number | string | undefined>)[key] = value
    }
    onChange(newValues)
  }

  const clearFilters = () => {
    onChange({})
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Neighborhood */}
      <div>
        <label className="text-sm font-medium mb-2 block">שכונה</label>
        <Select
          value={values.neighborhood || ''}
          onValueChange={(v) => handleChange('neighborhood', v || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="כל השכונות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">כל השכונות</SelectItem>
            {RBS_NEIGHBORHOODS.map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age */}
      <div>
        <label className="text-sm font-medium mb-2 block">גיל מינימלי</label>
        <Select
          value={values.ageMin?.toString() || '0'}
          onValueChange={(v) => handleChange('ageMin', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ageOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gender */}
      <div>
        <label className="text-sm font-medium mb-2 block">מגדר</label>
        <Select
          value={values.gender || 'ALL'}
          onValueChange={(v) => handleChange('gender', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Instructor Gender */}
      <div>
        <label className="text-sm font-medium mb-2 block">מגדר מדריך/ה</label>
        <Select
          value={values.instructorGender || 'ALL'}
          onValueChange={(v) => handleChange('instructorGender', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">לא משנה</SelectItem>
            <SelectItem value="MALE">גבר</SelectItem>
            <SelectItem value="FEMALE">אישה</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div>
        <label className="text-sm font-medium mb-2 block">שפה</label>
        <Select
          value={values.language || ''}
          onValueChange={(v) => handleChange('language', v || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="כל השפות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">כל השפות</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price */}
      <div>
        <label className="text-sm font-medium mb-2 block">מחיר מקסימלי</label>
        <Select
          value={values.priceMax?.toString() || '0'}
          onValueChange={(v) => handleChange('priceMax', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" className="w-full" onClick={clearFilters}>
            <X className="h-4 w-4 ml-2" />
            נקה סינון ({activeFiltersCount})
          </Button>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className={cn('lg:hidden', className)}>
            <Filter className="h-4 w-4 ml-2" />
            סינון
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="mr-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>סינון תוצאות</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Filter Panel */}
      <div className={cn('hidden lg:block', className)}>
        <FilterContent />
      </div>
    </>
  )
}
