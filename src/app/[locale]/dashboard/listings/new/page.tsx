'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft, ArrowRight, Save, Send, X, Plus, Minus,
  ImagePlus, Loader2, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categories } from '@/lib/mock-data/categories'
import { RBS_NEIGHBORHOODS, PriceType, Gender } from '@/types'

interface FormData {
  // Step 1: Basic Info
  title: string
  titleHe: string
  description: string
  descriptionHe: string
  categoryId: string

  // Step 2: Pricing & Details
  price: string
  priceType: PriceType
  duration: string
  maxParticipants: string

  // Step 3: Audience
  ageMin: string
  ageMax: string
  gender: Gender
  instructorGender: Gender
  languages: string[]

  // Step 4: Location & Contact
  location: string
  neighborhood: string
  isOnline: boolean
  phone: string
  email: string
  website: string

  // Step 5: Media & Extras
  imageUrl: string
  subsidies: string[]
  tags: string[]
}

const initialFormData: FormData = {
  title: '',
  titleHe: '',
  description: '',
  descriptionHe: '',
  categoryId: '',
  price: '',
  priceType: 'MONTHLY',
  duration: '',
  maxParticipants: '',
  ageMin: '',
  ageMax: '',
  gender: 'ALL',
  instructorGender: 'ALL',
  languages: ['he'],
  location: '',
  neighborhood: '',
  isOnline: false,
  phone: '',
  email: '',
  website: '',
  imageUrl: '',
  subsidies: [],
  tags: [],
}

const STEPS = [
  { id: 1, name: 'Basic Info', nameHe: 'פרטים בסיסיים' },
  { id: 2, name: 'Pricing', nameHe: 'מחיר ופרטים' },
  { id: 3, name: 'Audience', nameHe: 'קהל יעד' },
  { id: 4, name: 'Location', nameHe: 'מיקום וקשר' },
  { id: 5, name: 'Review', nameHe: 'סקירה' },
]

const PRICE_TYPES: { value: PriceType; label: string }[] = [
  { value: 'FREE', label: 'חינם' },
  { value: 'FIXED', label: 'מחיר קבוע' },
  { value: 'HOURLY', label: 'לשעה' },
  { value: 'PER_SESSION', label: 'לשיעור' },
  { value: 'MONTHLY', label: 'חודשי' },
  { value: 'CONTACT', label: 'ליצירת קשר' },
]

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'ALL', label: 'לכולם' },
  { value: 'MALE', label: 'בנים / גברים' },
  { value: 'FEMALE', label: 'בנות / נשים' },
]

const LANGUAGE_OPTIONS = [
  { value: 'he', label: 'עברית' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ru', label: 'Русский' },
  { value: 'es', label: 'Español' },
]

const SUBSIDY_OPTIONS = ['מאוחדת', 'כללית', 'מכבי', 'לאומית']

export default function NewListingPage() {
  const router = useRouter()
  const t = useTranslations('dashboard')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (stepNum) {
      case 1:
        if (!formData.title && !formData.titleHe) {
          newErrors.title = 'נדרש שם באנגלית או בעברית'
        }
        if (!formData.description && !formData.descriptionHe) {
          newErrors.description = 'נדרש תיאור באנגלית או בעברית'
        }
        if (!formData.categoryId) {
          newErrors.categoryId = 'נדרשת קטגוריה'
        }
        break
      case 2:
        if (formData.priceType !== 'FREE' && formData.priceType !== 'CONTACT') {
          if (!formData.price || isNaN(Number(formData.price))) {
            newErrors.price = 'נדרש מחיר תקין'
          }
        }
        break
      case 3:
        if (formData.ageMin && formData.ageMax) {
          if (Number(formData.ageMin) > Number(formData.ageMax)) {
            newErrors.ageMin = 'גיל מינימום לא יכול להיות גדול מגיל מקסימום'
          }
        }
        break
      case 4:
        if (!formData.location && !formData.isOnline) {
          newErrors.location = 'נדרש מיקום או סימון פעילות אונליין'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateField('tags', [...formData.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    updateField('tags', formData.tags.filter((t) => t !== tag))
  }

  const toggleLanguage = (lang: string) => {
    if (formData.languages.includes(lang)) {
      if (formData.languages.length > 1) {
        updateField('languages', formData.languages.filter((l) => l !== lang))
      }
    } else {
      updateField('languages', [...formData.languages, lang])
    }
  }

  const toggleSubsidy = (subsidy: string) => {
    if (formData.subsidies.includes(subsidy)) {
      updateField('subsidies', formData.subsidies.filter((s) => s !== subsidy))
    } else {
      updateField('subsidies', [...formData.subsidies, subsidy])
    }
  }

  const handleSubmit = async (asDraft: boolean = false) => {
    if (!asDraft && !validateStep(step)) return

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        duration: formData.duration ? Number(formData.duration) : undefined,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
        ageMin: formData.ageMin ? Number(formData.ageMin) : undefined,
        ageMax: formData.ageMax ? Number(formData.ageMax) : undefined,
        sourceType: 'MANUAL',
        autoApprove: false,
        providerId: 'current-provider', // Would come from session
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        router.push('/dashboard/listings')
      } else {
        setErrors({ submit: result.error || 'שגיאה בשמירת השירות' })
      }
    } catch (error) {
      setErrors({ submit: 'שגיאה בשמירת השירות' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryName = (id: string) => {
    const findCategory = (cats: typeof categories): string | undefined => {
      for (const cat of cats) {
        if (cat.id === id) return cat.nameHe
        if (cat.children) {
          const found = findCategory(cat.children as typeof categories)
          if (found) return found
        }
      }
      return undefined
    }
    return findCategory(categories) || id
  }

  // Flatten categories for select
  const flatCategories = categories.flatMap((cat) => [
    { id: cat.id, name: cat.nameHe, isParent: true },
    ...(cat.children || []).map((child) => ({
      id: child.id,
      name: `  └ ${child.nameHe}`,
      isParent: false,
    })),
  ])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">הוספת שירות חדש</h1>
          <p className="text-muted-foreground">מלא את הפרטים להוספת שירות לספרייה</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/listings">
            <X className="h-4 w-4 ml-2" />
            ביטול
          </Link>
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, index) => (
            <div
              key={s.id}
              className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step > s.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : step === s.id
                    ? 'border-primary text-primary'
                    : 'border-muted text-muted-foreground'
                }`}
              >
                {step > s.id ? <CheckCircle className="h-5 w-5" /> : s.id}
              </div>
              <span
                className={`mr-2 text-sm hidden md:block ${
                  step >= s.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {s.nameHe}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 ${
                    step > s.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step - 1].nameHe}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="titleHe">שם השירות (עברית) *</Label>
                  <Input
                    id="titleHe"
                    value={formData.titleHe}
                    onChange={(e) => updateField('titleHe', e.target.value)}
                    placeholder="לדוגמה: חוג כדורגל לילדים"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Service Name (English)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. Kids Soccer Class"
                    dir="ltr"
                  />
                </div>
              </div>
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="descriptionHe">תיאור (עברית) *</Label>
                  <Textarea
                    id="descriptionHe"
                    value={formData.descriptionHe}
                    onChange={(e) => updateField('descriptionHe', e.target.value)}
                    placeholder="תאר את השירות..."
                    rows={4}
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (English)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe the service..."
                    rows={4}
                    dir="ltr"
                  />
                </div>
              </div>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="categoryId">קטגוריה *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => updateField('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {flatCategories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className={cat.isParent ? 'font-semibold' : ''}
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId}</p>
                )}
              </div>
            </>
          )}

          {/* Step 2: Pricing & Details */}
          {step === 2 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priceType">סוג מחיר</Label>
                  <Select
                    value={formData.priceType}
                    onValueChange={(value) => updateField('priceType', value as PriceType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_TYPES.map((pt) => (
                        <SelectItem key={pt.value} value={pt.value}>
                          {pt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">מחיר (₪)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="0"
                    disabled={
                      formData.priceType === 'FREE' || formData.priceType === 'CONTACT'
                    }
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">משך (דקות)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => updateField('duration', e.target.value)}
                    placeholder="לדוגמה: 60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">מספר משתתפים מקסימלי</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => updateField('maxParticipants', e.target.value)}
                    placeholder="לדוגמה: 20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>קופות חולים (סובסידיה)</Label>
                <div className="flex flex-wrap gap-2">
                  {SUBSIDY_OPTIONS.map((subsidy) => (
                    <Badge
                      key={subsidy}
                      variant={formData.subsidies.includes(subsidy) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSubsidy(subsidy)}
                    >
                      {subsidy}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 3: Audience */}
          {step === 3 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ageMin">גיל מינימום</Label>
                  <Input
                    id="ageMin"
                    type="number"
                    value={formData.ageMin}
                    onChange={(e) => updateField('ageMin', e.target.value)}
                    placeholder="לדוגמה: 6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ageMax">גיל מקסימום</Label>
                  <Input
                    id="ageMax"
                    type="number"
                    value={formData.ageMax}
                    onChange={(e) => updateField('ageMax', e.target.value)}
                    placeholder="לדוגמה: 12"
                  />
                </div>
              </div>
              {errors.ageMin && <p className="text-sm text-destructive">{errors.ageMin}</p>}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>מיועד ל</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateField('gender', value as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>מגדר מדריך/ה</Label>
                  <Select
                    value={formData.instructorGender}
                    onValueChange={(value) => updateField('instructorGender', value as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>שפות</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <Badge
                      key={lang.value}
                      variant={formData.languages.includes(lang.value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleLanguage(lang.value)}
                    >
                      {lang.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Location & Contact */}
          {step === 4 && (
            <>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="isOnline"
                  checked={formData.isOnline}
                  onCheckedChange={(checked) => updateField('isOnline', checked)}
                />
                <Label htmlFor="isOnline">פעילות אונליין / מרחוק</Label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">כתובת</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="לדוגמה: רחוב נחל לכיש 5"
                    disabled={formData.isOnline}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">שכונה</Label>
                  <Select
                    value={formData.neighborhood}
                    onValueChange={(value) => updateField('neighborhood', value)}
                    disabled={formData.isOnline}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר שכונה" />
                    </SelectTrigger>
                    <SelectContent>
                      {RBS_NEIGHBORHOODS.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="050-123-4567"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">אתר</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://..."
                    dir="ltr"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">פרטים בסיסיים</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">שם (עברית):</dt>
                        <dd>{formData.titleHe || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">שם (אנגלית):</dt>
                        <dd>{formData.title || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">קטגוריה:</dt>
                        <dd>{getCategoryName(formData.categoryId)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">מחיר ופרטים</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">סוג מחיר:</dt>
                        <dd>
                          {PRICE_TYPES.find((p) => p.value === formData.priceType)?.label}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">מחיר:</dt>
                        <dd>{formData.price ? `₪${formData.price}` : '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">משך:</dt>
                        <dd>{formData.duration ? `${formData.duration} דקות` : '-'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">קהל יעד</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">גילאים:</dt>
                        <dd>
                          {formData.ageMin || formData.ageMax
                            ? `${formData.ageMin || '?'} - ${formData.ageMax || '?'}`
                            : 'לא צוין'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">מיועד ל:</dt>
                        <dd>{GENDERS.find((g) => g.value === formData.gender)?.label}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">שפות:</dt>
                        <dd>
                          {formData.languages
                            .map((l) => LANGUAGE_OPTIONS.find((lo) => lo.value === l)?.label)
                            .join(', ')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">מיקום</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">אונליין:</dt>
                        <dd>{formData.isOnline ? 'כן' : 'לא'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">כתובת:</dt>
                        <dd>{formData.location || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">שכונה:</dt>
                        <dd>{formData.neighborhood || '-'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {formData.subsidies.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">קופות חולים</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.subsidies.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>שים לב:</strong> לאחר השליחה, השירות יישלח לאישור צוות המערכת ויופיע
                בספרייה לאחר אישור.
              </div>

              {errors.submit && (
                <p className="text-sm text-destructive text-center">{errors.submit}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={prevStep} disabled={step === 1}>
          <ArrowRight className="h-4 w-4 ml-2" />
          הקודם
        </Button>

        <div className="flex gap-2">
          {step < STEPS.length ? (
            <Button onClick={nextStep}>
              הבא
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 ml-2" />
                שמור כטיוטה
              </Button>
              <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 ml-2" />
                )}
                שלח לאישור
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
