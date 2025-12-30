// WhatsApp .txt file parser
// Handles both English and Hebrew date formats
// Supports iOS and Android export formats

import type { ParsedMessage, ParseResult } from '@/types/whatsapp'
import { isSystemMessage } from './patterns'

// Message format patterns for different WhatsApp export formats
const MESSAGE_PATTERNS = {
  // iOS format: [DD/MM/YYYY, HH:MM:SS] Name: Message
  ios: /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/,
  // Android format: DD/MM/YYYY, HH:MM - Name: Message
  android: /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2})\s*-\s*([^:]+):\s*(.*)$/,
  // Hebrew format with dots: DD.MM.YYYY, HH:MM - Name: Message
  hebrewDots: /^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s+(\d{1,2}:\d{2})\s*-\s*([^:]+):\s*(.*)$/,
  // Alternative iOS with AM/PM: [DD/MM/YYYY, HH:MM:SS AM] Name: Message
  iosAmPm: /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*[AP]M)\]\s*([^:]+):\s*(.*)$/i,
}

// System message patterns (no sender)
const SYSTEM_PATTERNS = {
  ios: /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*(.+)$/,
  android: /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2})\s*-\s*(.+)$/,
}

// Group name extraction patterns
const GROUP_NAME_PATTERNS = [
  /WhatsApp Chat with (.+)$/i,
  /צ'אט וואטסאפ עם (.+)$/,
  /Chat de WhatsApp con (.+)$/i,
]

/**
 * Parse a WhatsApp export .txt file
 */
export function parseWhatsAppExport(fileContent: string): ParseResult {
  const lines = fileContent.split('\n')
  const messages: ParsedMessage[] = []
  const errors: string[] = []
  let groupName: string | undefined

  // Try to extract group name from first line
  if (lines.length > 0) {
    groupName = extractGroupName(lines[0])
  }

  let currentMessage: Partial<ParsedMessage> | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Try to parse as a new message
    const parsed = parseMessageLine(line)

    if (parsed) {
      // Save previous message if exists
      if (currentMessage && currentMessage.content) {
        messages.push(currentMessage as ParsedMessage)
      }

      // Start new message
      currentMessage = {
        timestamp: parsed.timestamp,
        senderName: parsed.senderName,
        senderPhone: extractPhoneFromName(parsed.senderName),
        content: parsed.content,
        isSystemMessage: parsed.isSystemMessage,
      }
    } else if (currentMessage) {
      // This line is a continuation of the previous message
      currentMessage.content = (currentMessage.content || '') + '\n' + line
    }
  }

  // Don't forget the last message
  if (currentMessage && currentMessage.content) {
    messages.push(currentMessage as ParsedMessage)
  }

  // Calculate date range
  const timestamps = messages.map(m => m.timestamp.getTime()).filter(t => !isNaN(t))
  const dateRange = {
    start: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : new Date(),
    end: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date(),
  }

  return {
    success: messages.length > 0,
    messages,
    groupName,
    dateRange,
    errors,
  }
}

/**
 * Try to parse a single line as a message
 */
function parseMessageLine(line: string): {
  timestamp: Date
  senderName: string
  content: string
  isSystemMessage: boolean
} | null {
  // Try each message pattern
  for (const [format, pattern] of Object.entries(MESSAGE_PATTERNS)) {
    const match = line.match(pattern)
    if (match) {
      const [, dateStr, timeStr, senderName, content] = match
      const timestamp = parseDateTime(dateStr, timeStr, format.includes('Dots'))

      if (timestamp) {
        return {
          timestamp,
          senderName: senderName.trim(),
          content: content.trim(),
          isSystemMessage: isSystemMessage(content),
        }
      }
    }
  }

  // Try system message patterns (no sender name)
  for (const [, pattern] of Object.entries(SYSTEM_PATTERNS)) {
    const match = line.match(pattern)
    if (match) {
      const [, dateStr, timeStr, content] = match
      const timestamp = parseDateTime(dateStr, timeStr)

      // Check if this looks like a system message (no colon separator)
      if (timestamp && isSystemMessage(content)) {
        return {
          timestamp,
          senderName: 'System',
          content: content.trim(),
          isSystemMessage: true,
        }
      }
    }
  }

  return null
}

/**
 * Parse date and time strings into a Date object
 */
function parseDateTime(dateStr: string, timeStr: string, useDots = false): Date | null {
  try {
    // Parse date (handle DD/MM/YYYY or DD.MM.YYYY)
    const separator = useDots ? '.' : '/'
    const dateParts = dateStr.split(useDots ? '.' : /[\/\.]/)

    if (dateParts.length !== 3) return null

    let day = parseInt(dateParts[0])
    let month = parseInt(dateParts[1]) - 1 // JS months are 0-indexed
    let year = parseInt(dateParts[2])

    // Handle 2-digit years
    if (year < 100) {
      year += year > 50 ? 1900 : 2000
    }

    // Parse time
    let hours = 0
    let minutes = 0
    let seconds = 0

    // Handle AM/PM
    const isPM = /PM/i.test(timeStr)
    const isAM = /AM/i.test(timeStr)
    const cleanTime = timeStr.replace(/\s*[AP]M/i, '')

    const timeParts = cleanTime.split(':')
    hours = parseInt(timeParts[0])
    minutes = parseInt(timeParts[1])
    if (timeParts.length > 2) {
      seconds = parseInt(timeParts[2])
    }

    // Adjust for AM/PM
    if (isPM && hours < 12) hours += 12
    if (isAM && hours === 12) hours = 0

    const date = new Date(year, month, day, hours, minutes, seconds)

    // Validate the date
    if (isNaN(date.getTime())) return null

    return date
  } catch {
    return null
  }
}

/**
 * Extract phone number from sender name (some exports include phone in name)
 */
function extractPhoneFromName(name: string): string | undefined {
  // Pattern: Name (~+972 XX-XXX-XXXX) or just the phone number
  const phoneMatch = name.match(/[+]?[\d\s\-()]{10,}/)
  if (phoneMatch) {
    const phone = phoneMatch[0].replace(/[\s\-()]/g, '')
    if (phone.length >= 10) {
      return phone
    }
  }
  return undefined
}

/**
 * Extract group name from file header or filename
 */
function extractGroupName(firstLine: string): string | undefined {
  for (const pattern of GROUP_NAME_PATTERNS) {
    const match = firstLine.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }
  return undefined
}

/**
 * Validate that a file looks like a WhatsApp export
 */
export function isValidWhatsAppExport(content: string): boolean {
  const lines = content.split('\n').slice(0, 10) // Check first 10 lines

  let validMessageCount = 0
  for (const line of lines) {
    if (parseMessageLine(line.trim())) {
      validMessageCount++
    }
  }

  // At least 2 valid messages in first 10 lines
  return validMessageCount >= 2
}

/**
 * Get statistics about a parsed export
 */
export function getExportStats(result: ParseResult): {
  totalMessages: number
  uniqueSenders: number
  systemMessages: number
  dateRange: { start: Date; end: Date }
  topSenders: { name: string; count: number }[]
} {
  const senderCounts = new Map<string, number>()
  let systemMessageCount = 0

  for (const message of result.messages) {
    if (message.isSystemMessage) {
      systemMessageCount++
      continue
    }

    const count = senderCounts.get(message.senderName) || 0
    senderCounts.set(message.senderName, count + 1)
  }

  const topSenders = Array.from(senderCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalMessages: result.messages.length,
    uniqueSenders: senderCounts.size,
    systemMessages: systemMessageCount,
    dateRange: result.dateRange,
    topSenders,
  }
}
