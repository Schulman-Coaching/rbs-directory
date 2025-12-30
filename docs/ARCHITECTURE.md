# RBS Directory - Platform Architecture

## Project Overview

A web-based community marketplace that centralizes all after-school extracurricular activities, local businesses, and community services in Ramat Beit Shemesh (RBS), Israel.

**Mission:** Remove fragmentation and guesswork by combining discovery, messaging, scheduling, booking, and payment into a single trusted platform - serving both families looking for activities and providers seeking visibility.

---

## User Types

### 1. Parents/Clients (Demand Side)
- Browse and discover activities/services
- Filter by age, gender, location, language, time, school
- Book and pay for activities
- Message providers directly
- Message other parents in same class (like WhatsApp groups)

### 2. Providers (Supply Side)
- Activity providers (chugim, tutors, clubs)
- Local businesses
- Service providers
- List offerings, manage availability
- Accept bookings and payments
- Send promotional messages

### 3. Administrators
- Manage platform content
- Approve listings
- Handle support
- Analytics dashboard

---

## Core Features

### Discovery & Search
- Category-based browsing
- Advanced filtering (age, gender, location, language, time of day, instructor gender, schools)
- AI-powered search assistant
- "You May Also Like" recommendations

### Booking & Scheduling
- View provider schedules
- Online booking
- Add to Google Calendar integration
- Automated reminders & confirmations

### Messaging
- Direct messaging to providers
- Group messaging (parents in same class)
- Direct calling from app

### Payments
- Online payment processing
- Booking convenience fees (₪1-₪3)
- Subscription management

### Community Features
- Community message boards per category
- WhatsUp RBS (activities, trips, performances)
- Buy/Sell/Swap marketplace
- Gemachs directory

---

## Category Structure

### Main Categories
1. **Emergency #s** - Emergency contacts and services
2. **Zmanim for RBS** - Local prayer times
3. **Services** - Lemaan Achai, Hakshiva, Hatzalah, Kupa Shel Tzedakah, Nefesh B'Nefesh
4. **WhatsUp RBS** - Activities, trips, plays, performances
5. **Sales & Special Deals** - Minimum 30% discount deals
6. **Beit Shemesh News/Iriyah Updates**
7. **Kids & Teens** - Chugim, Camps, Babysitting
8. **Seniors** - Beautube, shiurim, trips, graybeard tours, milabev, services
9. **Community** - Shiurim, Trips, Retreats
10. **Activities/Entertainment**
11. **Courses & Learning** - Hair, makeup, carpentry, martial arts (adults)
12. **Beauty** - Facials, nails, electrolysis, makeup, hair
13. **Home Improvement** - Repairs, painters, hardware, handyman, plumber, electrician, movers
14. **Simcha Directory** - Videographers, photographers, makeup, caterers, halls, musicians
15. **Health & Wellness** - Essential oils, chiro, health food, acupuncture, therapists, yoga, reflexology
16. **Real Estate** - Long/short-term rentals, homes/apartments for sale, vacation apartments
17. **Stores & Businesses** - Butchers, lawyers, accountants, shoe stores, clothing
18. **Home Based Businesses** - Food, art, jewelers, library, laundry services
19. **Buy/Sell/Swap**
20. **Gemachs**

### Kids & Teens Subcategories

#### Activities
- Laser Tag, Jeeping, Pool Rentals, iJump, Bouncy Castles, Cotton Candy, Bungee Jumping

#### Sports
- Surfing, Football, Baseball, Soccer, Basketball, Martial Arts, Biking (Geerz), Spinning, Swimming

#### Dance & Movement
- Ballet, Gymnastics, Yoga, Aerobics, Dance, Pilates, Zumba

#### Chugim & Lessons
- Sports, Art, Music, Tutoring, Dance & Movement, English Lessons, Sewing, Carpentry, Hair & Makeup, Food & Baking

---

## Monetization Model

### From Providers (Supply Side)

#### 1. Monthly Subscription Tiers

**Free Tier:**
- Basic listing (name, contact, 4 pics, location, short description)
- Limited photos
- No promotional features

**Standard Tier:**
- More photos and videos
- Branding (logo, custom colors)
- Schedule posting

**Premium Tier:**
- Top placement in search
- Highlighted "Recommended" listings
- "You May Also Like" cross-promotion
- Ability to post promotions
- Google Calendar integration
- Automated reminders & confirmations
- School-based visibility restrictions
- Weekly Spotlight on homepage
- Marketing carousel placement
- Newsletter features
- Testimonials

#### 2. Ad Placement
- "Sponsored Activity" badges
- Category page banners
- Weekly "Top Activities Near You" emails/push notifications
- Sponsored content articles

#### 3. Analytics Dashboard (Future)
- Views, clicks, inquiries tracking

### From Parents (Demand Side)

#### 1. Premium Subscription (₪10-₪20/month)
- Early access to popular club registration
- Discounts on selected activities
- Advanced search filters (special needs, bilingual, religious-only)
- Favorites and comparison tools
- Weekly AI activity recommendations
- Ad-free experience

#### 2. Paid Trial Bundles
- "₪50 Activity Sampler" - Try 5 different clubs once
- Clubs provide discounted trials, platform takes management fee

#### 3. Booking Convenience Fee
- ₪1-₪3 per booking

#### 4. Loyalty Program
- Physical/digital card with discounts
- Partner business cross-promotions

### Hybrid Revenue

#### 1. Dynamic Pricing for Visibility
- Providers bid for top placement per category (simplified Google Ads model)

#### 2. Activity Pass Program
- Parents pay monthly fee for discounted activities
- Clubs get new clients

---

## Technical Architecture

### Tech Stack

```
Frontend:        Next.js 14 (App Router)
Styling:         Tailwind CSS + shadcn/ui
Database:        PostgreSQL (Supabase)
ORM:             Prisma
Authentication:  NextAuth.js / Supabase Auth
Payments:        Stripe (with Israeli shekel support)
File Storage:    Supabase Storage / Cloudflare R2
Search:          Algolia or Meilisearch
Messaging:       Real-time via Supabase Realtime
Email:           Resend or SendGrid
Push:            OneSignal or Firebase Cloud Messaging
AI:              OpenAI API for search assistant
Hosting:         Vercel
```

### Database Schema (High-Level)

```
Users
├── id, email, password_hash, role (parent/provider/admin)
├── profile (name, phone, location, avatar)
└── preferences (notification_settings, language)

Providers
├── id, user_id, business_name, description
├── subscription_tier, subscription_expires
├── contact_info, location, hours
└── branding (logo, colors)

Listings
├── id, provider_id, title, description
├── category_id, subcategory_id
├── price, duration, age_range
├── schedule, location
├── images, videos
└── status (active/pending/archived)

Categories
├── id, name, parent_id
├── icon, description
└── display_order

Bookings
├── id, listing_id, user_id
├── date, time, status
├── payment_status, amount
└── notes

Messages
├── id, sender_id, recipient_id
├── listing_id (optional)
├── content, read_at
└── created_at

Reviews/References
├── id, listing_id, user_id
├── is_reference (not public review)
└── content, created_at

Favorites
├── user_id, listing_id
└── created_at

Subscriptions
├── id, user_id, tier
├── stripe_subscription_id
├── status, expires_at
└── features_enabled
```

### API Routes Structure

```
/api
├── /auth
│   ├── /login
│   ├── /register
│   └── /[...nextauth]
├── /users
│   ├── /profile
│   └── /preferences
├── /providers
│   ├── /[id]
│   ├── /listings
│   └── /analytics
├── /listings
│   ├── /search
│   ├── /[id]
│   ├── /categories
│   └── /featured
├── /bookings
│   ├── /create
│   ├── /[id]
│   └── /calendar
├── /messages
│   ├── /conversations
│   ├── /send
│   └── /[id]
├── /payments
│   ├── /create-intent
│   ├── /webhook
│   └── /subscriptions
└── /admin
    ├── /listings/approve
    ├── /users
    └── /analytics
```

### Frontend Pages Structure

```
/
├── (marketing)
│   ├── page.tsx (landing)
│   ├── about
│   └── pricing
├── (auth)
│   ├── login
│   ├── register
│   └── forgot-password
├── (main)
│   ├── search
│   ├── categories/[slug]
│   ├── listings/[id]
│   ├── providers/[id]
│   └── bookings
├── (dashboard)
│   ├── parent
│   │   ├── favorites
│   │   ├── bookings
│   │   ├── messages
│   │   └── settings
│   └── provider
│       ├── listings
│       ├── bookings
│       ├── messages
│       ├── analytics
│       └── settings
└── (admin)
    ├── dashboard
    ├── listings
    ├── users
    └── reports
```

---

## Phase 1 MVP Features

1. **User Authentication** - Register/login for parents and providers
2. **Provider Listings** - Create, edit, manage listings
3. **Category Browsing** - Browse by category with basic filters
4. **Search** - Text search with category/location filters
5. **Listing Details** - View full listing info, schedule, contact
6. **Direct Messaging** - Contact provider through platform
7. **Basic Booking** - Request booking (manual confirmation)
8. **Provider Dashboard** - Manage listings and view inquiries

## Phase 2 Features

1. **Online Payments** - Stripe integration
2. **Subscription Tiers** - Free/Standard/Premium for providers
3. **Advanced Filters** - Age, gender, language, time, etc.
4. **Google Calendar** - Integration for bookings
5. **Automated Notifications** - Email/push for bookings
6. **Parent Premium** - Subscription features

## Phase 3 Features

1. **AI Search Assistant** - Natural language search
2. **Community Features** - Message boards, WhatsUp RBS
3. **Analytics Dashboard** - For premium providers
4. **Activity Sampler** - Trial bundles
5. **Loyalty Program** - Discounts and rewards
6. **Mobile App** - React Native wrapper

---

## Security Considerations

- No public reviews (reference system instead)
- School-based listing visibility restrictions
- Liability forms for providers
- Payment PCI compliance via Stripe
- Hebrew/English language support
- GDPR-like privacy compliance

---

## Marketing Strategy

- WhatsApp group promotion (schools, grades)
- Provider email lists
- Circulars distribution
- Featured provider sponsorships for initial exposure
