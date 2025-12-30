'use client'

import { useState } from 'react'
import { MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, Calendar, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InsightCard } from '@/components/community/insight-card'
import { getProviderStats, getEntitiesByProvider } from '@/lib/mock-data/whatsapp-imports'

// Mock: In real app, this would come from auth context
const currentProviderId = 'prov-1' // Geerz Biking

export default function ProviderMentionsPage() {
  const stats = getProviderStats(currentProviderId)
  const allMentions = getEntitiesByProvider(currentProviderId)

  const recommendations = allMentions.filter(
    e => e.entityType === 'RECOMMENDATION'
  )
  const mentions = allMentions.filter(
    e => e.entityType === 'PROVIDER_MENTION'
  )

  const positiveMentions = allMentions.filter(e => e.sentiment === 'POSITIVE')
  const neutralMentions = allMentions.filter(e => e.sentiment === 'NEUTRAL')
  const negativeMentions = allMentions.filter(e => e.sentiment === 'NEGATIVE')

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">אזכורים בקהילה</h1>
        <p className="text-muted-foreground">
          ראה מה אומרים עליך בקבוצות וואטסאפ קהילתיות
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalMentions}</div>
                <div className="text-sm text-muted-foreground">סה״כ אזכורים</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.positiveCount}</div>
                <div className="text-sm text-muted-foreground">חיוביים</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.neutralCount}</div>
                <div className="text-sm text-muted-foreground">ניטרליים</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.recommendationCount}</div>
                <div className="text-sm text-muted-foreground">המלצות</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>סנטימנט כללי</CardTitle>
          <CardDescription>
            איך הקהילה מתייחסת אליך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 h-4 rounded-full overflow-hidden">
            {stats.totalMentions > 0 && (
              <>
                <div
                  className="bg-green-500 h-full"
                  style={{
                    width: `${(stats.positiveCount / stats.totalMentions) * 100}%`,
                  }}
                />
                <div
                  className="bg-gray-300 h-full"
                  style={{
                    width: `${(stats.neutralCount / stats.totalMentions) * 100}%`,
                  }}
                />
                <div
                  className="bg-red-500 h-full"
                  style={{
                    width: `${(stats.negativeCount / stats.totalMentions) * 100}%`,
                  }}
                />
              </>
            )}
          </div>
          <div className="flex gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>חיובי ({stats.positiveCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-300" />
              <span>ניטרלי ({stats.neutralCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>שלילי ({stats.negativeCount})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentions List */}
      <Card>
        <CardHeader>
          <CardTitle>אזכורים אחרונים</CardTitle>
          <CardDescription>
            כל ההזכרות שלך מקבוצות וואטסאפ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                הכל
                <Badge variant="secondary" className="mr-2">{allMentions.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="positive">
                <ThumbsUp className="h-4 w-4 ml-1" />
                חיוביים
                <Badge variant="secondary" className="mr-2">{positiveMentions.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                המלצות
                <Badge variant="secondary" className="mr-2">{recommendations.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allMentions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>אין אזכורים עדיין</p>
                  <p className="text-sm">ברגע שמישהו יזכיר אותך בקבוצות, תראה את זה כאן</p>
                </div>
              ) : (
                allMentions.map(entity => (
                  <InsightCard key={entity.id} entity={entity} />
                ))
              )}
            </TabsContent>

            <TabsContent value="positive" className="space-y-4">
              {positiveMentions.map(entity => (
                <InsightCard key={entity.id} entity={entity} />
              ))}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.map(entity => (
                <InsightCard key={entity.id} entity={entity} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
