/**
 * Cron Sync Endpoint
 * Triggered by Vercel Cron or external scheduler
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { executeScheduledSync, getSyncStatus } from '@/services/ingestion/sync'
import { getListingsStore } from '@/app/api/listings/route'

// Environment variable for cron secret (for security)
const CRON_SECRET = process.env.CRON_SECRET

/**
 * GET /api/cron/sync
 * Get sync status
 */
export async function GET(request: NextRequest) {
  try {
    const status = getSyncStatus()

    return NextResponse.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('Error getting sync status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get sync status' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cron/sync
 * Execute scheduled sync
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret if configured
    if (CRON_SECRET) {
      const authHeader = request.headers.get('authorization')
      if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    // Check for Vercel cron header
    const isVercelCron = request.headers.get('x-vercel-cron') === 'true'

    console.log(`[Cron] Sync triggered ${isVercelCron ? 'by Vercel Cron' : 'manually'}`)

    // Get existing listings for duplicate detection
    const existingListings = getListingsStore().map(l => ({
      title: l.title,
      titleHe: l.titleHe,
      providerId: l.providerId,
    }))

    // Execute sync
    const result = await executeScheduledSync(existingListings)

    console.log(`[Cron] Sync completed: ${result.successfulSyncs}/${result.totalSources} successful`)

    return NextResponse.json({
      success: true,
      message: `Sync completed: ${result.successfulSyncs}/${result.totalSources} sources synced successfully`,
      data: result,
    })
  } catch (error) {
    console.error('Error executing sync:', error)
    return NextResponse.json(
      { success: false, error: 'Sync execution failed' },
      { status: 500 }
    )
  }
}
