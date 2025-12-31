/**
 * Sync Service for Scheduled Data Imports
 * Handles syncing from external sources like Google Sheets
 */

import { SyncSource, SyncLog, SyncStatus, Listing } from '@/types'
import { processListingBatch, IngestionOptions } from './index'
import { ListingInput } from './validation'

// In-memory sync sources for development
let syncSources: SyncSource[] = [
  {
    id: 'sync-1',
    name: 'Main Listings Sheet',
    url: 'https://docs.google.com/spreadsheets/d/example/edit',
    type: 'GOOGLE_SHEETS',
    isActive: true,
    syncFrequency: 'DAILY',
    lastSyncAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastSyncStatus: 'SUCCESS',
    columnMapping: {
      title: 'Name',
      titleHe: 'שם',
      description: 'Description',
      categoryId: 'Category',
      price: 'Price',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
]

let syncLogs: SyncLog[] = []

/**
 * Get all sync sources
 */
export function getSyncSources(): SyncSource[] {
  return syncSources
}

/**
 * Get sync source by ID
 */
export function getSyncSourceById(id: string): SyncSource | undefined {
  return syncSources.find(s => s.id === id)
}

/**
 * Add a new sync source
 */
export function addSyncSource(source: Omit<SyncSource, 'id' | 'createdAt' | 'updatedAt'>): SyncSource {
  const newSource: SyncSource = {
    ...source,
    id: `sync-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  syncSources.push(newSource)
  return newSource
}

/**
 * Update a sync source
 */
export function updateSyncSource(id: string, updates: Partial<SyncSource>): SyncSource | null {
  const index = syncSources.findIndex(s => s.id === id)
  if (index === -1) return null

  syncSources[index] = {
    ...syncSources[index],
    ...updates,
    updatedAt: new Date(),
  }
  return syncSources[index]
}

/**
 * Delete a sync source
 */
export function deleteSyncSource(id: string): boolean {
  const index = syncSources.findIndex(s => s.id === id)
  if (index === -1) return false
  syncSources.splice(index, 1)
  return true
}

/**
 * Get sync logs
 */
export function getSyncLogs(sourceId?: string): SyncLog[] {
  if (sourceId) {
    return syncLogs.filter(l => l.sourceId === sourceId)
  }
  return syncLogs
}

/**
 * Add a sync log entry
 */
function addSyncLog(log: Omit<SyncLog, 'id' | 'startedAt'>): SyncLog {
  const newLog: SyncLog = {
    ...log,
    id: `log-${Date.now()}`,
    startedAt: new Date(),
  }
  syncLogs.unshift(newLog) // Add to beginning (most recent first)

  // Keep only last 100 logs per source
  const sourceLogs = syncLogs.filter(l => l.sourceId === log.sourceId)
  if (sourceLogs.length > 100) {
    const toRemove = sourceLogs.slice(100)
    syncLogs = syncLogs.filter(l => !toRemove.includes(l))
  }

  return newLog
}

/**
 * Simulated Google Sheets fetch (would use Google Sheets API in production)
 */
async function fetchGoogleSheetsData(url: string, mapping: Record<string, string>): Promise<ListingInput[]> {
  // In production, this would:
  // 1. Parse the sheet ID from the URL
  // 2. Use Google Sheets API to fetch data
  // 3. Map columns according to the mapping

  // For now, return mock data to simulate the flow
  console.log(`[Sync] Fetching from Google Sheets: ${url}`)

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Return empty for simulation (no real data fetched)
  return []
}

/**
 * Execute sync for a single source
 */
export async function executeSyncForSource(
  sourceId: string,
  existingListings: { title: string; titleHe?: string; providerId: string }[] = []
): Promise<{
  success: boolean
  created: number
  updated: number
  skipped: number
  errors: string[]
}> {
  const source = getSyncSourceById(sourceId)
  if (!source) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: ['Sync source not found'],
    }
  }

  if (!source.isActive) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: ['Sync source is inactive'],
    }
  }

  // Start sync log
  const log = addSyncLog({
    sourceId: source.id,
    status: 'SYNCING',
  })

  try {
    // Fetch data from source
    let inputs: ListingInput[] = []

    if (source.type === 'GOOGLE_SHEETS') {
      inputs = await fetchGoogleSheetsData(source.url, source.columnMapping || {})
    }

    if (inputs.length === 0) {
      // No new data
      updateSyncSource(sourceId, {
        lastSyncAt: new Date(),
        lastSyncStatus: 'SUCCESS',
      })

      // Update log
      Object.assign(log, {
        status: 'SUCCESS' as SyncStatus,
        completedAt: new Date(),
        recordsFetched: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsSkipped: 0,
      })

      return {
        success: true,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
      }
    }

    // Process through ingestion pipeline
    const options: IngestionOptions = {
      sourceType: 'GOOGLE_SHEETS',
      sourceId: source.id,
      sourceUrl: source.url,
      skipDuplicates: true,
      autoApprove: false,
      existingListings,
    }

    const result = processListingBatch(inputs, options)

    // Update source
    updateSyncSource(sourceId, {
      lastSyncAt: new Date(),
      lastSyncStatus: result.success ? 'SUCCESS' : 'FAILED',
    })

    // Update log
    Object.assign(log, {
      status: result.success ? 'SUCCESS' : 'FAILED' as SyncStatus,
      completedAt: new Date(),
      recordsFetched: inputs.length,
      recordsCreated: result.created,
      recordsUpdated: result.updated,
      recordsSkipped: result.skipped,
      errorMessage: result.errors.length > 0 ? result.errors.map(e => e.message).join('; ') : undefined,
    })

    return {
      success: result.success,
      created: result.created,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors.map(e => e.message),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    updateSyncSource(sourceId, {
      lastSyncAt: new Date(),
      lastSyncStatus: 'FAILED',
    })

    Object.assign(log, {
      status: 'FAILED' as SyncStatus,
      completedAt: new Date(),
      errorMessage,
    })

    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [errorMessage],
    }
  }
}

/**
 * Execute sync for all active sources
 */
export async function executeScheduledSync(
  existingListings: { title: string; titleHe?: string; providerId: string }[] = []
): Promise<{
  totalSources: number
  successfulSyncs: number
  failedSyncs: number
  results: { sourceId: string; sourceName: string; success: boolean; created: number }[]
}> {
  const activeSources = syncSources.filter(s => s.isActive)

  const results = await Promise.all(
    activeSources.map(async source => {
      const result = await executeSyncForSource(source.id, existingListings)
      return {
        sourceId: source.id,
        sourceName: source.name,
        success: result.success,
        created: result.created,
      }
    })
  )

  return {
    totalSources: activeSources.length,
    successfulSyncs: results.filter(r => r.success).length,
    failedSyncs: results.filter(r => !r.success).length,
    results,
  }
}

/**
 * Check if sync is due for a source
 */
export function isSyncDue(source: SyncSource): boolean {
  if (!source.isActive) return false
  if (!source.lastSyncAt) return true

  const now = new Date()
  const lastSync = new Date(source.lastSyncAt)
  const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60)

  switch (source.syncFrequency) {
    case 'HOURLY':
      return hoursSinceSync >= 1
    case 'DAILY':
      return hoursSinceSync >= 24
    case 'WEEKLY':
      return hoursSinceSync >= 24 * 7
    default:
      return false
  }
}

/**
 * Get sync status summary
 */
export function getSyncStatus(): {
  activeSources: number
  totalSources: number
  pendingSyncs: number
  lastSyncTime: Date | null
  nextScheduledSync: Date | null
} {
  const activeSources = syncSources.filter(s => s.isActive)
  const pendingSyncs = activeSources.filter(s => isSyncDue(s)).length

  const lastSyncTimes = activeSources
    .filter(s => s.lastSyncAt)
    .map(s => new Date(s.lastSyncAt!).getTime())

  const lastSyncTime = lastSyncTimes.length > 0
    ? new Date(Math.max(...lastSyncTimes))
    : null

  // Next sync would be when any source is due
  // For simplicity, assume daily syncs at 2 AM Israel time
  const nextScheduledSync = new Date()
  nextScheduledSync.setHours(2, 0, 0, 0)
  if (nextScheduledSync <= new Date()) {
    nextScheduledSync.setDate(nextScheduledSync.getDate() + 1)
  }

  return {
    activeSources: activeSources.length,
    totalSources: syncSources.length,
    pendingSyncs,
    lastSyncTime,
    nextScheduledSync,
  }
}
