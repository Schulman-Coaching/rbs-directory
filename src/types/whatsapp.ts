// WhatsApp Import Types for RBS Directory

export type ImportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type EntityType = 'PROVIDER_MENTION' | 'CONTACT_INFO' | 'PRICING' | 'SERVICE_REQUEST' | 'RECOMMENDATION'
export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// WhatsApp Import record
export interface WhatsAppImport {
  id: string
  fileName: string
  fileSize: number
  uploadedBy: string
  status: ImportStatus
  messageCount: number
  extractedEntitiesCount: number
  dateRangeStart?: Date
  dateRangeEnd?: Date
  groupName?: string
  processingError?: string
  createdAt: Date
  updatedAt: Date
}

// Parsed WhatsApp message
export interface WhatsAppMessage {
  id: string
  importId: string
  timestamp: Date
  senderName: string
  senderPhone?: string
  content: string
  isSystemMessage: boolean
  createdAt: Date
}

// Entity extracted from messages
export interface ExtractedEntity {
  id: string
  importId: string
  messageId: string
  entityType: EntityType
  providerId?: string
  listingId?: string
  rawText: string
  extractedData: EntityData
  confidence: number
  sentiment?: SentimentType
  approvalStatus: ApprovalStatus
  reviewedBy?: string
  reviewedAt?: Date
  createdAt: Date
}

// Union type for extracted data
export type EntityData =
  | ProviderMentionData
  | ContactInfoData
  | PricingData
  | ServiceRequestData
  | RecommendationData

// Provider mention data
export interface ProviderMentionData {
  type: 'PROVIDER_MENTION'
  businessName: string
  context: string
  mentionType: 'DIRECT' | 'INDIRECT'
}

// Contact info data
export interface ContactInfoData {
  type: 'CONTACT_INFO'
  phone?: string
  email?: string
  website?: string
  associatedName?: string
}

// Pricing discussion data
export interface PricingData {
  type: 'PRICING'
  amount?: number
  currency: string
  serviceDescription?: string
  priceType?: 'FIXED' | 'HOURLY' | 'MONTHLY' | 'RANGE'
  rangeMin?: number
  rangeMax?: number
}

// Service request (lead) data
export interface ServiceRequestData {
  type: 'SERVICE_REQUEST'
  serviceType: string
  description: string
  ageRange?: string
  neighborhood?: string
  urgency?: 'HIGH' | 'MEDIUM' | 'LOW'
  isLead: boolean
}

// Recommendation data
export interface RecommendationData {
  type: 'RECOMMENDATION'
  businessName: string
  recommendationType: 'RECOMMEND' | 'NOT_RECOMMEND' | 'NEUTRAL'
  reason?: string
}

// Aggregated provider stats from community
export interface ProviderCommunityStats {
  providerId: string
  totalMentions: number
  positiveCount: number
  neutralCount: number
  negativeCount: number
  recommendationCount: number
  leadCount: number
  lastMentionDate?: Date
  recentMentions: ExtractedEntity[]
}

// Community insight for display
export interface CommunityInsight {
  id: string
  entityType: EntityType
  title: string
  titleHe: string
  description: string
  relatedProviderId?: string
  relatedProviderName?: string
  sentiment?: SentimentType
  mentionCount: number
  sourceDate: Date
}

// Parser types
export interface ParsedMessage {
  timestamp: Date
  senderName: string
  senderPhone?: string
  content: string
  isSystemMessage: boolean
}

export interface ParseResult {
  success: boolean
  messages: ParsedMessage[]
  groupName?: string
  dateRange: {
    start: Date
    end: Date
  }
  errors: string[]
}

// Analysis result from AI service
export interface AnalysisResult {
  entities: ExtractedEntityInput[]
  processingTime: number
  tokensUsed?: number
}

export interface ExtractedEntityInput {
  messageIndex: number
  entityType: EntityType
  rawText: string
  extractedData: EntityData
  confidence: number
  sentiment?: SentimentType
}

// Form data for admin review
export interface EntityReviewAction {
  entityId: string
  action: 'APPROVE' | 'REJECT'
  providerId?: string
  listingId?: string
}
