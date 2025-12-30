import { Category } from '@/types'

export const categories: Category[] = [
  // Main Categories
  {
    id: 'cat-emergency',
    name: 'Emergency',
    nameHe: 'חירום',
    slug: 'emergency',
    description: 'Emergency contacts and services',
    icon: 'Phone',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-zmanim',
    name: 'Zmanim',
    nameHe: 'זמנים',
    slug: 'zmanim',
    description: 'Prayer times for RBS',
    icon: 'Clock',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-services',
    name: 'Services',
    nameHe: 'שירותים',
    slug: 'services',
    description: 'Community services - Lemaan Achai, Hakshiva, Hatzalah',
    icon: 'Heart',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-whatsup',
    name: 'WhatsUp RBS',
    nameHe: 'מה קורה ברמב״ש',
    slug: 'whatsup-rbs',
    description: 'Activities, trips, plays, performances',
    icon: 'Calendar',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-deals',
    name: 'Sales & Deals',
    nameHe: 'מבצעים',
    slug: 'sales-deals',
    description: 'Special deals - minimum 30% discount',
    icon: 'Percent',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'cat-news',
    name: 'News & Updates',
    nameHe: 'חדשות ועדכונים',
    slug: 'news',
    description: 'Beit Shemesh news and Iriyah updates',
    icon: 'Newspaper',
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'cat-kids',
    name: 'Kids & Teens',
    nameHe: 'ילדים ונוער',
    slug: 'kids-teens',
    description: 'Chugim, camps, babysitting for children and teenagers',
    icon: 'Users',
    displayOrder: 7,
    isActive: true,
    children: [
      {
        id: 'cat-kids-sports',
        name: 'Sports',
        nameHe: 'ספורט',
        slug: 'kids-sports',
        parentId: 'cat-kids',
        icon: 'Trophy',
        displayOrder: 1,
        isActive: true,
      },
      {
        id: 'cat-kids-dance',
        name: 'Dance & Movement',
        nameHe: 'ריקוד ותנועה',
        slug: 'kids-dance',
        parentId: 'cat-kids',
        icon: 'Music',
        displayOrder: 2,
        isActive: true,
      },
      {
        id: 'cat-kids-art',
        name: 'Art & Creativity',
        nameHe: 'אמנות ויצירה',
        slug: 'kids-art',
        parentId: 'cat-kids',
        icon: 'Palette',
        displayOrder: 3,
        isActive: true,
      },
      {
        id: 'cat-kids-music',
        name: 'Music',
        nameHe: 'מוזיקה',
        slug: 'kids-music',
        parentId: 'cat-kids',
        icon: 'Music2',
        displayOrder: 4,
        isActive: true,
      },
      {
        id: 'cat-kids-tutoring',
        name: 'Tutoring',
        nameHe: 'שיעורים פרטיים',
        slug: 'kids-tutoring',
        parentId: 'cat-kids',
        icon: 'GraduationCap',
        displayOrder: 5,
        isActive: true,
      },
      {
        id: 'cat-kids-camps',
        name: 'Camps',
        nameHe: 'קייטנות',
        slug: 'kids-camps',
        parentId: 'cat-kids',
        icon: 'Tent',
        displayOrder: 6,
        isActive: true,
      },
      {
        id: 'cat-kids-activities',
        name: 'Activities',
        nameHe: 'פעילויות',
        slug: 'kids-activities',
        parentId: 'cat-kids',
        icon: 'Sparkles',
        displayOrder: 7,
        isActive: true,
      },
    ],
  },
  {
    id: 'cat-seniors',
    name: 'Seniors',
    nameHe: 'גיל הזהב',
    slug: 'seniors',
    description: 'Activities and services for seniors',
    icon: 'Heart',
    displayOrder: 8,
    isActive: true,
  },
  {
    id: 'cat-community',
    name: 'Community',
    nameHe: 'קהילה',
    slug: 'community',
    description: 'Shiurim, trips, retreats',
    icon: 'Users',
    displayOrder: 9,
    isActive: true,
  },
  {
    id: 'cat-courses',
    name: 'Courses & Learning',
    nameHe: 'קורסים ולימודים',
    slug: 'courses',
    description: 'Adult courses - hair, makeup, carpentry, martial arts',
    icon: 'BookOpen',
    displayOrder: 10,
    isActive: true,
  },
  {
    id: 'cat-beauty',
    name: 'Beauty',
    nameHe: 'יופי וטיפוח',
    slug: 'beauty',
    description: 'Facials, nails, electrolysis, makeup, hair',
    icon: 'Sparkles',
    displayOrder: 11,
    isActive: true,
  },
  {
    id: 'cat-home',
    name: 'Home Improvement',
    nameHe: 'שיפוצים ותיקונים',
    slug: 'home-improvement',
    description: 'Repairs, painters, plumbers, electricians, movers',
    icon: 'Wrench',
    displayOrder: 12,
    isActive: true,
  },
  {
    id: 'cat-simcha',
    name: 'Simcha Directory',
    nameHe: 'ספריית שמחות',
    slug: 'simcha',
    description: 'Videographers, photographers, caterers, halls, musicians',
    icon: 'PartyPopper',
    displayOrder: 13,
    isActive: true,
  },
  {
    id: 'cat-health',
    name: 'Health & Wellness',
    nameHe: 'בריאות ואיכות חיים',
    slug: 'health-wellness',
    description: 'Chiro, therapists, yoga, reflexology, health retreats',
    icon: 'Heart',
    displayOrder: 14,
    isActive: true,
  },
  {
    id: 'cat-realestate',
    name: 'Real Estate',
    nameHe: 'נדל״ן',
    slug: 'real-estate',
    description: 'Rentals, apartments for sale, vacation apartments',
    icon: 'Home',
    displayOrder: 15,
    isActive: true,
  },
  {
    id: 'cat-stores',
    name: 'Stores & Businesses',
    nameHe: 'חנויות ועסקים',
    slug: 'stores-businesses',
    description: 'Butchers, lawyers, accountants, clothing stores',
    icon: 'Store',
    displayOrder: 16,
    isActive: true,
  },
  {
    id: 'cat-homebiz',
    name: 'Home Based Businesses',
    nameHe: 'עסקים מהבית',
    slug: 'home-businesses',
    description: 'Food, art, jewelers, laundry services',
    icon: 'Home',
    displayOrder: 17,
    isActive: true,
  },
  {
    id: 'cat-buysell',
    name: 'Buy/Sell/Swap',
    nameHe: 'קנייה/מכירה/החלפה',
    slug: 'buy-sell-swap',
    description: 'Community marketplace',
    icon: 'RefreshCw',
    displayOrder: 18,
    isActive: true,
  },
  {
    id: 'cat-gemachs',
    name: 'Gemachs',
    nameHe: 'גמ״חים',
    slug: 'gemachs',
    description: 'Community lending organizations',
    icon: 'Gift',
    displayOrder: 19,
    isActive: true,
  },
]

export const getFlatCategories = (): Category[] => {
  const flat: Category[] = []
  categories.forEach((cat) => {
    flat.push(cat)
    if (cat.children) {
      flat.push(...cat.children)
    }
  })
  return flat
}

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return getFlatCategories().find((cat) => cat.slug === slug)
}

export const getSubcategories = (parentId: string): Category[] => {
  const parent = categories.find((cat) => cat.id === parentId)
  return parent?.children || []
}

export const getMainCategories = (): Category[] => {
  return categories.filter((cat) => !cat.parentId)
}

export const getFeaturedCategories = (): Category[] => {
  const featured = ['cat-kids', 'cat-health', 'cat-simcha', 'cat-deals', 'cat-services', 'cat-home']
  return categories.filter((cat) => featured.includes(cat.id))
}
