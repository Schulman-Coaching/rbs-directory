'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  defaultValue?: string
  placeholder?: string
  size?: 'default' | 'lg'
  className?: string
  onSearch?: (query: string) => void
}

export function SearchBar({
  defaultValue = '',
  placeholder,
  size = 'default',
  className,
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const t = useTranslations('home')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleClear = () => {
    setQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className={cn(
        'absolute top-1/2 -translate-y-1/2 text-muted-foreground rtl:right-3 ltr:left-3',
        size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
      )} />
      <Input
        type="search"
        placeholder={placeholder || t('searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          'rtl:pr-10 ltr:pl-10',
          size === 'lg' && 'h-14 text-lg rtl:pr-12 ltr:pl-12',
          query && 'rtl:pl-10 ltr:pr-10'
        )}
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rtl:left-1 ltr:right-1',
            size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'
          )}
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  )
}
