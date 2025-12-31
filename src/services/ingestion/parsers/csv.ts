/**
 * CSV Parser for Listing Imports
 * Parses CSV files and maps columns to listing fields
 */

import { ColumnMapping } from '@/types'
import { ListingInput } from '../validation'

export interface CSVParseResult {
  success: boolean
  headers: string[]
  rows: ListingInput[]
  errors: string[]
  rowCount: number
}

export interface CSVParseOptions {
  delimiter?: string
  hasHeaders?: boolean
  columnMapping?: ColumnMapping
  skipEmptyRows?: boolean
}

const DEFAULT_OPTIONS: CSVParseOptions = {
  delimiter: ',',
  hasHeaders: true,
  skipEmptyRows: true,
}

/**
 * Parse a CSV string into listing inputs
 */
export function parseCSV(
  content: string,
  options: CSVParseOptions = {}
): CSVParseResult {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const errors: string[] = []
  const rows: ListingInput[] = []

  // Split into lines
  const lines = content.split(/\r?\n/).filter(line => {
    if (opts.skipEmptyRows) {
      return line.trim().length > 0
    }
    return true
  })

  if (lines.length === 0) {
    return {
      success: false,
      headers: [],
      rows: [],
      errors: ['CSV file is empty'],
      rowCount: 0,
    }
  }

  // Parse headers
  let headers: string[] = []
  let dataStartIndex = 0

  if (opts.hasHeaders) {
    headers = parseCSVLine(lines[0], opts.delimiter!)
    dataStartIndex = 1
  }

  // Auto-detect column mapping if not provided
  const mapping = opts.columnMapping || autoDetectColumnMapping(headers)

  // Parse data rows
  for (let i = dataStartIndex; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i], opts.delimiter!)
      const row = mapRowToListing(headers, values, mapping)
      rows.push(row)
    } catch (err) {
      errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Parse error'}`)
    }
  }

  return {
    success: errors.length === 0,
    headers,
    rows,
    errors,
    rowCount: rows.length,
  }
}

/**
 * Parse a single CSV line handling quotes and escapes
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++
      } else if (char === '"') {
        // End of quoted field
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true
      } else if (char === delimiter) {
        // End of field
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
  }

  // Add last field
  result.push(current.trim())

  return result
}

/**
 * Auto-detect column mapping from headers
 */
function autoDetectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {}

  const headerPatterns: Record<string, RegExp[]> = {
    title: [/^title$/i, /^name$/i, /^listing.?name$/i, /^שם$/],
    titleHe: [/^title.?he$/i, /^hebrew.?title$/i, /^שם.?עברית$/],
    description: [/^desc/i, /^about$/i, /^תיאור$/],
    descriptionHe: [/^desc.?he$/i, /^hebrew.?desc/i],
    category: [/^category$/i, /^cat$/i, /^קטגוריה$/],
    price: [/^price$/i, /^cost$/i, /^מחיר$/],
    priceType: [/^price.?type$/i, /^סוג.?מחיר$/],
    phone: [/^phone$/i, /^tel$/i, /^mobile$/i, /^טלפון$/],
    email: [/^email$/i, /^mail$/i, /^דוא.?ל$/],
    location: [/^location$/i, /^address$/i, /^כתובת$/i, /^מיקום$/],
    neighborhood: [/^neighborhood$/i, /^area$/i, /^שכונה$/],
    ageMin: [/^age.?min$/i, /^min.?age$/i, /^גיל.?מינימום$/],
    ageMax: [/^age.?max$/i, /^max.?age$/i, /^גיל.?מקסימום$/],
    gender: [/^gender$/i, /^for$/i, /^מגדר$/],
    language: [/^language$/i, /^lang$/i, /^שפה$/],
  }

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase().trim()

    for (const [field, patterns] of Object.entries(headerPatterns)) {
      if (patterns.some(pattern => pattern.test(header))) {
        mapping[field] = headers[i]
        break
      }
    }
  }

  return mapping
}

/**
 * Map a CSV row to listing input using column mapping
 */
function mapRowToListing(
  headers: string[],
  values: string[],
  mapping: ColumnMapping
): ListingInput {
  const listing: ListingInput = {}

  // Create header-to-index map
  const headerIndex: Record<string, number> = {}
  headers.forEach((h, i) => {
    headerIndex[h.toLowerCase()] = i
  })

  // Map each field
  for (const [field, columnName] of Object.entries(mapping)) {
    if (columnName) {
      const index = headerIndex[columnName.toLowerCase()]
      if (index !== undefined && values[index] !== undefined) {
        const value = values[index].trim()
        if (value) {
          listing[field] = value
        }
      }
    }
  }

  return listing
}

/**
 * Generate a sample CSV template
 */
export function generateCSVTemplate(): string {
  const headers = [
    'title',
    'titleHe',
    'description',
    'descriptionHe',
    'category',
    'price',
    'priceType',
    'phone',
    'email',
    'location',
    'neighborhood',
    'ageMin',
    'ageMax',
    'gender',
    'language',
    'duration',
    'maxParticipants',
  ]

  const sampleRow = [
    'Kids Soccer Classes',
    'חוג כדורגל לילדים',
    'Professional soccer training for kids',
    'אימוני כדורגל מקצועיים לילדים',
    'Sports',
    '200',
    'MONTHLY',
    '052-123-4567',
    'info@example.com',
    'Sports Center, Main Street',
    'רמת בית שמש א',
    '6',
    '12',
    'ALL',
    'he,en',
    '60',
    '20',
  ]

  return [
    headers.join(','),
    sampleRow.map(v => `"${v}"`).join(','),
  ].join('\n')
}

/**
 * Validate CSV structure before parsing
 */
export function validateCSVStructure(content: string): {
  isValid: boolean
  errors: string[]
  rowCount: number
  columnCount: number
} {
  const errors: string[] = []
  const lines = content.split(/\r?\n/).filter(l => l.trim())

  if (lines.length === 0) {
    return {
      isValid: false,
      errors: ['File is empty'],
      rowCount: 0,
      columnCount: 0,
    }
  }

  const headerCount = parseCSVLine(lines[0], ',').length
  let rowCount = lines.length - 1

  if (headerCount < 2) {
    errors.push('CSV should have at least 2 columns')
  }

  // Check for consistent column counts
  for (let i = 1; i < lines.length; i++) {
    const colCount = parseCSVLine(lines[i], ',').length
    if (colCount !== headerCount) {
      errors.push(`Row ${i + 1} has ${colCount} columns, expected ${headerCount}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    rowCount,
    columnCount: headerCount,
  }
}
