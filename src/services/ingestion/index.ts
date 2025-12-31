/**
 * Ingestion Service
 * Central module for listing data ingestion from various sources
 */

export * from './validation'
export * from './normalization'
export * from './parsers'
export * from './sync'

import { validateListing, validateListingBatch, checkForDuplicates, ListingInput, ValidationResult } from './validation'
import { normalizeListing } from './normalization'
import { parseCSV, CSVParseResult } from './parsers/csv'
import { Listing, SourceType } from '@/types'

export interface IngestionResult {
  success: boolean
  created: number
  updated: number
  skipped: number
  errors: { row: number; message: string }[]
  warnings: { row: number; message: string }[]
  listings: Partial<Listing>[]
}

export interface IngestionOptions {
  sourceType: SourceType
  sourceId?: string
  sourceUrl?: string
  skipDuplicates?: boolean
  autoApprove?: boolean
  existingListings?: { title: string; titleHe?: string; providerId: string }[]
}

/**
 * Process a batch of listing inputs through the ingestion pipeline
 */
export function processListingBatch(
  inputs: ListingInput[],
  options: IngestionOptions
): IngestionResult {
  const result: IngestionResult = {
    success: true,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    warnings: [],
    listings: [],
  }

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    const rowNum = i + 1

    // Step 1: Validate
    const validationResult = validateListing(input)

    // Add warnings
    validationResult.warnings.forEach(w => {
      result.warnings.push({ row: rowNum, message: `${w.field}: ${w.message}` })
    })

    if (!validationResult.isValid) {
      validationResult.errors.forEach(e => {
        result.errors.push({ row: rowNum, message: `${e.field}: ${e.message}` })
      })
      result.skipped++
      result.success = false
      continue
    }

    // Step 2: Check for duplicates
    if (options.skipDuplicates && options.existingListings) {
      const duplicateCheck = checkForDuplicates(input, options.existingListings)
      if (duplicateCheck.isDuplicate) {
        result.warnings.push({
          row: rowNum,
          message: `Potential duplicate: ${duplicateCheck.matches.join(', ')} (${Math.round(duplicateCheck.confidence * 100)}% confidence)`,
        })
        result.skipped++
        continue
      }
    }

    // Step 3: Normalize
    const normalized = normalizeListing(input)

    // Add source metadata
    normalized.sourceType = options.sourceType
    normalized.sourceId = options.sourceId
    normalized.sourceUrl = options.sourceUrl
    normalized.submittedAt = new Date()
    normalized.status = options.autoApprove ? 'ACTIVE' : 'PENDING'
    normalized.syncEnabled = options.sourceType === 'GOOGLE_SHEETS'

    result.listings.push(normalized)
    result.created++
  }

  return result
}

/**
 * Process a CSV file through the ingestion pipeline
 */
export function processCSVImport(
  csvContent: string,
  options: IngestionOptions
): IngestionResult {
  // Parse CSV
  const parseResult = parseCSV(csvContent)

  if (!parseResult.success) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: parseResult.errors.map((e, i) => ({ row: i, message: e })),
      warnings: [],
      listings: [],
    }
  }

  // Process parsed rows
  return processListingBatch(parseResult.rows, options)
}

/**
 * Get ingestion statistics
 */
export function getIngestionStats(result: IngestionResult): {
  total: number
  successRate: number
  created: number
  skipped: number
  errorCount: number
  warningCount: number
} {
  const total = result.created + result.skipped
  return {
    total,
    successRate: total > 0 ? (result.created / total) * 100 : 0,
    created: result.created,
    skipped: result.skipped,
    errorCount: result.errors.length,
    warningCount: result.warnings.length,
  }
}
