/**
 * Single Listing API Routes
 * GET: Get a single listing by ID
 * PUT: Update a listing
 * DELETE: Delete a listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { findListingById, updateListing, deleteListing } from '../route'
import { validateListing, ListingInput } from '@/services/ingestion/validation'
import { normalizeListing } from '@/services/ingestion/normalization'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/listings/[id]
 * Get a single listing by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const listing = findListingById(id)

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: listing,
    })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/listings/[id]
 * Update a listing
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    const existing = findListingById(id)

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Validate the update data
    const input: ListingInput = {
      title: body.title ?? existing.title,
      titleHe: body.titleHe ?? existing.titleHe,
      description: body.description ?? existing.description,
      descriptionHe: body.descriptionHe ?? existing.descriptionHe,
      categoryId: body.categoryId ?? existing.categoryId,
      providerId: body.providerId ?? existing.providerId,
      price: body.price ?? existing.price,
      priceType: body.priceType ?? existing.priceType,
      location: body.location ?? existing.location,
      neighborhood: body.neighborhood ?? existing.neighborhood,
      ageMin: body.ageMin ?? existing.ageMin,
      ageMax: body.ageMax ?? existing.ageMax,
      gender: body.gender ?? existing.gender,
      instructorGender: body.instructorGender ?? existing.instructorGender,
      language: body.language ?? existing.language,
      maxParticipants: body.maxParticipants ?? existing.maxParticipants,
      duration: body.duration ?? existing.duration,
      isOnline: body.isOnline ?? existing.isOnline,
      subsidies: body.subsidies ?? existing.subsidies,
    }

    const validation = validateListing(input)

    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors,
        warnings: validation.warnings,
      }, { status: 400 })
    }

    // Normalize and update
    const normalized = normalizeListing(input)

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {}

    // Copy normalized fields
    Object.entries(normalized).forEach(([key, value]) => {
      if (value !== undefined) {
        updates[key] = value
      }
    })

    // Handle non-normalized fields
    if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl
    if (body.images !== undefined) updates.images = body.images
    if (body.tags !== undefined) updates.tags = body.tags
    if (body.status !== undefined) updates.status = body.status
    if (body.featured !== undefined) updates.featured = body.featured

    // Mark as locally modified if synced from external source
    if (existing.syncEnabled && existing.sourceType !== 'MANUAL') {
      updates.locallyModified = true
    }

    const updated = updateListing(id, updates)

    return NextResponse.json({
      success: true,
      data: updated,
      warnings: validation.warnings,
    })
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/listings/[id]
 * Delete a listing (soft delete by changing status to ARCHIVED)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const hardDelete = searchParams.get('hard') === 'true'

    const existing = findListingById(id)

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (hardDelete) {
      // Permanent delete
      const deleted = deleteListing(id)
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Failed to delete listing' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Listing permanently deleted',
      })
    } else {
      // Soft delete (archive)
      const updated = updateListing(id, { status: 'ARCHIVED' })

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Listing archived',
      })
    }
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}
