'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ListPlus, MessageCircle, Settings,
  ChevronLeft, Menu, Bell, User, Upload, Users, Target,
  MessageSquare, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// For demo, we assume the user is an admin
const isAdmin = true

const providerItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'סקירה כללית' },
  { href: '/dashboard/listings', icon: ListPlus, label: 'השירותים שלי' },
  { href: '/dashboard/mentions', icon: MessageSquare, label: 'אזכורים', badge: 12 },
  { href: '/dashboard/leads', icon: Target, label: 'לידים', badge: 5 },
  { href: '/dashboard/messages', icon: MessageCircle, label: 'הודעות', badge: 3 },
  { href: '/dashboard/settings', icon: Settings, label: 'הגדרות' },
]

const adminItems = [
  { href: '/dashboard/admin/imports', icon: Upload, label: 'ייבוא וואטסאפ' },
  { href: '/dashboard/admin/insights', icon: Users, label: 'תובנות קהילתיות' },
]

const sidebarItems = providerItems

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-lg p-2 font-bold">
            RBS
          </div>
          <span className="font-bold">מדריך רמב״ש</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  variant={isActive ? 'secondary' : 'default'}
                  className="h-5 min-w-5 flex items-center justify-center"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">
                <Shield className="h-3 w-3" />
                ניהול
              </div>
            </div>
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>GR</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">Geerz Biking</div>
            <div className="text-xs text-muted-foreground">פרימיום</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-l bg-card">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Back to Site */}
          <Link href="/" className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            חזרה לאתר
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                2
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
