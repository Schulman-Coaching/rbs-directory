/**
 * Bulk Listings Import API Route
 * POST: Import multiple listings from CSV
 */

import { NextRequest, NextResponse } from 'next/server'
import { processCSVImport, getIngestionStats, IngestionOptions } from '@/services/ingestion'
import { validateCSVStructure } from '@/services/ingestion/parsers/csv'
import { getListingsStore, updateListingsStore } from '../route'
import { Listing, SourceType } from '@/types'

let idCounter = 200

/**
 * POST /api/listings/bulk
 * Import listings from CSV content
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let csvContent: string
    let sourceType: SourceType = 'CSV_IMPORT'
    let sourceId: string | undefined
    let sourceUrl: string | undefined
    let autoApprove = false
    let skipDuplicates = true

    // Handle multipart form data (file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file uploaded' },
          { status: 400 }
        )
      }

      csvContent = await file.text()
      autoApprove = formData.get('autoApprove') === 'true'
      skipDuplicates = formData.get('skipDuplicates') !== 'false'
      sourceId = formData.get('sourceId') as string || undefined
    }
    // Handle JSON body with CSV content
    else {
      const body = await request.json()
      csvContent = body.csvContent || body.content

      if (!csvContent) {
        return NextResponse.json(
          { success: false, error: 'No CSV content provided' },
          { status: 400 }
        )
      }

      sourceType = body.sourceType || 'CSV_IMPORT'
      sourceId = body.sourceId
      sourceUrl = body.sourceUrl
      autoApprove = body.autoApprove ?? false
      skipDuplicates = body.skipDuplicates ?? true
    }

    // Validate CSV structure first
    const structureValidation = validateCSVStructure(csvContent)
    if (!structureValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid CSV structure',
        errors: structureValidation.errors,
        stats: {
          rowCount: structureValidation.rowCount,
          columnCount: structureValidation.columnCount,
        },
      }, { status: 400 })
    }

    // Get existing listings for duplicate detection
    const existingListings = getListingsStore().map(l => ({
      title: l.title,
      titleHe: l.titleHe,
      providerId: l.providerId,
    }))

    // Process CSV through ingestion pipeline
    const options: IngestionOptions = {
      sourceType,
      sourceId,
      sourceUrl,
      skipDuplicates,
      autoApprove,
      existingListings,
    }

    const result = processCSVImport(csvContent, options)

    // If we have listings to create, add them to store
    if (result.listings.length > 0) {
      const currentStore = getListingsStore()

      const newListings: Listing[] = result.listings.map(partial => ({
        id: `listing-${++idCounter}`,
        title: partial.title || '',
        titleHe: partial.titleHe,
        description: partial.description || '',
        descriptionHe: partial.descriptionHe,
        categoryId: partial.categoryId || 'cat-other',
        providerId: partial.providerId || 'provider-bulk-import',
        price: partial.price,
        priceType: partial.priceType || 'CONTACT',
        location: partial.location,
        neighborhood: partial.neighborhood,
        ageMin: partial.ageMin,
        ageMax: partial.ageMax,
        gender: partial.gender || 'ALL',
        instructorGender: partial.instructorGender,
        language: partial.language || ['he'],
        maxParticipants: partial.maxParticipants,
        duration: partial.duration,
        isOnline: partial.isOnline,
        imageUrl: partial.imageUrl,
        images: partial.images || [],
        subsidies: partial.subsidies || [],
        tags: partial.tags || [],
        status: partial.status || 'PENDING',
        featured: false,
        rating: 0,
        reviewCount: 0,
        viewCount: 0,
        sourceType: partial.sourceType || 'CSV_IMPORT',
        sourceId: partial.sourceId,
        sourceUrl: partial.sourceUrl,
        syncEnabled: partial.syncEnabled || false,
        submittedAt: partial.submittedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      updateListingsStore([...currentStore, ...newListings])

      const stats = getIngestionStats(result)

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${newListings.length} listing(s)`,
        data: {
          created: newListings,
          ids: newListings.map(l => l.id),
        },
        stats: {
          ...stats,
          csvRowCount: structureValidation.rowCount,
          csvColumnCount: structureValidation.columnCount,
        },
        errors: result.errors,
        warnings: result.warnings,
      }, { status: 201 })
    }

    // No listings created
    const stats = getIngestionStats(result)

    return NextResponse.json({
      success: false,
      error: 'No listings were imported',
      stats: {
        ...stats,
        csvRowCount: structureValidation.rowCount,
        csvColumnCount: structureValidation.columnCount,
      },
      errors: result.errors,
      warnings: result.warnings,
    }, { status: 400 })

  } catch (error) {
    console.error('Error in bulk import:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process bulk import' },
      { status: 500 }
    )
  }
}
