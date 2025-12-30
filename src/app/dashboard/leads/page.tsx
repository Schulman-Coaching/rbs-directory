'use client'

import { useState } from 'react'
import { Target, Clock, CheckCircle, XCircle, MessageSquare, Phone, Filter, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { getRecentLeads, extractedEntities } from '@/lib/mock-data/whatsapp-imports'
import type { ExtractedEntity, ServiceRequestData } from '@/types/whatsapp'

type LeadStatus = 'new' | 'contacted' | 'not_interested'

interface LeadWithStatus extends ExtractedEntity {
  status: LeadStatus
}

export default function ProviderLeadsPage() {
  const allLeads = getRecentLeads(20)

  // Add status to leads (mock - in real app this would come from DB)
  const [leads, setLeads] = useState<LeadWithStatus[]>(
    allLeads.map((lead, i) => ({
      ...lead,
      status: i === 0 ? 'new' : i < 3 ? 'contacted' : 'new',
    }))
  )

  const [filter, setFilter] = useState<'all' | LeadStatus>('all')

  const filteredLeads = filter === 'all'
    ? leads
    : leads.filter(l => l.status === filter)

  const newCount = leads.filter(l => l.status === 'new').length
  const contactedCount = leads.filter(l => l.status === 'contacted').length

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    setLeads(leads.map(l =>
      l.id === leadId ? { ...l, status } : l
    ))
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">לידים מהקהילה</h1>
        <p className="text-muted-foreground">
          בקשות שירות שזוהו בקבוצות וואטסאפ שרלוונטיות לעסק שלך
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{leads.length}</div>
                <div className="text-sm text-muted-foreground">סה״כ לידים</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{newCount}</div>
                <div className="text-sm text-muted-foreground">חדשים</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{contactedCount}</div>
                <div className="text-sm text-muted-foreground">יצרת קשר</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Upsell */}
      <Card className="bg-gradient-to-l from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-900">שדרג לפרימיום</h3>
              <p className="text-sm text-amber-700">
                קבל גישה לפרטי קשר מלאים ואפשרות ליצור קשר ישיר עם לידים
              </p>
            </div>
            <Button variant="default" className="bg-amber-600 hover:bg-amber-700">
              שדרג עכשיו
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="סנן לפי סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">הכל ({leads.length})</SelectItem>
            <SelectItem value="new">חדשים ({newCount})</SelectItem>
            <SelectItem value="contacted">יצרתי קשר ({contactedCount})</SelectItem>
            <SelectItem value="not_interested">לא רלוונטי</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Target className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>אין לידים {filter !== 'all' && 'בסטטוס זה'}</p>
            </CardContent>
          </Card>
        ) : (
          filteredLeads.map(lead => {
            const data = lead.extractedData as ServiceRequestData

            return (
              <Card key={lead.id} className={cn(
                lead.status === 'new' && 'border-blue-200 bg-blue-50/50'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{data.serviceType}</Badge>
                        {lead.status === 'new' && (
                          <Badge className="bg-blue-500">חדש</Badge>
                        )}
                        {lead.status === 'contacted' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            יצרת קשר
                          </Badge>
                        )}
                        {data.urgency === 'HIGH' && (
                          <Badge variant="destructive">דחוף</Badge>
                        )}
                      </div>

                      <h3 className="font-medium mb-1">{data.description}</h3>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {data.ageRange && (
                          <span>גיל: {data.ageRange}</span>
                        )}
                        {data.neighborhood && (
                          <span>שכונה: {data.neighborhood}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {lead.createdAt.toLocaleDateString('he-IL')}
                        </span>
                      </div>

                      <blockquote className="border-r-2 border-muted pr-3 mt-3 text-sm text-muted-foreground italic">
                        "{lead.rawText}"
                      </blockquote>
                    </div>

                    <div className="flex flex-col gap-2 mr-4">
                      {lead.status === 'new' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(lead.id, 'contacted')}
                          >
                            <Phone className="h-4 w-4 ml-1" />
                            יצרתי קשר
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(lead.id, 'not_interested')}
                          >
                            <XCircle className="h-4 w-4 ml-1" />
                            לא רלוונטי
                          </Button>
                        </>
                      ) : lead.status === 'contacted' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(lead.id, 'new')}
                        >
                          סמן כחדש
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(lead.id, 'new')}
                        >
                          שחזר
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
