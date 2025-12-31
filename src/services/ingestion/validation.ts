/**
 * Validation Service for Listing Ingestion
 * Validates incoming listing data from various sources
 */

import { categories } from '@/lib/mock-data/categories'
import { RBS_NEIGHBORHOODS, PriceType, Gender, ListingStatus } from '@/types'

// Validation error types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationWarning {
  field: string
  message: string
  code: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// Input type for listing validation
export interface ListingInput {
  title?: string
  titleHe?: string
  description?: string
  descriptionHe?: string
  categoryId?: string
  categoryName?: string // For fuzzy matching
  providerId?: string
  providerName?: string // For matching
  price?: number | string
  priceType?: string
  phone?: string
  email?: string
  website?: string
  location?: string
  neighborhood?: string
  ageMin?: number | string
  ageMax?: number | string
  gender?: string
  instructorGender?: string
  language?: string | string[]
  maxParticipants?: number | string
  duration?: number | string
  isOnline?: boolean | string
  subsidies?: string | string[]
  [key: string]: unknown
}

// Phone number validation (Israeli formats)
const ISRAELI_PHONE_REGEX = /^(?:\+972|972|0)(?:5[0-9]|[2-4]|[7-9])[0-9]{7}$/

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Website validation
const WEBSITE_REGEX = /^(https?:\/\/)?(www\.)?[\w-]+\.[\w.-]+\/?.*$/i

// Valid price types
const VALID_PRICE_TYPES: PriceType[] = ['FIXED', 'HOURLY', 'PER_SESSION', 'MONTHLY', 'CONTACT', 'FREE']

// Valid genders
const VALID_GENDERS: Gender[] = ['MALE', 'FEMALE', 'ALL']

// Valid statuses
const VALID_STATUSES: ListingStatus[] = ['DRAFT', 'PENDING', 'ACTIVE', 'ARCHIVED', 'REJECTED']

/**
 * Validates a listing input from any source
 */
export function validateListing(input: ListingInput): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Required fields
  if (!input.title && !input.titleHe) {
    errors.push({
      field: 'title',
      message: 'Title is required (English or Hebrew)',
      code: 'REQUIRED_TITLE'
    })
  }

  if (!input.description && !input.descriptionHe) {
    errors.push({
      field: 'description',
      message: 'Description is required (English or Hebrew)',
      code: 'REQUIRED_DESCRIPTION'
    })
  }

  if (!input.categoryId && !input.categoryName) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      code: 'REQUIRED_CATEGORY'
    })
  }

  if (!input.providerId && !input.providerName) {
    errors.push({
      field: 'provider',
      message: 'Provider is required',
      code: 'REQUIRED_PROVIDER'
    })
  }

  // Validate category exists
  if (input.categoryId) {
    const categoryExists = categories.some(c => c.id === input.categoryId)
    if (!categoryExists) {
      errors.push({
        field: 'categoryId',
        message: `Category with ID "${input.categoryId}" not found`,
        code: 'INVALID_CATEGORY'
      })
    }
  }

  // Validate price
  if (input.price !== undefined && input.price !== null && input.price !== '') {
    const price = typeof input.price === 'string' ? parseFloat(input.price) : input.price
    if (isNaN(price)) {
      errors.push({
        field: 'price',
        message: 'Price must be a valid number',
        code: 'INVALID_PRICE'
      })
    } else if (price < 0) {
      errors.push({
        field: 'price',
        message: 'Price cannot be negative',
        code: 'NEGATIVE_PRICE'
      })
    } else if (price > 100000) {
      warnings.push({
        field: 'price',
        message: 'Price seems unusually high. Please verify.',
        code: 'HIGH_PRICE'
      })
    }
  }

  // Validate price type
  if (input.priceType) {
    const normalizedPriceType = input.priceType.toUpperCase() as PriceType
    if (!VALID_PRICE_TYPES.includes(normalizedPriceType)) {
      errors.push({
        field: 'priceType',
        message: `Invalid price type. Must be one of: ${VALID_PRICE_TYPES.join(', ')}`,
        code: 'INVALID_PRICE_TYPE'
      })
    }
  }

  // Validate phone number
  if (input.phone) {
    const cleanPhone = input.phone.replace(/[\s\-\(\)]/g, '')
    if (!ISRAELI_PHONE_REGEX.test(cleanPhone)) {
      warnings.push({
        field: 'phone',
        message: 'Phone number may not be in valid Israeli format',
        code: 'INVALID_PHONE_FORMAT'
      })
    }
  }

  // Validate email
  if (input.email && !EMAIL_REGEX.test(input.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
      code: 'INVALID_EMAIL'
    })
  }

  // Validate website
  if (input.website && !WEBSITE_REGEX.test(input.website)) {
    warnings.push({
      field: 'website',
      message: 'Website URL may not be valid',
      code: 'INVALID_WEBSITE'
    })
  }

  // Validate neighborhood
  if (input.neighborhood) {
    const neighborhoodExists = RBS_NEIGHBORHOODS.some(
      n => n === input.neighborhood || n.includes(input.neighborhood!) || input.neighborhood!.includes(n)
    )
    if (!neighborhoodExists) {
      warnings.push({
        field: 'neighborhood',
        message: `Neighborhood "${input.neighborhood}" may not be recognized`,
        code: 'UNKNOWN_NEIGHBORHOOD'
      })
    }
  }

  // Validate age range
  if (input.ageMin !== undefined || input.ageMax !== undefined) {
    const ageMin = typeof input.ageMin === 'string' ? parseInt(input.ageMin) : input.ageMin
    const ageMax = typeof input.ageMax === 'string' ? parseInt(input.ageMax) : input.ageMax

    if (ageMin !== undefined && (isNaN(ageMin as number) || (ageMin as number) < 0)) {
      errors.push({
        field: 'ageMin',
        message: 'Minimum age must be a valid positive number',
        code: 'INVALID_AGE_MIN'
      })
    }

    if (ageMax !== undefined && (isNaN(ageMax as number) || (ageMax as number) < 0)) {
      errors.push({
        field: 'ageMax',
        message: 'Maximum age must be a valid positive number',
        code: 'INVALID_AGE_MAX'
      })
    }

    if (ageMin !== undefined && ageMax !== undefined && (ageMin as number) > (ageMax as number)) {
      errors.push({
        field: 'ageRange',
        message: 'Minimum age cannot be greater than maximum age',
        code: 'INVALID_AGE_RANGE'
      })
    }
  }

  // Validate gender
  if (input.gender) {
    const normalizedGender = input.gender.toUpperCase() as Gender
    if (!VALID_GENDERS.includes(normalizedGender)) {
      errors.push({
        field: 'gender',
        message: `Invalid gender. Must be one of: ${VALID_GENDERS.join(', ')}`,
        code: 'INVALID_GENDER'
      })
    }
  }

  // Validate instructor gender
  if (input.instructorGender) {
    const normalizedGender = input.instructorGender.toUpperCase() as Gender
    if (!VALID_GENDERS.includes(normalizedGender)) {
      errors.push({
        field: 'instructorGender',
        message: `Invalid instructor gender. Must be one of: ${VALID_GENDERS.join(', ')}`,
        code: 'INVALID_INSTRUCTOR_GENDER'
      })
    }
  }

  // Validate max participants
  if (input.maxParticipants !== undefined) {
    const maxParticipants = typeof input.maxParticipants === 'string'
      ? parseInt(input.maxParticipants)
      : input.maxParticipants

    if (isNaN(maxParticipants as number) || (maxParticipants as number) < 1) {
      errors.push({
        field: 'maxParticipants',
        message: 'Max participants must be at least 1',
        code: 'INVALID_MAX_PARTICIPANTS'
      })
    }
  }

  // Validate duration
  if (input.duration !== undefined) {
    const duration = typeof input.duration === 'string'
      ? parseInt(input.duration)
      : input.duration

    if (isNaN(duration as number) || (duration as number) < 1) {
      errors.push({
        field: 'duration',
        message: 'Duration must be at least 1 minute',
        code: 'INVALID_DURATION'
      })
    }
  }

  // Bilingual content warnings
  if (input.title && !input.titleHe) {
    warnings.push({
      field: 'titleHe',
      message: 'Hebrew title is missing - recommended for better local visibility',
      code: 'MISSING_HEBREW_TITLE'
    })
  }

  if (input.titleHe && !input.title) {
    warnings.push({
      field: 'title',
      message: 'English title is missing - recommended for broader reach',
      code: 'MISSING_ENGLISH_TITLE'
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validates a batch of listings
 */
export function validateListingBatch(inputs: ListingInput[]): {
  valid: { input: ListingInput; index: number }[]
  invalid: { input: ListingInput; index: number; result: ValidationResult }[]
  totalErrors: number
  totalWarnings: number
} {
  const valid: { input: ListingInput; index: number }[] = []
  const invalid: { input: ListingInput; index: number; result: ValidationResult }[] = []
  let totalErrors = 0
  let totalWarnings = 0

  inputs.forEach((input, index) => {
    const result = validateListing(input)
    totalErrors += result.errors.length
    totalWarnings += result.warnings.length

    if (result.isValid) {
      valid.push({ input, index })
    } else {
      invalid.push({ input, index, result })
    }
  })

  return { valid, invalid, totalErrors, totalWarnings }
}

/**
 * Check for potential duplicate listings
 */
export function checkForDuplicates(
  newListing: ListingInput,
  existingListings: { title: string; titleHe?: string; providerId: string }[]
): { isDuplicate: boolean; confidence: number; matches: string[] } {
  const matches: string[] = []
  let maxConfidence = 0

  for (const existing of existingListings) {
    let confidence = 0

    // Title similarity check (simple containment for now)
    if (newListing.title && existing.title) {
      const newTitle = newListing.title.toLowerCase().trim()
      const existingTitle = existing.title.toLowerCase().trim()

      if (newTitle === existingTitle) {
        confidence += 0.5
      } else if (newTitle.includes(existingTitle) || existingTitle.includes(newTitle)) {
        confidence += 0.3
      }
    }

    // Hebrew title similarity
    if (newListing.titleHe && existing.titleHe) {
      if (newListing.titleHe === existing.titleHe) {
        confidence += 0.5
      } else if (newListing.titleHe.includes(existing.titleHe) || existing.titleHe.includes(newListing.titleHe)) {
        confidence += 0.3
      }
    }

    // Same provider increases confidence
    if (newListing.providerId === existing.providerId) {
      confidence += 0.3
    }

    if (confidence > maxConfidence) {
      maxConfidence = confidence
    }

    if (confidence > 0.5) {
      matches.push(existing.title)
    }
  }

  return {
    isDuplicate: maxConfidence >= 0.7,
    confidence: maxConfidence,
    matches
  }
}
