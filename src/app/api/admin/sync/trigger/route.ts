/**
 * Manual Sync Trigger API Route
 * POST: Trigger sync for a specific source or all sources
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  executeSyncForSource,
  executeScheduledSync,
  getSyncSourceById,
} from '@/services/ingestion/sync'
import { getListingsStore } from '@/app/api/listings/route'

/**
 * POST /api/admin/sync/trigger
 * Trigger sync for a source or all sources
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sourceId } = body

    // Get existing listings for duplicate detection
    const existingListings = getListingsStore().map(l => ({
      title: l.title,
      titleHe: l.titleHe,
      providerId: l.providerId,
    }))

    if (sourceId) {
      // Sync specific source
      const source = getSyncSourceById(sourceId)
      if (!source) {
        return NextResponse.json(
          { success: false, error: 'Sync source not found' },
          { status: 404 }
        )
      }

      const result = await executeSyncForSource(sourceId, existingListings)

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Sync completed: ${result.created} created, ${result.skipped} skipped`
          : `Sync failed: ${result.errors.join(', ')}`,
        data: result,
      })
    } else {
      // Sync all sources
      const result = await executeScheduledSync(existingListings)

      return NextResponse.json({
        success: result.failedSyncs === 0,
        message: `Sync completed: ${result.successfulSyncs}/${result.totalSources} sources successful`,
        data: result,
      })
    }
  } catch (error) {
    console.error('Error triggering sync:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to trigger sync' },
      { status: 500 }
    )
  }
}
