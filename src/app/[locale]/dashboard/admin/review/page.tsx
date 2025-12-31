'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  CheckCircle, XCircle, Eye, Clock, Filter,
  ChevronDown, Loader2, AlertCircle, RotateCcw,
  FileSpreadsheet, MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Listing, SourceType, ListingStatus } from '@/types'

interface ReviewListing extends Listing {
  providerName?: string
}

interface StatusCounts {
  PENDING: number
  ACTIVE: number
  REJECTED: number
  DRAFT: number
  ARCHIVED: number
}

const SOURCE_TYPE_LABELS: Record<SourceType, { label: string; icon: React.ReactNode }> = {
  MANUAL: { label: 'ידני', icon: null },
  CSV_IMPORT: { label: 'CSV', icon: <FileSpreadsheet className="h-3 w-3" /> },
  GOOGLE_SHEETS: { label: 'גוגל שיטס', icon: <FileSpreadsheet className="h-3 w-3" /> },
  WHATSAPP: { label: 'וואטסאפ', icon: <MessageSquare className="h-3 w-3" /> },
}

export default function AdminReviewPage() {
  const t = useTranslations('admin')
  const [listings, setListings] = useState<ReviewListing[]>([])
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<ListingStatus>('PENDING')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  // Dialog state
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean
    listing: ReviewListing | null
    action: 'APPROVE' | 'REJECT' | null
  }>({ open: false, listing: null, action: null })
  const [reviewNotes, setReviewNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        ...(sourceFilter !== 'all' && { sourceType: sourceFilter }),
      })

      const response = await fetch(`/api/admin/review?${params}`)
      const data = await response.json()

      if (data.success) {
        setListings(data.data)
        setStatusCounts(data.statusCounts)
      } else {
        setError(data.error || 'Failed to fetch listings')
      }
    } catch (err) {
      setError('Failed to fetch listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [statusFilter, sourceFilter])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === listings.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(listings.map((l) => l.id))
    }
  }

  const openReviewDialog = (listing: ReviewListing, action: 'APPROVE' | 'REJECT') => {
    setReviewDialog({ open: true, listing, action })
    setReviewNotes('')
  }

  const handleReview = async () => {
    if (!reviewDialog.listing || !reviewDialog.action) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: reviewDialog.listing.id,
          action: reviewDialog.action,
          notes: reviewNotes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setReviewDialog({ open: false, listing: null, action: null })
        fetchListings()
      } else {
        setError(data.error || 'Review action failed')
      }
    } catch (err) {
      setError('Review action failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkAction = async (action: 'APPROVE' | 'REJECT') => {
    if (selectedIds.length === 0) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/review/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingIds: selectedIds,
          action,
        }),
      })

      const data = await response.json()

      if (data.success || data.stats?.success > 0) {
        setSelectedIds([])
        fetchListings()
      } else {
        setError(data.error || 'Bulk action failed')
      }
    } catch (err) {
      setError('Bulk action failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">אישור שירותים</h1>
          <p className="text-muted-foreground">ניהול תור האישורים לשירותים חדשים</p>
        </div>
        <Button variant="outline" onClick={fetchListings} disabled={loading}>
          <RotateCcw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
          רענן
        </Button>
      </div>

      {/* Status Tabs */}
      {statusCounts && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('PENDING')}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            ממתינים
            <Badge variant="secondary">{statusCounts.PENDING}</Badge>
          </Button>
          <Button
            variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('ACTIVE')}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            מאושרים
            <Badge variant="secondary">{statusCounts.ACTIVE}</Badge>
          </Button>
          <Button
            variant={statusFilter === 'REJECTED' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('REJECTED')}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            נדחו
            <Badge variant="secondary">{statusCounts.REJECTED}</Badge>
          </Button>
        </div>
      )}

      {/* Filters & Bulk Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="מקור" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המקורות</SelectItem>
                  <SelectItem value="MANUAL">ידני</SelectItem>
                  <SelectItem value="CSV_IMPORT">CSV</SelectItem>
                  <SelectItem value="GOOGLE_SHEETS">גוגל שיטס</SelectItem>
                  <SelectItem value="WHATSAPP">וואטסאפ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  נבחרו {selectedIds.length} שירותים
                </span>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('APPROVE')}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 ml-2" />
                      אשר נבחרים
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('REJECT')}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 ml-2" />
                  דחה נבחרים
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="mr-auto"
            >
              סגור
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Listings Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין שירותים {statusFilter === 'PENDING' ? 'ממתינים לאישור' : 'להצגה'}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === listings.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>שירות</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>מקור</TableHead>
                  <TableHead>נשלח</TableHead>
                  <TableHead className="text-left">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(listing.id)}
                        onCheckedChange={() => toggleSelect(listing.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {listing.titleHe || listing.title}
                        </div>
                        {listing.titleHe && listing.title && (
                          <div className="text-sm text-muted-foreground">
                            {listing.title}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{listing.categoryId}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {SOURCE_TYPE_LABELS[listing.sourceType]?.icon}
                        <span className="text-sm">
                          {SOURCE_TYPE_LABELS[listing.sourceType]?.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(listing.submittedAt || listing.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link href={`/dashboard/admin/review/${listing.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {statusFilter === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => openReviewDialog(listing, 'APPROVE')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => openReviewDialog(listing, 'REJECT')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onOpenChange={(open) =>
          !open && setReviewDialog({ open: false, listing: null, action: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.action === 'APPROVE' ? 'אישור שירות' : 'דחיית שירות'}
            </DialogTitle>
            <DialogDescription>
              {reviewDialog.listing?.titleHe || reviewDialog.listing?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">הערות (אופציונלי)</label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={
                  reviewDialog.action === 'REJECT'
                    ? 'סיבת הדחייה...'
                    : 'הערות לספק...'
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setReviewDialog({ open: false, listing: null, action: null })
              }
            >
              ביטול
            </Button>
            <Button
              onClick={handleReview}
              disabled={isProcessing}
              variant={reviewDialog.action === 'REJECT' ? 'destructive' : 'default'}
              className={
                reviewDialog.action === 'APPROVE'
                  ? 'bg-green-600 hover:bg-green-700'
                  : ''
              }
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : reviewDialog.action === 'APPROVE' ? (
                <>
                  <CheckCircle className="h-4 w-4 ml-2" />
                  אשר
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 ml-2" />
                  דחה
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
