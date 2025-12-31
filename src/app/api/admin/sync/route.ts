/**
 * Admin Sync Management API Routes
 * GET: List sync sources and status
 * POST: Add a new sync source
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getSyncSources,
  getSyncLogs,
  addSyncSource,
  getSyncStatus,
  executeSyncForSource,
} from '@/services/ingestion/sync'
import { getListingsStore } from '@/app/api/listings/route'
import { SyncFrequency } from '@/types'

/**
 * GET /api/admin/sync
 * Get sync sources and status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sourceId = searchParams.get('sourceId')

    if (sourceId) {
      // Get logs for specific source
      const logs = getSyncLogs(sourceId)
      return NextResponse.json({
        success: true,
        data: {
          logs,
        },
      })
    }

    const sources = getSyncSources()
    const status = getSyncStatus()
    const recentLogs = getSyncLogs().slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        sources,
        status,
        recentLogs,
      },
    })
  } catch (error) {
    console.error('Error getting sync data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get sync data' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/sync
 * Add a new sync source
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.url || !body.type) {
      return NextResponse.json(
        { success: false, error: 'name, url, and type are required' },
        { status: 400 }
      )
    }

    if (!['GOOGLE_SHEETS', 'CSV_IMPORT'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'type must be GOOGLE_SHEETS or CSV_IMPORT' },
        { status: 400 }
      )
    }

    const newSource = addSyncSource({
      name: body.name,
      url: body.url,
      type: body.type,
      isActive: body.isActive ?? true,
      syncFrequency: (body.syncFrequency as SyncFrequency) || 'DAILY',
      columnMapping: body.columnMapping || {},
    })

    return NextResponse.json({
      success: true,
      data: newSource,
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding sync source:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add sync source' },
      { status: 500 }
    )
  }
}
