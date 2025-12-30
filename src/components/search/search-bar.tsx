'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  placeholder = 'חפש חוגים, שירותים, עסקים...',
  size = 'default',
  className,
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

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
        'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
        size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
      )} />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          'pr-10',
          size === 'lg' && 'h-14 text-lg pr-12',
          query && 'pl-10'
        )}
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'absolute left-1 top-1/2 -translate-y-1/2',
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
