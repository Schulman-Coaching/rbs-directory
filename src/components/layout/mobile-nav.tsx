'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { Home, Search, Grid3X3, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()
  const t = useTranslations('common')
  const tNav = useTranslations('nav')

  const navItems = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/search', icon: Search, label: t('search') },
    { href: '/categories', icon: Grid3X3, label: t('viewAll') },
    { href: '/account/favorites', icon: Heart, label: tNav('favorites') },
    { href: '/account', icon: User, label: tNav('myAccount') },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'fill-current')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
