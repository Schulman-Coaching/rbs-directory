'use client'

import { useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import {
  Phone, Clock, Heart, Calendar, Percent, Newspaper, Users,
  BookOpen, Sparkles, Wrench, PartyPopper, Home, Store, RefreshCw,
  Gift, Trophy, Music, Palette, GraduationCap, Tent
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone,
  Clock,
  Heart,
  Calendar,
  Percent,
  Newspaper,
  Users,
  BookOpen,
  Sparkles,
  Wrench,
  PartyPopper,
  Home,
  Store,
  RefreshCw,
  Gift,
  Trophy,
  Music,
  Palette,
  GraduationCap,
  Tent,
  Music2: Music,
}

interface CategoryCardProps {
  category: Category
  listingsCount?: number
  variant?: 'default' | 'compact' | 'large'
  className?: string
}

export function CategoryCard({
  category,
  listingsCount,
  variant = 'default',
  className
}: CategoryCardProps) {
  const locale = useLocale()
  const IconComponent = category.icon ? iconMap[category.icon] || Users : Users

  // Use Hebrew name for Hebrew locale, English otherwise
  const displayName = locale === 'he' ? category.nameHe : category.name

  if (variant === 'compact') {
    return (
      <Link href={`/categories/${category.slug}`}>
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors',
          className
        )}>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{displayName}</h3>
            {listingsCount !== undefined && (
              <p className="text-xs text-muted-foreground">{listingsCount} items</p>
            )}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'large') {
    return (
      <Link href={`/categories/${category.slug}`}>
        <Card className={cn(
          'group overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1',
          className
        )}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{displayName}</h3>
            <p className="text-sm text-muted-foreground">
              {locale === 'he' ? category.name : category.nameHe}
            </p>
            {listingsCount !== undefined && (
              <p className="text-xs text-muted-foreground mt-2">{listingsCount} items</p>
            )}
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className={cn(
        'group overflow-hidden hover:shadow-md transition-all hover:border-primary/50',
        className
      )}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate group-hover:text-primary transition-colors">
              {displayName}
            </h3>
            {category.description && (
              <p className="text-sm text-muted-foreground truncate">{category.description}</p>
            )}
          </div>
          {listingsCount !== undefined && (
            <span className="text-sm text-muted-foreground">{listingsCount}</span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
