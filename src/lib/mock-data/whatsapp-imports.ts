// Mock WhatsApp import data for RBS Directory

import type {
  WhatsAppImport,
  WhatsAppMessage,
  ExtractedEntity,
  ProviderCommunityStats,
  CommunityInsight,
  EntityData,
} from '@/types/whatsapp'

// Mock WhatsApp imports
export const whatsappImports: WhatsAppImport[] = [
  {
    id: 'import-1',
    fileName: 'הורים-רמבש-א.txt',
    fileSize: 1248000,
    uploadedBy: 'admin-1',
    status: 'COMPLETED',
    messageCount: 1543,
    extractedEntitiesCount: 87,
    dateRangeStart: new Date('2024-10-01'),
    dateRangeEnd: new Date('2024-12-15'),
    groupName: 'הורים רמב״ש א׳',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'import-2',
    fileName: 'חוגים-המלצות.txt',
    fileSize: 856000,
    uploadedBy: 'admin-1',
    status: 'COMPLETED',
    messageCount: 892,
    extractedEntitiesCount: 124,
    dateRangeStart: new Date('2024-09-01'),
    dateRangeEnd: new Date('2024-12-10'),
    groupName: 'חוגים והמלצות רמב״ש',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    id: 'import-3',
    fileName: 'parents-rbs-english.txt',
    fileSize: 524000,
    uploadedBy: 'admin-1',
    status: 'COMPLETED',
    messageCount: 456,
    extractedEntitiesCount: 45,
    dateRangeStart: new Date('2024-11-01'),
    dateRangeEnd: new Date('2024-12-12'),
    groupName: 'RBS English Parents',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'import-4',
    fileName: 'שכונה-ב-כללי.txt',
    fileSize: 2100000,
    uploadedBy: 'admin-1',
    status: 'PROCESSING',
    messageCount: 2340,
    extractedEntitiesCount: 0,
    dateRangeStart: new Date('2024-08-01'),
    dateRangeEnd: new Date('2024-12-14'),
    groupName: 'רמב״ש ב׳ - קבוצה כללית',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14'),
  },
  {
    id: 'import-5',
    fileName: 'failed-import.txt',
    fileSize: 15000,
    uploadedBy: 'admin-1',
    status: 'FAILED',
    messageCount: 0,
    extractedEntitiesCount: 0,
    processingError: 'Invalid file format: could not detect WhatsApp message patterns',
    createdAt: new Date('2024-12-13'),
    updatedAt: new Date('2024-12-13'),
  },
]

// Mock WhatsApp messages (sample)
export const whatsappMessages: WhatsAppMessage[] = [
  {
    id: 'msg-1',
    importId: 'import-1',
    timestamp: new Date('2024-12-10T14:30:00'),
    senderName: 'רחל כהן',
    content: 'מישהו מכיר את Geerz Biking? שמעתי שהם מעולים לילדים',
    isSystemMessage: false,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'msg-2',
    importId: 'import-1',
    timestamp: new Date('2024-12-10T14:32:00'),
    senderName: 'שרה לוי',
    content: 'כן! ממליצה בחום! הבן שלי עשה אצלם קורס והוא נהנה מאוד. מקצועיים ובטיחותיים.',
    isSystemMessage: false,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'msg-3',
    importId: 'import-1',
    timestamp: new Date('2024-12-10T15:00:00'),
    senderName: 'מיכל אברהם',
    content: 'מחפשת שיעורי ריקוד לבת בגיל 8, מישהי מכירה מורה טובה באזור?',
    isSystemMessage: false,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'msg-4',
    importId: 'import-1',
    timestamp: new Date('2024-12-10T15:05:00'),
    senderName: 'יעל דוד',
    content: 'רוקדים מהלב - סטודיו מעולה! הבת שלי שם כבר שנתיים. 052-555-1234',
    isSystemMessage: false,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'msg-5',
    importId: 'import-2',
    timestamp: new Date('2024-12-08T10:00:00'),
    senderName: 'דני גולד',
    content: 'יש לכם המלצה לאימון כדורגל לילד בן 7? מחפש משהו לא יקר מדי, עד 200 ש"ח לחודש',
    isSystemMessage: false,
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'msg-6',
    importId: 'import-2',
    timestamp: new Date('2024-12-08T10:15:00'),
    senderName: 'אבי כץ',
    content: 'Soccer Stars Academy - אימונים ברמה גבוהה, המאמנים מקצועיים. בנינו הרשום שם והוא מתקדם יפה.',
    isSystemMessage: false,
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'msg-7',
    importId: 'import-3',
    timestamp: new Date('2024-12-05T09:00:00'),
    senderName: 'Sarah Gold',
    content: 'Looking for SAT prep courses. Anyone have recommendations?',
    isSystemMessage: false,
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'msg-8',
    importId: 'import-3',
    timestamp: new Date('2024-12-05T09:30:00'),
    senderName: 'Rachel Green',
    content: 'Try Excel Tutoring Center - they have great SAT prep. My daughter scored 1480 after their course!',
    isSystemMessage: false,
    createdAt: new Date('2024-12-10'),
  },
]

// Mock extracted entities
export const extractedEntities: ExtractedEntity[] = [
  // Provider mentions
  {
    id: 'entity-1',
    importId: 'import-1',
    messageId: 'msg-1',
    entityType: 'PROVIDER_MENTION',
    providerId: 'prov-1', // Geerz Biking
    rawText: 'מישהו מכיר את Geerz Biking? שמעתי שהם מעולים לילדים',
    extractedData: {
      type: 'PROVIDER_MENTION',
      businessName: 'Geerz Biking',
      context: 'שמעתי שהם מעולים לילדים',
      mentionType: 'DIRECT',
    } as EntityData,
    confidence: 0.95,
    sentiment: 'POSITIVE',
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'entity-2',
    importId: 'import-1',
    messageId: 'msg-2',
    entityType: 'RECOMMENDATION',
    providerId: 'prov-1', // Geerz Biking
    rawText: 'כן! ממליצה בחום! הבן שלי עשה אצלם קורס והוא נהנה מאוד. מקצועיים ובטיחותיים.',
    extractedData: {
      type: 'RECOMMENDATION',
      businessName: 'Geerz Biking',
      recommendationType: 'RECOMMEND',
      reason: 'הבן שלי עשה אצלם קורס והוא נהנה מאוד. מקצועיים ובטיחותיים.',
    } as EntityData,
    confidence: 0.92,
    sentiment: 'POSITIVE',
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'entity-3',
    importId: 'import-1',
    messageId: 'msg-3',
    entityType: 'SERVICE_REQUEST',
    rawText: 'מחפשת שיעורי ריקוד לבת בגיל 8, מישהי מכירה מורה טובה באזור?',
    extractedData: {
      type: 'SERVICE_REQUEST',
      serviceType: 'dance',
      description: 'שיעורי ריקוד לבת בגיל 8',
      ageRange: '8',
      isLead: true,
    } as EntityData,
    confidence: 0.88,
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'entity-4',
    importId: 'import-1',
    messageId: 'msg-4',
    entityType: 'PROVIDER_MENTION',
    providerId: 'prov-2', // רוקדים מהלב
    rawText: 'רוקדים מהלב - סטודיו מעולה!',
    extractedData: {
      type: 'PROVIDER_MENTION',
      businessName: 'רוקדים מהלב',
      context: 'סטודיו מעולה! הבת שלי שם כבר שנתיים.',
      mentionType: 'DIRECT',
    } as EntityData,
    confidence: 0.94,
    sentiment: 'POSITIVE',
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'entity-5',
    importId: 'import-1',
    messageId: 'msg-4',
    entityType: 'CONTACT_INFO',
    rawText: '052-555-1234',
    extractedData: {
      type: 'CONTACT_INFO',
      phone: '052-555-1234',
      associatedName: 'רוקדים מהלב',
    } as EntityData,
    confidence: 0.99,
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'entity-6',
    importId: 'import-2',
    messageId: 'msg-5',
    entityType: 'SERVICE_REQUEST',
    rawText: 'יש לכם המלצה לאימון כדורגל לילד בן 7? מחפש משהו לא יקר מדי, עד 200 ש"ח לחודש',
    extractedData: {
      type: 'SERVICE_REQUEST',
      serviceType: 'sports',
      description: 'אימון כדורגל לילד בן 7',
      ageRange: '7',
      urgency: 'MEDIUM',
      isLead: true,
    } as EntityData,
    confidence: 0.91,
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'entity-7',
    importId: 'import-2',
    messageId: 'msg-5',
    entityType: 'PRICING',
    rawText: 'עד 200 ש"ח לחודש',
    extractedData: {
      type: 'PRICING',
      amount: 200,
      currency: 'ILS',
      priceType: 'MONTHLY',
      serviceDescription: 'אימון כדורגל',
    } as EntityData,
    confidence: 0.95,
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'entity-8',
    importId: 'import-2',
    messageId: 'msg-6',
    entityType: 'RECOMMENDATION',
    providerId: 'prov-3', // Soccer Stars Academy
    rawText: 'Soccer Stars Academy - אימונים ברמה גבוהה, המאמנים מקצועיים.',
    extractedData: {
      type: 'RECOMMENDATION',
      businessName: 'Soccer Stars Academy',
      recommendationType: 'RECOMMEND',
      reason: 'אימונים ברמה גבוהה, המאמנים מקצועיים',
    } as EntityData,
    confidence: 0.90,
    sentiment: 'POSITIVE',
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'entity-9',
    importId: 'import-3',
    messageId: 'msg-7',
    entityType: 'SERVICE_REQUEST',
    rawText: 'Looking for SAT prep courses. Anyone have recommendations?',
    extractedData: {
      type: 'SERVICE_REQUEST',
      serviceType: 'tutoring',
      description: 'SAT prep courses',
      isLead: true,
    } as EntityData,
    confidence: 0.89,
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'entity-10',
    importId: 'import-3',
    messageId: 'msg-8',
    entityType: 'RECOMMENDATION',
    providerId: 'prov-6', // Excel Tutoring
    rawText: 'Try Excel Tutoring Center - they have great SAT prep.',
    extractedData: {
      type: 'RECOMMENDATION',
      businessName: 'Excel Tutoring Center',
      recommendationType: 'RECOMMEND',
      reason: 'daughter scored 1480 after their course',
    } as EntityData,
    confidence: 0.93,
    sentiment: 'POSITIVE',
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-12-10'),
  },
  // Pending entities for admin review
  {
    id: 'entity-11',
    importId: 'import-2',
    messageId: 'msg-6',
    entityType: 'PROVIDER_MENTION',
    rawText: 'מכון הנגינה המוזיקלית - שמעתי שהם טובים',
    extractedData: {
      type: 'PROVIDER_MENTION',
      businessName: 'מכון הנגינה המוזיקלית',
      context: 'שמעתי שהם טובים',
      mentionType: 'INDIRECT',
    } as EntityData,
    confidence: 0.65,
    sentiment: 'NEUTRAL',
    approvalStatus: 'PENDING',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'entity-12',
    importId: 'import-2',
    messageId: 'msg-6',
    entityType: 'CONTACT_INFO',
    rawText: 'תתקשרו ל 054-999-8888',
    extractedData: {
      type: 'CONTACT_INFO',
      phone: '054-999-8888',
    } as EntityData,
    confidence: 0.98,
    approvalStatus: 'PENDING',
    createdAt: new Date('2024-12-05'),
  },
]

// Helper functions

export function getImportById(id: string): WhatsAppImport | undefined {
  return whatsappImports.find(i => i.id === id)
}

export function getImportsByStatus(status: WhatsAppImport['status']): WhatsAppImport[] {
  return whatsappImports.filter(i => i.status === status)
}

export function getMessagesByImport(importId: string): WhatsAppMessage[] {
  return whatsappMessages.filter(m => m.importId === importId)
}

export function getEntitiesByImport(importId: string): ExtractedEntity[] {
  return extractedEntities.filter(e => e.importId === importId)
}

export function getEntitiesByProvider(providerId: string): ExtractedEntity[] {
  return extractedEntities.filter(
    e => e.providerId === providerId && e.approvalStatus === 'APPROVED'
  )
}

export function getEntitiesByType(entityType: ExtractedEntity['entityType']): ExtractedEntity[] {
  return extractedEntities.filter(
    e => e.entityType === entityType && e.approvalStatus === 'APPROVED'
  )
}

export function getPendingEntities(): ExtractedEntity[] {
  return extractedEntities.filter(e => e.approvalStatus === 'PENDING')
}

export function getProviderStats(providerId: string): ProviderCommunityStats {
  const entities = getEntitiesByProvider(providerId)

  const mentions = entities.filter(e =>
    e.entityType === 'PROVIDER_MENTION' || e.entityType === 'RECOMMENDATION'
  )

  const positiveCount = mentions.filter(e => e.sentiment === 'POSITIVE').length
  const neutralCount = mentions.filter(e => e.sentiment === 'NEUTRAL').length
  const negativeCount = mentions.filter(e => e.sentiment === 'NEGATIVE').length

  const recommendations = entities.filter(e => e.entityType === 'RECOMMENDATION')
  const leads = extractedEntities.filter(
    e => e.entityType === 'SERVICE_REQUEST' && e.approvalStatus === 'APPROVED'
  )

  // Get most recent mention date
  const mentionDates = mentions.map(e => e.createdAt.getTime())
  const lastMentionDate = mentionDates.length > 0
    ? new Date(Math.max(...mentionDates))
    : undefined

  return {
    providerId,
    totalMentions: mentions.length,
    positiveCount,
    neutralCount,
    negativeCount,
    recommendationCount: recommendations.length,
    leadCount: leads.length,
    lastMentionDate,
    recentMentions: mentions.slice(0, 5),
  }
}

export function getRecentLeads(limit = 10): ExtractedEntity[] {
  return extractedEntities
    .filter(e => e.entityType === 'SERVICE_REQUEST' && e.approvalStatus === 'APPROVED')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export function getRecentRecommendations(limit = 10): ExtractedEntity[] {
  return extractedEntities
    .filter(e => e.entityType === 'RECOMMENDATION' && e.approvalStatus === 'APPROVED')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export function getCommunityInsights(): CommunityInsight[] {
  const insights: CommunityInsight[] = []

  // Get popular providers (by mention count)
  const providerMentions = new Map<string, number>()
  extractedEntities
    .filter(e => e.providerId && e.approvalStatus === 'APPROVED')
    .forEach(e => {
      const count = providerMentions.get(e.providerId!) || 0
      providerMentions.set(e.providerId!, count + 1)
    })

  // Convert to insights
  providerMentions.forEach((count, providerId) => {
    const entities = getEntitiesByProvider(providerId)
    const sentiments = entities.map(e => e.sentiment).filter(Boolean)
    const posCount = sentiments.filter(s => s === 'POSITIVE').length
    const overallSentiment = posCount > sentiments.length / 2 ? 'POSITIVE' : 'NEUTRAL'

    insights.push({
      id: `insight-${providerId}`,
      entityType: 'PROVIDER_MENTION',
      title: `Provider mentioned ${count} times`,
      titleHe: `הספק אוזכר ${count} פעמים`,
      description: entities[0]?.rawText || '',
      relatedProviderId: providerId,
      sentiment: overallSentiment as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE',
      mentionCount: count,
      sourceDate: entities[0]?.createdAt || new Date(),
    })
  })

  return insights.sort((a, b) => b.mentionCount - a.mentionCount)
}

// Stats for admin dashboard
export function getImportStats() {
  const total = whatsappImports.length
  const completed = whatsappImports.filter(i => i.status === 'COMPLETED').length
  const processing = whatsappImports.filter(i => i.status === 'PROCESSING').length
  const failed = whatsappImports.filter(i => i.status === 'FAILED').length

  const totalMessages = whatsappImports.reduce((sum, i) => sum + i.messageCount, 0)
  const totalEntities = extractedEntities.length
  const pendingReview = getPendingEntities().length

  return {
    total,
    completed,
    processing,
    failed,
    totalMessages,
    totalEntities,
    pendingReview,
  }
}
