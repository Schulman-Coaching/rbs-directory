/**
 * Normalization Service for Listing Ingestion
 * Normalizes and cleans data from various import sources
 */

import { categories } from '@/lib/mock-data/categories'
import { RBS_NEIGHBORHOODS, PriceType, Gender, Listing } from '@/types'
import { ListingInput } from './validation'

// Neighborhood aliases for fuzzy matching
const NEIGHBORHOOD_ALIASES: Record<string, string> = {
  // RBS Aleph variations
  'rbs a': 'רמת בית שמש א',
  'rbs aleph': 'רמת בית שמש א',
  'ramat beit shemesh a': 'רמת בית שמש א',
  'ramat beit shemesh aleph': 'רמת בית שמש א',
  "רמב\"ש א": 'רמת בית שמש א',
  'רמב״ש א': 'רמת בית שמש א',
  "רמב'ש א": 'רמת בית שמש א',

  // RBS Bet variations
  'rbs b': 'רמת בית שמש ב',
  'rbs bet': 'רמת בית שמש ב',
  'ramat beit shemesh b': 'רמת בית שמש ב',
  'ramat beit shemesh bet': 'רמת בית שמש ב',
  "רמב\"ש ב": 'רמת בית שמש ב',
  'רמב״ש ב': 'רמת בית שמש ב',

  // RBS Gimmel variations
  'rbs g': 'רמת בית שמש ג',
  'rbs gimmel': 'רמת בית שמש ג',
  'rbs gimel': 'רמת בית שמש ג',
  'ramat beit shemesh g': 'רמת בית שמש ג',
  "רמב\"ש ג": 'רמת בית שמש ג',
  'רמב״ש ג': 'רמת בית שמש ג',

  // RBS Dalet variations
  'rbs d': 'רמת בית שמש ד',
  'rbs dalet': 'רמת בית שמש ד',
  'ramat beit shemesh d': 'רמת בית שמש ד',
  "רמב\"ש ד": 'רמת בית שמש ד',
  'רמב״ש ד': 'רמת בית שמש ד',

  // RBS Hey variations
  'rbs h': 'רמת בית שמש ה',
  'rbs hey': 'רמת בית שמש ה',
  'ramat beit shemesh h': 'רמת בית שמש ה',
  "רמב\"ש ה": 'רמת בית שמש ה',
  'רמב״ש ה': 'רמת בית שמש ה',

  // Old Beit Shemesh
  'old beit shemesh': 'בית שמש הותיקה',
  'old bs': 'בית שמש הותיקה',
  'beit shemesh vatika': 'בית שמש הותיקה',

  // Shaalvim
  'shaalvim': 'שעלבים',
  "sha'alvim": 'שעלבים',
}

// Price type aliases
const PRICE_TYPE_ALIASES: Record<string, PriceType> = {
  'fixed': 'FIXED',
  'one-time': 'FIXED',
  'single': 'FIXED',
  'חד פעמי': 'FIXED',

  'hourly': 'HOURLY',
  'per hour': 'HOURLY',
  'לשעה': 'HOURLY',

  'session': 'PER_SESSION',
  'per session': 'PER_SESSION',
  'per class': 'PER_SESSION',
  'לשיעור': 'PER_SESSION',

  'monthly': 'MONTHLY',
  'per month': 'MONTHLY',
  'חודשי': 'MONTHLY',
  'לחודש': 'MONTHLY',

  'contact': 'CONTACT',
  'call': 'CONTACT',
  'inquire': 'CONTACT',
  'ליצירת קשר': 'CONTACT',

  'free': 'FREE',
  'חינם': 'FREE',
  'ללא תשלום': 'FREE',
}

// Gender aliases
const GENDER_ALIASES: Record<string, Gender> = {
  'male': 'MALE',
  'boys': 'MALE',
  'men': 'MALE',
  'בנים': 'MALE',
  'גברים': 'MALE',

  'female': 'FEMALE',
  'girls': 'FEMALE',
  'women': 'FEMALE',
  'בנות': 'FEMALE',
  'נשים': 'FEMALE',

  'all': 'ALL',
  'both': 'ALL',
  'mixed': 'ALL',
  'everyone': 'ALL',
  'מעורב': 'ALL',
  'לכולם': 'ALL',
}

// Language code mappings
const LANGUAGE_ALIASES: Record<string, string> = {
  'hebrew': 'he',
  'עברית': 'he',
  'english': 'en',
  'אנגלית': 'en',
  'french': 'fr',
  'צרפתית': 'fr',
  'russian': 'ru',
  'רוסית': 'ru',
  'spanish': 'es',
  'ספרדית': 'es',
}

// Subsidy aliases
const SUBSIDY_ALIASES: Record<string, string> = {
  'meuhedet': 'מאוחדת',
  'meuchedet': 'מאוחדת',
  'clalit': 'כללית',
  'maccabi': 'מכבי',
  'macabi': 'מכבי',
  'leumit': 'לאומית',
}

/**
 * Normalize phone number to standard Israeli format
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')

  // Remove leading + or country code
  if (cleaned.startsWith('+972')) {
    cleaned = '0' + cleaned.slice(4)
  } else if (cleaned.startsWith('972')) {
    cleaned = '0' + cleaned.slice(3)
  }

  // Ensure starts with 0
  if (!cleaned.startsWith('0') && cleaned.length === 9) {
    cleaned = '0' + cleaned
  }

  // Format as 0XX-XXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return cleaned
}

/**
 * Normalize neighborhood name
 */
export function normalizeNeighborhood(neighborhood: string): string | undefined {
  const lower = neighborhood.toLowerCase().trim()

  // Check aliases first
  if (NEIGHBORHOOD_ALIASES[lower]) {
    return NEIGHBORHOOD_ALIASES[lower]
  }

  // Check if it's already a valid neighborhood
  const exactMatch = RBS_NEIGHBORHOODS.find(n => n === neighborhood)
  if (exactMatch) {
    return exactMatch
  }

  // Fuzzy match against known neighborhoods
  for (const known of RBS_NEIGHBORHOODS) {
    if (known.includes(neighborhood) || neighborhood.includes(known)) {
      return known
    }
  }

  return undefined
}

/**
 * Normalize price type
 */
export function normalizePriceType(priceType: string): PriceType {
  const lower = priceType.toLowerCase().trim()

  if (PRICE_TYPE_ALIASES[lower]) {
    return PRICE_TYPE_ALIASES[lower]
  }

  // Check if it's already a valid type
  const upper = priceType.toUpperCase() as PriceType
  if (['FIXED', 'HOURLY', 'PER_SESSION', 'MONTHLY', 'CONTACT', 'FREE'].includes(upper)) {
    return upper
  }

  return 'CONTACT' // Default
}

/**
 * Normalize gender
 */
export function normalizeGender(gender: string): Gender {
  const lower = gender.toLowerCase().trim()

  if (GENDER_ALIASES[lower]) {
    return GENDER_ALIASES[lower]
  }

  const upper = gender.toUpperCase() as Gender
  if (['MALE', 'FEMALE', 'ALL'].includes(upper)) {
    return upper
  }

  return 'ALL' // Default
}

/**
 * Normalize languages
 */
export function normalizeLanguages(languages: string | string[]): string[] {
  const langArray = Array.isArray(languages) ? languages : languages.split(/[,;]/)

  return langArray
    .map(lang => {
      const lower = lang.toLowerCase().trim()
      return LANGUAGE_ALIASES[lower] || lower
    })
    .filter(lang => ['he', 'en', 'fr', 'ru', 'es'].includes(lang))
}

/**
 * Normalize subsidies
 */
export function normalizeSubsidies(subsidies: string | string[]): string[] {
  const subArray = Array.isArray(subsidies) ? subsidies : subsidies.split(/[,;]/)

  return subArray
    .map(sub => {
      const trimmed = sub.trim()
      const lower = trimmed.toLowerCase()
      return SUBSIDY_ALIASES[lower] || trimmed
    })
    .filter(sub => ['מאוחדת', 'כללית', 'מכבי', 'לאומית'].includes(sub))
}

/**
 * Extract price from text (handles ₪, NIS, shekel formats)
 */
export function extractPrice(text: string): number | undefined {
  // Match patterns like: ₪150, 150₪, 150 NIS, 150 שקל, etc.
  const patterns = [
    /₪\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*₪/,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:nis|shekel|שקל|ש"ח|ש״ח)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''))
    }
  }

  // Try plain number if no currency symbol
  const plainNumber = text.match(/^(\d+(?:\.\d{2})?)$/)
  if (plainNumber) {
    return parseFloat(plainNumber[1])
  }

  return undefined
}

/**
 * Match category by name (fuzzy matching)
 */
export function matchCategory(categoryName: string): string | undefined {
  const lower = categoryName.toLowerCase().trim()

  // Exact match on name or nameHe
  const exact = categories.find(
    c => c.name.toLowerCase() === lower || c.nameHe === categoryName
  )
  if (exact) return exact.id

  // Partial match
  const partial = categories.find(
    c => c.name.toLowerCase().includes(lower) ||
         lower.includes(c.name.toLowerCase()) ||
         c.nameHe.includes(categoryName)
  )
  if (partial) return partial.id

  // Keyword-based matching
  const keywordMap: Record<string, string[]> = {
    'cat-kids-sports': ['sport', 'soccer', 'basketball', 'swim', 'כדורגל', 'ספורט', 'שחייה'],
    'cat-kids-music': ['music', 'piano', 'guitar', 'מוזיקה', 'פסנתר', 'גיטרה'],
    'cat-kids-dance': ['dance', 'ballet', 'jazz', 'ריקוד', 'בלט'],
    'cat-kids-art': ['art', 'paint', 'draw', 'craft', 'אומנות', 'ציור', 'יצירה'],
    'cat-kids-academic': ['tutor', 'math', 'english', 'homework', 'שיעורים', 'מתמטיקה'],
    'cat-health-therapy': ['therapy', 'counsel', 'psychology', 'טיפול', 'פסיכולוג'],
    'cat-health-fitness': ['yoga', 'pilates', 'gym', 'fitness', 'יוגה', 'כושר'],
  }

  for (const [catId, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(kw => lower.includes(kw) || categoryName.includes(kw))) {
      return catId
    }
  }

  return undefined
}

/**
 * Normalize a full listing input
 */
export function normalizeListing(input: ListingInput): Partial<Listing> {
  const normalized: Partial<Listing> = {}

  // Basic text fields
  if (input.title) normalized.title = input.title.trim()
  if (input.titleHe) normalized.titleHe = input.titleHe.trim()
  if (input.description) normalized.description = input.description.trim()
  if (input.descriptionHe) normalized.descriptionHe = input.descriptionHe.trim()
  if (input.location) normalized.location = input.location.trim()

  // Category
  if (input.categoryId) {
    normalized.categoryId = input.categoryId
  } else if (input.categoryName) {
    const matchedCategory = matchCategory(input.categoryName)
    if (matchedCategory) normalized.categoryId = matchedCategory
  }

  // Provider
  if (input.providerId) normalized.providerId = input.providerId

  // Price
  if (input.price !== undefined && input.price !== '') {
    if (typeof input.price === 'string') {
      const extracted = extractPrice(input.price)
      if (extracted !== undefined) normalized.price = extracted
    } else {
      normalized.price = input.price
    }
  }

  // Price type
  if (input.priceType) {
    normalized.priceType = normalizePriceType(input.priceType)
  }

  // Neighborhood
  if (input.neighborhood) {
    const normalizedNeighborhood = normalizeNeighborhood(input.neighborhood)
    if (normalizedNeighborhood) normalized.neighborhood = normalizedNeighborhood
  }

  // Ages
  if (input.ageMin !== undefined) {
    const ageMin = typeof input.ageMin === 'string' ? parseInt(input.ageMin) : input.ageMin
    if (!isNaN(ageMin)) normalized.ageMin = ageMin
  }
  if (input.ageMax !== undefined) {
    const ageMax = typeof input.ageMax === 'string' ? parseInt(input.ageMax) : input.ageMax
    if (!isNaN(ageMax)) normalized.ageMax = ageMax
  }

  // Gender
  if (input.gender) {
    normalized.gender = normalizeGender(input.gender)
  }
  if (input.instructorGender) {
    normalized.instructorGender = normalizeGender(input.instructorGender)
  }

  // Languages
  if (input.language) {
    normalized.language = normalizeLanguages(input.language)
  }

  // Max participants
  if (input.maxParticipants !== undefined) {
    const max = typeof input.maxParticipants === 'string'
      ? parseInt(input.maxParticipants)
      : input.maxParticipants
    if (!isNaN(max)) normalized.maxParticipants = max
  }

  // Duration
  if (input.duration !== undefined) {
    const duration = typeof input.duration === 'string'
      ? parseInt(input.duration)
      : input.duration
    if (!isNaN(duration)) normalized.duration = duration
  }

  // Online
  if (input.isOnline !== undefined) {
    if (typeof input.isOnline === 'string') {
      normalized.isOnline = ['true', 'yes', '1', 'כן'].includes(input.isOnline.toLowerCase())
    } else {
      normalized.isOnline = input.isOnline
    }
  }

  // Subsidies
  if (input.subsidies) {
    normalized.subsidies = normalizeSubsidies(input.subsidies)
  }

  return normalized
}
