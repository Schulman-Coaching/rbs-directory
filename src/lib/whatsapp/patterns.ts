// Hebrew and English pattern matchers for entity extraction from WhatsApp chats

// Israeli phone number patterns
export const PHONE_PATTERNS = {
  // Standard Israeli mobile: 05X-XXX-XXXX or +972-5X-XXX-XXXX
  standard: /(?:\+972|972|0)?[- ]?(?:5[0-9])[- ]?\d{3}[- ]?\d{4}/g,
  // With prefix like "טל:" or "phone:"
  withPrefix: /(?:טל[׳']?|טלפון|phone|tel|נייד)[:\s]*([0-9\-+() ]{9,15})/gi,
  // Landline: 02, 03, 04, 08, 09
  landline: /(?:\+972|972|0)?[- ]?(?:[2-489])[- ]?\d{3}[- ]?\d{4}/g,
}

// Email pattern
export const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

// Website pattern
export const WEBSITE_PATTERN = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi

// Price patterns (Hebrew and English)
export const PRICE_PATTERNS = {
  // ₪ symbol or שקל/ש"ח with number
  shekel: /(?:₪|ש[״"]ח|שקל(?:ים)?|NIS)\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
  // Number followed by shekel
  shekelAfter: /([0-9,]+(?:\.[0-9]{2})?)\s*(?:₪|ש[״"]ח|שקל(?:ים)?|NIS)/gi,
  // Price range: 100-200, מ-100 עד 200
  range: /(?:מ[- ]?)?₪?\s*(\d+)\s*(?:[-–]|עד|to)\s*₪?\s*(\d+)\s*(?:₪|ש[״"]ח)?/gi,
  // Per unit pricing
  perUnit: /(\d+)\s*(?:₪|ש[״"]ח)\s*(?:ל|per|\/)\s*(שעה|חודש|שיעור|פעם|hour|month|session|lesson)/gi,
}

// Service request patterns (someone looking for something)
export const SERVICE_REQUEST_PATTERNS = {
  // מחפש/ת - looking for
  lookingFor: /(?:מחפש[ת]?|מחפשים|looking for|need[s]?)\s+(.{10,150})/gi,
  // מישהו מכיר - anyone know
  anyoneKnow: /(?:מישהו מכיר|מישהי מכירה|anyone know[s]?|does anyone)\s+(.{10,150})/gi,
  // המלצה ל - recommendation for
  recommendationFor: /(?:המלצה ל|המלצות ל|recommend(?:ation)?(?:s)? for)\s+(.{10,150})/gi,
  // יש למישהו - does anyone have
  doesAnyoneHave: /(?:יש למישהו|יש למישהי|does anyone have)\s+(.{10,150})/gi,
  // צריך/צריכה - need
  need: /(?:צריך[ה]?|צריכים|אני צריך)\s+(.{10,150})/gi,
}

// Recommendation patterns
export const RECOMMENDATION_PATTERNS = {
  // Strong positive recommendations
  strongPositive: /(?:ממליץ בחום|מאוד ממליץ|ממליצה בחום|מאוד ממליצה|highly recommend|strongly recommend)/gi,
  // Regular positive
  positive: /(?:ממליץ|ממליצה|recommend|מומלץ|מומלצת|אהבנו|מעולה|מקצועי|מקצועית|עבד מצוין|עבדה מצוין)/gi,
  // Negative recommendations
  negative: /(?:לא ממליץ|לא ממליצה|לא לפנות|להימנע מ|don't recommend|avoid|wouldn't recommend|גרוע|איכזב|בעייתי)/gi,
}

// Business/provider name patterns
export const BUSINESS_PATTERNS = {
  // Hebrew business patterns (ends with common suffixes)
  hebrewBusiness: /(?:חוג|סטודיו|מכון|קליניקה|מרפאה|חנות)\s+[א-ת\s]{2,30}/g,
  // English business names (capitalized words)
  englishBusiness: /[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,3}/g,
}

// Category keywords for classification
export const CATEGORY_KEYWORDS = {
  sports: [
    'כדורגל', 'כדורסל', 'שחייה', 'ריצה', 'אופניים', 'ג\'ימבורי', 'התעמלות',
    'soccer', 'basketball', 'swimming', 'running', 'biking', 'gymnastics',
    'ספורט', 'אימון', 'כושר', 'sport', 'training', 'fitness'
  ],
  music: [
    'פסנתר', 'גיטרה', 'כינור', 'חליל', 'תופים', 'זמרה', 'מוזיקה',
    'piano', 'guitar', 'violin', 'flute', 'drums', 'singing', 'music'
  ],
  dance: [
    'ריקוד', 'מחול', 'בלט', 'היפ הופ', 'סלסה',
    'dance', 'ballet', 'hip hop', 'salsa'
  ],
  art: [
    'ציור', 'אמנות', 'יצירה', 'קרמיקה', 'פיסול',
    'art', 'painting', 'drawing', 'ceramics', 'sculpture'
  ],
  tutoring: [
    'מתמטיקה', 'אנגלית', 'פיזיקה', 'כימיה', 'שיעורים פרטיים', 'עזרה בשיעורים',
    'math', 'english', 'physics', 'chemistry', 'tutoring', 'homework help'
  ],
  therapy: [
    'טיפול', 'פסיכולוג', 'קלינאי', 'ריפוי בעיסוק', 'פיזיותרפיה',
    'therapy', 'psychologist', 'occupational', 'physiotherapy'
  ],
}

// Sentiment keywords
export const SENTIMENT_KEYWORDS = {
  positive: [
    'מעולה', 'מומלץ', 'אהבנו', 'מקצועי', 'אדיב', 'יעיל', 'מצוין', 'נהדר', 'טוב מאוד',
    'excellent', 'great', 'amazing', 'professional', 'wonderful', 'fantastic', 'love'
  ],
  negative: [
    'גרוע', 'נורא', 'איכזב', 'לא מקצועי', 'יקר מדי', 'בעייתי', 'לא ממליץ',
    'terrible', 'awful', 'disappointed', 'unprofessional', 'overpriced', 'avoid'
  ],
}

// System message patterns (to filter out)
export const SYSTEM_MESSAGE_PATTERNS = [
  /^.+צורף\/ה לקבוצה$/,
  /^.+הוסיף\/ה את .+$/,
  /^.+עזב\/ה$/,
  /^.+הוסר\/ה$/,
  /^.+שינה\/תה את שם הקבוצה$/,
  /^.+שינה\/תה את תמונת הקבוצה$/,
  /^.+added .+$/i,
  /^.+left$/i,
  /^.+removed .+$/i,
  /^.+changed the subject/i,
  /^.+changed this group's icon$/i,
  /^Messages and calls are end-to-end encrypted/i,
  /^הודעות ושיחות מוצפנות/,
  /^<מדיה לא נכללה>/,
  /^<Media omitted>/i,
  /^This message was deleted$/i,
  /^הודעה זו נמחקה$/,
]

// Helper function to check if message is a system message
export function isSystemMessage(content: string): boolean {
  return SYSTEM_MESSAGE_PATTERNS.some(pattern => pattern.test(content))
}

// Helper function to extract phone numbers from text
export function extractPhoneNumbers(text: string): string[] {
  const phones: string[] = []

  // Extract from standard pattern
  const standardMatches = text.match(PHONE_PATTERNS.standard)
  if (standardMatches) {
    phones.push(...standardMatches)
  }

  // Extract from prefix pattern
  const prefixMatches = text.match(PHONE_PATTERNS.withPrefix)
  if (prefixMatches) {
    phones.push(...prefixMatches.map(m => m.replace(/^[^\d]+/, '')))
  }

  // Normalize and dedupe
  return [...new Set(phones.map(normalizePhone))]
}

// Normalize phone number format
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters except +
  let normalized = phone.replace(/[^\d+]/g, '')

  // Convert +972 to 0
  if (normalized.startsWith('+972')) {
    normalized = '0' + normalized.slice(4)
  } else if (normalized.startsWith('972')) {
    normalized = '0' + normalized.slice(3)
  }

  // Format as 05X-XXX-XXXX
  if (normalized.length === 10 && normalized.startsWith('0')) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6)}`
  }

  return normalized
}

// Extract prices from text
export function extractPrices(text: string): { amount: number; type?: string }[] {
  const prices: { amount: number; type?: string }[] = []

  // Check for shekel amounts
  let match
  const shekelRegex = new RegExp(PRICE_PATTERNS.shekel.source, 'gi')
  while ((match = shekelRegex.exec(text)) !== null) {
    const amount = parseInt(match[1].replace(/,/g, ''))
    if (amount > 0 && amount < 100000) {
      prices.push({ amount })
    }
  }

  const shekelAfterRegex = new RegExp(PRICE_PATTERNS.shekelAfter.source, 'gi')
  while ((match = shekelAfterRegex.exec(text)) !== null) {
    const amount = parseInt(match[1].replace(/,/g, ''))
    if (amount > 0 && amount < 100000) {
      prices.push({ amount })
    }
  }

  // Check for per-unit pricing
  const perUnitRegex = new RegExp(PRICE_PATTERNS.perUnit.source, 'gi')
  while ((match = perUnitRegex.exec(text)) !== null) {
    const amount = parseInt(match[1])
    const unit = match[2]
    if (amount > 0 && amount < 100000) {
      prices.push({ amount, type: mapUnitToType(unit) })
    }
  }

  return prices
}

function mapUnitToType(unit: string): string {
  const unitLower = unit.toLowerCase()
  if (unitLower.includes('שעה') || unitLower.includes('hour')) return 'HOURLY'
  if (unitLower.includes('חודש') || unitLower.includes('month')) return 'MONTHLY'
  if (unitLower.includes('שיעור') || unitLower.includes('lesson') || unitLower.includes('session')) return 'PER_SESSION'
  return 'FIXED'
}

// Analyze sentiment of text
export function analyzeSentiment(text: string): 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' {
  const textLower = text.toLowerCase()

  let positiveScore = 0
  let negativeScore = 0

  SENTIMENT_KEYWORDS.positive.forEach(keyword => {
    if (textLower.includes(keyword.toLowerCase())) positiveScore++
  })

  SENTIMENT_KEYWORDS.negative.forEach(keyword => {
    if (textLower.includes(keyword.toLowerCase())) negativeScore++
  })

  if (positiveScore > negativeScore) return 'POSITIVE'
  if (negativeScore > positiveScore) return 'NEGATIVE'
  return 'NEUTRAL'
}

// Detect category from text
export function detectCategory(text: string): string | undefined {
  const textLower = text.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        return category
      }
    }
  }

  return undefined
}
