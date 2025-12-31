// Test script for WhatsApp parser
import * as fs from 'fs'
import { parseWhatsAppExport, getExportStats, isValidWhatsAppExport } from './src/lib/whatsapp/parser'
import {
  PHONE_PATTERNS,
  PRICE_PATTERNS,
  SERVICE_REQUEST_PATTERNS,
  RECOMMENDATION_PATTERNS,
  extractPhoneNumbers,
  extractPrices
} from './src/lib/whatsapp/patterns'

const filePath = '/Users/elieschulman/Downloads/WhatsApp Chat - RBS PROPERTY GROUP (both agent_non-agent fee)/_chat.txt'

console.log('Reading file...')
const content = fs.readFileSync(filePath, 'utf-8')

console.log('\n=== VALIDATION ===')
console.log('Is valid WhatsApp export:', isValidWhatsAppExport(content))

console.log('\n=== PARSING ===')
const result = parseWhatsAppExport(content)
console.log('Success:', result.success)
console.log('Total messages:', result.messages.length)
console.log('Group name:', result.groupName)
console.log('Date range:', result.dateRange.start.toLocaleDateString(), 'to', result.dateRange.end.toLocaleDateString())

console.log('\n=== STATISTICS ===')
const stats = getExportStats(result)
console.log('Unique senders:', stats.uniqueSenders)
console.log('System messages:', stats.systemMessages)
console.log('\nTop 10 senders:')
stats.topSenders.forEach((s, i) => {
  console.log(`  ${i + 1}. ${s.name}: ${s.count} messages`)
})

console.log('\n=== SAMPLE MESSAGES ===')
result.messages.slice(2, 7).forEach((m, i) => {
  console.log(`\n--- Message ${i + 1} ---`)
  console.log('Sender:', m.senderName)
  console.log('Time:', m.timestamp.toLocaleDateString())
  console.log('Content:', m.content.substring(0, 200) + (m.content.length > 200 ? '...' : ''))
})

console.log('\n=== ENTITY EXTRACTION (Sample) ===')
// Test entity extraction on non-system messages
const testMessages = result.messages.filter(m => !m.isSystemMessage && m.content.length > 50).slice(0, 30)

let phonesFound = 0
let pricesFound = 0
let requestsFound = 0
let recommendationsFound = 0

testMessages.forEach(m => {
  const phones = extractPhoneNumbers(m.content)
  const prices = extractPrices(m.content)

  // Check for service requests
  let isRequest = false
  for (const [, pattern] of Object.entries(SERVICE_REQUEST_PATTERNS)) {
    if (pattern.test(m.content)) {
      isRequest = true
      break
    }
  }

  // Check for recommendations
  let hasRecommendation = false
  for (const [key, pattern] of Object.entries(RECOMMENDATION_PATTERNS)) {
    if (pattern.test(m.content)) {
      hasRecommendation = true
      break
    }
  }

  if (phones.length > 0) phonesFound++
  if (prices.length > 0) pricesFound++
  if (isRequest) requestsFound++
  if (hasRecommendation) recommendationsFound++

  if (phones.length > 0 || prices.length > 0 || isRequest || hasRecommendation) {
    console.log(`\n[${m.senderName}]`)
    console.log(`"${m.content.substring(0, 150)}..."`)
    if (phones.length > 0) console.log('  📞 Phones:', phones)
    if (prices.length > 0) console.log('  💰 Prices:', prices)
    if (isRequest) console.log('  🔍 Service Request detected')
    if (hasRecommendation) console.log('  ⭐ Recommendation detected')
  }
})

console.log('\n=== EXTRACTION SUMMARY ===')
console.log(`Messages with phones: ${phonesFound}`)
console.log(`Messages with prices: ${pricesFound}`)
console.log(`Service requests: ${requestsFound}`)
console.log(`Recommendations: ${recommendationsFound}`)

console.log('\n=== DONE ===')
