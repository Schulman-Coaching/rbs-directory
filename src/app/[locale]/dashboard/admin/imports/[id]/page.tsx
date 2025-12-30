'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock, XCircle, Filter, MessageSquare, Building2, Phone, DollarSign, Search, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EntityReviewCard } from '@/components/admin/entity-review-card'
import {
  getImportById,
  getEntitiesByImport,
  getMessagesByImport,
} from '@/lib/mock-data/whatsapp-imports'
import { providers } from '@/lib/mock-data/providers'
import type { EntityType } from '@/types/whatsapp'

const entityTypeFilters: { value: EntityType | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'הכל', icon: Filter },
  { value: 'PROVIDER_MENTION', label: 'אזכורי ספקים', icon: Building2 },
  { value: 'RECOMMENDATION', label: 'המלצות', icon: ThumbsUp },
  { value: 'SERVICE_REQUEST', label: 'בקשות שירות', icon: Search },
  { value: 'CONTACT_INFO', label: 'פרטי קשר', icon: Phone },
  { value: 'PRICING', label: 'מחירים', icon: DollarSign },
]

export default function ImportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const importId = params.id as string

  const [entityFilter, setEntityFilter] = useState<EntityType | 'all'>('all')
  const [entities, setEntities] = useState(() => getEntitiesByImport(importId))

  const importData = getImportById(importId)
  const messages = getMessagesByImport(importId)

  if (!importData) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">הייבוא לא נמצא</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowRight className="h-4 w-4 ml-2" />
          חזרה
        </Button>
      </div>
    )
  }

  const filteredEntities = entityFilter === 'all'
    ? entities
    : entities.filter(e => e.entityType === entityFilter)

  const pendingEntities = filteredEntities.filter(e => e.approvalStatus === 'PENDING')
  const approvedEntities = filteredEntities.filter(e => e.approvalStatus === 'APPROVED')
  const rejectedEntities = filteredEntities.filter(e => e.approvalStatus === 'REJECTED')

  const handleApprove = (entityId: string, providerId?: string) => {
    setEntities(
      entities.map(e =>
        e.id === entityId
          ? { ...e, approvalStatus: 'APPROVED' as const, providerId }
          : e
      )
    )
  }

  const handleReject = (entityId: string) => {
    setEntities(
      entities.map(e =>
        e.id === entityId
          ? { ...e, approvalStatus: 'REJECTED' as const }
          : e
      )
    )
  }

  const handleApproveAll = () => {
    setEntities(
      entities.map(e =>
        e.approvalStatus === 'PENDING'
          ? { ...e, approvalStatus: 'APPROVED' as const }
          : e
      )
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/dashboard/admin/imports" className="hover:text-foreground">
              ייבוא וואטסאפ
            </Link>
            <span>/</span>
            <span>{importData.fileName}</span>
          </div>
          <h1 className="text-2xl font-bold">{importData.fileName}</h1>
          {importData.groupName && (
            <p className="text-muted-foreground">{importData.groupName}</p>
          )}
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowRight className="h-4 w-4 ml-2" />
          חזרה
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{importData.messageCount.toLocaleString()}</div>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">הודעות</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{entities.length}</div>
              <Filter className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">ישויות שחולצו</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-600">{pendingEntities.length}</div>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-sm text-muted-foreground">ממתינים לאישור</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{approvedEntities.length}</div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-sm text-muted-foreground">אושרו</div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">טווח תאריכים:</span>
            <span className="font-medium">
              {importData.dateRangeStart?.toLocaleDateString('he-IL')} - {importData.dateRangeEnd?.toLocaleDateString('he-IL')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Entity Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {entityTypeFilters.map(filter => {
          const Icon = filter.icon
          const count = filter.value === 'all'
            ? entities.length
            : entities.filter(e => e.entityType === filter.value).length

          return (
            <Button
              key={filter.value}
              variant={entityFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEntityFilter(filter.value)}
            >
              <Icon className="h-4 w-4 ml-1" />
              {filter.label}
              <Badge variant="secondary" className="mr-2">{count}</Badge>
            </Button>
          )
        })}
      </div>

      {/* Entities Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>סקירת ישויות</CardTitle>
              <CardDescription>
                בדוק ואשר את הישויות שחולצו מההודעות
              </CardDescription>
            </div>
            {pendingEntities.length > 0 && (
              <Button onClick={handleApproveAll}>
                <CheckCircle className="h-4 w-4 ml-2" />
                אשר הכל ({pendingEntities.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending" className="gap-1">
                <Clock className="h-4 w-4" />
                ממתינים
                <Badge variant="secondary">{pendingEntities.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-1">
                <CheckCircle className="h-4 w-4" />
                אושרו
                <Badge variant="secondary">{approvedEntities.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-1">
                <XCircle className="h-4 w-4" />
                נדחו
                <Badge variant="secondary">{rejectedEntities.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              {pendingEntities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
                  <p>אין ישויות ממתינות לאישור</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {pendingEntities.map(entity => (
                    <EntityReviewCard
                      key={entity.id}
                      entity={entity}
                      providers={providers}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              {approvedEntities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>אין ישויות מאושרות</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {approvedEntities.map(entity => (
                    <EntityReviewCard
                      key={entity.id}
                      entity={entity}
                      providers={providers}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              {rejectedEntities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>אין ישויות שנדחו</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {rejectedEntities.map(entity => (
                    <EntityReviewCard
                      key={entity.id}
                      entity={entity}
                      providers={providers}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
