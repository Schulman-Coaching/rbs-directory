// RBS Directory - Core Type Definitions

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'PARENT' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  location?: string;
  language: 'he' | 'en';
}

// ============================================
// PROVIDER TYPES
// ============================================

export type ProviderTier = 'FREE' | 'STANDARD' | 'PREMIUM';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING';

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  shortDescription?: string;
  phone?: string;
  email?: string;
  website?: string;
  location?: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  hours?: BusinessHours;
  logo?: string;
  brandColor?: string;
  subscriptionTier: ProviderTier;
  subscriptionExpiresAt?: Date;
  isVerified: boolean;
  isActive: boolean;
  images?: ProviderImage[];
}

export interface ProviderImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface BusinessHours {
  sunday?: DayHours;
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed?: boolean;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id: string;
  name: string;
  nameHe: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
  children?: Category[];
}

// Main categories for the platform
export const MAIN_CATEGORIES = [
  'emergency',
  'zmanim',
  'services',
  'whatsup-rbs',
  'sales-deals',
  'news',
  'kids-teens',
  'seniors',
  'community',
  'activities',
  'courses',
  'beauty',
  'home-improvement',
  'simcha',
  'health-wellness',
  'real-estate',
  'stores-businesses',
  'home-based-businesses',
  'buy-sell-swap',
  'gemachs',
] as const;

export type MainCategory = typeof MAIN_CATEGORIES[number];

// ============================================
// LISTING TYPES
// ============================================

export type PriceType = 'FIXED' | 'HOURLY' | 'PER_SESSION' | 'MONTHLY' | 'CONTACT' | 'FREE';
export type Gender = 'MALE' | 'FEMALE' | 'ALL';
export type ListingStatus = 'DRAFT' | 'PENDING' | 'ACTIVE' | 'ARCHIVED' | 'REJECTED';
export type SourceType = 'MANUAL' | 'CSV_IMPORT' | 'GOOGLE_SHEETS' | 'WHATSAPP';
export type SyncStatus = 'PENDING' | 'SYNCING' | 'SUCCESS' | 'FAILED';

export interface Listing {
  id: string;
  providerId: string;
  categoryId: string;
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  price?: number;
  priceType: PriceType;
  currency: string;
  duration?: number;
  ageMin?: number;
  ageMax?: number;
  gender?: Gender;
  instructorGender?: Gender;
  language: string[];
  maxParticipants?: number;
  location?: string;
  neighborhood?: string;
  isOnline: boolean;
  schedule?: WeeklySchedule;
  subsidies: string[];
  status: ListingStatus;
  isFeatured: boolean;
  featuredUntil?: Date;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  // Ingestion pipeline fields
  sourceType: SourceType;
  sourceId?: string;
  sourceUrl?: string;
  lastSyncedAt?: Date;
  syncEnabled: boolean;
  reviewNotes?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  // Relations
  images?: ListingImage[];
  provider?: Provider;
  category?: Category;
}

export interface ListingImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface WeeklySchedule {
  sunday?: TimeSlot[];
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  label?: string;
}

// ============================================
// BOOKING TYPES
// ============================================

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  date: Date;
  time?: string;
  status: BookingStatus;
  participants: number;
  notes?: string;
  totalAmount?: number;
  convenienceFee?: number;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  confirmedAt?: Date;
  canceledAt?: Date;
  cancelReason?: string;
  listing?: Listing;
  user?: User;
}

// ============================================
// MESSAGE TYPES
// ============================================

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  listingId?: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
  sender?: User;
  recipient?: User;
  listing?: Listing;
}

export interface Conversation {
  id: string;
  participantId: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
}

// ============================================
// SEARCH & FILTER TYPES
// ============================================

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  neighborhood?: string;
  ageMin?: number;
  ageMax?: number;
  gender?: Gender;
  instructorGender?: Gender;
  language?: string;
  priceMin?: number;
  priceMax?: number;
  dayOfWeek?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  isOnline?: boolean;
  schoolId?: string;
  subsidies?: string[];
}

export interface SearchResult {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export type UserTier = 'FREE' | 'PREMIUM';

export interface UserSubscription {
  id: string;
  userId: string;
  tier: UserTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface ProviderSubscription {
  id: string;
  providerId: string;
  tier: ProviderTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// FORM TYPES
// ============================================

export interface ListingFormData {
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  categoryId: string;
  price?: number;
  priceType: PriceType;
  duration?: number;
  ageMin?: number;
  ageMax?: number;
  gender?: Gender;
  instructorGender?: Gender;
  language: string[];
  maxParticipants?: number;
  location?: string;
  neighborhood?: string;
  isOnline: boolean;
  schedule?: WeeklySchedule;
  subsidies: string[];
}

export interface ProviderFormData {
  businessName: string;
  description?: string;
  shortDescription?: string;
  phone?: string;
  email?: string;
  website?: string;
  location?: string;
  neighborhood?: string;
  hours?: BusinessHours;
}

// ============================================
// RBS-SPECIFIC TYPES
// ============================================

export const RBS_NEIGHBORHOODS = [
  'רמת בית שמש א',
  'רמת בית שמש ב',
  'רמת בית שמש ג',
  'רמת בית שמש ד',
  'רמת בית שמש ה',
  'בית שמש הותיקה',
  'שעלבים',
] as const;

export type RBSNeighborhood = typeof RBS_NEIGHBORHOODS[number];

export const LANGUAGES = [
  { code: 'he', name: 'עברית', nameEn: 'Hebrew' },
  { code: 'en', name: 'English', nameEn: 'English' },
  { code: 'fr', name: 'Français', nameEn: 'French' },
  { code: 'ru', name: 'Русский', nameEn: 'Russian' },
  { code: 'es', name: 'Español', nameEn: 'Spanish' },
] as const;

export const SUBSIDIES = [
  'מאוחדת',
  'כללית',
  'מכבי',
  'לאומית',
] as const;

export type Subsidy = typeof SUBSIDIES[number];

// ============================================
// SYNC SOURCE TYPES
// ============================================

export interface SyncSource {
  id: string;
  name: string;
  sourceType: SourceType;
  sourceUrl: string;
  columnMapping?: ColumnMapping;
  syncSchedule?: string;
  lastSyncedAt?: Date;
  lastSyncStatus: SyncStatus;
  lastSyncError?: string;
  syncedCount: number;
  isActive: boolean;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  syncLogs?: SyncLog[];
}

export interface SyncLog {
  id: string;
  syncSourceId: string;
  status: SyncStatus;
  recordsFound: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors?: string[];
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface ColumnMapping {
  title?: string;
  titleHe?: string;
  description?: string;
  descriptionHe?: string;
  category?: string;
  price?: string;
  priceType?: string;
  phone?: string;
  email?: string;
  location?: string;
  neighborhood?: string;
  ageMin?: string;
  ageMax?: string;
  gender?: string;
  language?: string;
  [key: string]: string | undefined;
}

// ============================================
// WHATSAPP IMPORT TYPES
// ============================================

export * from './whatsapp';
