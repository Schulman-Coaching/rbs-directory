'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus, Search, MoreVertical, Eye, Edit, Trash2,
  Archive, CheckCircle, Clock, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'

// Mock provider listings
const mockListings = [
  {
    id: 'list-1',
    title: 'קורס אופני הרים לילדים',
    status: 'ACTIVE',
    price: 180,
    priceType: 'PER_SESSION',
    views: 234,
    bookings: 12,
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400',
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'list-2',
    title: 'סיור אופניים משפחתי',
    status: 'ACTIVE',
    price: 350,
    priceType: 'FIXED',
    views: 156,
    bookings: 8,
    image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400',
    updatedAt: new Date('2024-11-15'),
  },
  {
    id: 'list-3',
    title: 'שיעור פרטי',
    status: 'DRAFT',
    price: 200,
    priceType: 'HOURLY',
    views: 0,
    bookings: 0,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'list-4',
    title: 'קורס מתקדמים',
    status: 'PENDING',
    price: 220,
    priceType: 'PER_SESSION',
    views: 0,
    bookings: 0,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    updatedAt: new Date('2024-12-15'),
  },
]

const statusConfig = {
  ACTIVE: { label: 'פעיל', icon: CheckCircle, color: 'bg-green-500' },
  DRAFT: { label: 'טיוטה', icon: Edit, color: 'bg-muted' },
  PENDING: { label: 'ממתין לאישור', icon: Clock, color: 'bg-amber-500' },
  ARCHIVED: { label: 'בארכיון', icon: Archive, color: 'bg-muted' },
  REJECTED: { label: 'נדחה', icon: XCircle, color: 'bg-destructive' },
}

export default function ListingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredListings = mockListings.filter((listing) => {
    if (search && !listing.title.includes(search)) return false
    if (statusFilter !== 'all' && listing.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">השירותים שלי</h1>
          <p className="text-muted-foreground">נהל את כל השירותים והחוגים שלך</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <Plus className="h-4 w-4 ml-2" />
            הוסף שירות
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש שירות..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסטטוסים</SelectItem>
            <SelectItem value="ACTIVE">פעיל</SelectItem>
            <SelectItem value="DRAFT">טיוטה</SelectItem>
            <SelectItem value="PENDING">ממתין לאישור</SelectItem>
            <SelectItem value="ARCHIVED">בארכיון</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">אין שירותים להצגה</p>
            <Button asChild>
              <Link href="/dashboard/listings/new">
                <Plus className="h-4 w-4 ml-2" />
                הוסף שירות ראשון
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => {
            const status = statusConfig[listing.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <Card key={listing.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{listing.title}</h3>
                        <Badge variant="outline" className="gap-1 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${status.color}`} />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatPrice(listing.price)}
                        {listing.priceType === 'PER_SESSION' && ' / שיעור'}
                        {listing.priceType === 'HOURLY' && ' / שעה'}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{listing.views} צפיות</span>
                        <span>{listing.bookings} הזמנות</span>
                        <span>עודכן: {listing.updatedAt.toLocaleDateString('he-IL')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/listings/${listing.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/listings/${listing.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 ml-2" />
                            צפה
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 ml-2" />
                            ערוך
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 ml-2" />
                            העבר לארכיון
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 ml-2" />
                            מחק
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
