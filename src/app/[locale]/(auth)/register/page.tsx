'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, Building2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type UserType = 'parent' | 'provider'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultType = searchParams.get('type') as UserType || 'parent'

  const [userType, setUserType] = useState<UserType>(defaultType)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      if (userType === 'provider') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    }, 1000)
  }

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">הרשמה</CardTitle>
        <CardDescription>
          צור חשבון חדש כדי להתחיל
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setUserType('parent')}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
              userType === 'parent'
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-muted-foreground/50'
            )}
          >
            <Users className={cn(
              'h-6 w-6',
              userType === 'parent' ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className={cn(
              'text-sm font-medium',
              userType === 'parent' ? 'text-primary' : ''
            )}>
              הורה / לקוח
            </span>
          </button>
          <button
            type="button"
            onClick={() => setUserType('provider')}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
              userType === 'provider'
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-muted-foreground/50'
            )}
          >
            <Building2 className={cn(
              'h-6 w-6',
              userType === 'provider' ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className={cn(
              'text-sm font-medium',
              userType === 'provider' ? 'text-primary' : ''
            )}>
              ספק / עסק
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              שם מלא
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="ישראל ישראלי"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pr-10"
                required
              />
            </div>
          </div>

          {userType === 'provider' && (
            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium">
                שם העסק
              </label>
              <div className="relative">
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessName"
                  type="text"
                  placeholder="שם העסק או החוג"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              אימייל
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              סיסמה
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 pl-10"
                dir="ltr"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              לפחות 8 תווים
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'נרשם...' : 'הירשם'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            בלחיצה על הירשם, את/ה מסכים/ה ל
            <Link href="/terms" className="text-primary hover:underline">תנאי השימוש</Link>
            {' '}ול
            <Link href="/privacy" className="text-primary hover:underline">מדיניות הפרטיות</Link>
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          יש לך כבר חשבון?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            התחבר
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
