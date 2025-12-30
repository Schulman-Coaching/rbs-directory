'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, User, Heart, MessageCircle, Bell, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'ילדים ונוער', nameEn: 'Kids & Teens', href: '/categories/kids-teens' },
  { name: 'בריאות', nameEn: 'Health', href: '/categories/health-wellness' },
  { name: 'שמחות', nameEn: 'Simcha', href: '/categories/simcha' },
  { name: 'עסקים', nameEn: 'Business', href: '/categories/stores-businesses' },
  { name: 'מבצעים', nameEn: 'Deals', href: '/categories/sales-deals' },
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">תפריט</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <hr className="my-2" />
              <Link href="/categories" className="text-lg font-medium hover:text-primary">
                כל הקטגוריות
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-lg p-2 font-bold text-lg">
            RBS
          </div>
          <span className="hidden sm:block font-bold text-xl">מדריך רמב״ש</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 mr-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                עוד
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/categories">כל הקטגוריות</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/categories/emergency">חירום</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/categories/services">שירותים</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/categories/gemachs">גמ״חים</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <form
            action="/search"
            className="relative"
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              type="search"
              placeholder="חפש חוגים, שירותים, עסקים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 w-full"
            />
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications - Desktop only */}
          <Button variant="ghost" size="icon" className="hidden md:flex relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Favorites */}
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <Link href="/account/favorites">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex relative">
            <Link href="/account/messages">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                2
              </span>
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/login">התחברות</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">הרשמה</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">החשבון שלי</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/favorites">מועדפים</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">פאנל ספק</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* For Providers CTA */}
          <Button asChild className="hidden md:flex">
            <Link href="/register?type=provider">לספקים</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
