'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, TrendingUp, Users, Search, ThumbsUp, Target, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InsightCard } from '@/components/community/insight-card'
import {
  getRecentRecommendations,
  getRecentLeads,
  getProviderStats,
  extractedEntities,
} from '@/lib/mock-data/whatsapp-imports'
import { providers, getProviderById } from '@/lib/mock-data/providers'

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const recommendations = getRecentRecommendations(10)
  const serviceRequests = getRecentLeads(10)

  // Get top mentioned providers
  const providerMentionCounts = new Map<string, number>()
  extractedEntities
    .filter(e => e.providerId && e.approvalStatus === 'APPROVED')
    .forEach(e => {
      const count = providerMentionCounts.get(e.providerId!) || 0
      providerMentionCounts.set(e.providerId!, count + 1)
    })

  const topProviders = Array.from(providerMentionCounts.entries())
    .map(([providerId, count]) => ({
      provider: getProviderById(providerId),
      count,
      stats: getProviderStats(providerId),
    }))
    .filter(p => p.provider)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Header />

      <div className="container py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">תובנות קהילתיות</h1>
          <p className="text-muted-foreground text-lg">
            המלצות ושיחות מקבוצות וואטסאפ קהילתיות ברמת בית שמש
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{extractedEntities.length}</div>
                  <div className="text-sm text-muted-foreground">תובנות</div>
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
                  <div className="text-2xl font-bold">{recommendations.length}</div>
                  <div className="text-sm text-muted-foreground">המלצות</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{topProviders.length}</div>
                  <div className="text-sm text-muted-foreground">ספקים מדוברים</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{serviceRequests.length}</div>
                  <div className="text-sm text-muted-foreground">בקשות שירות</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש בתובנות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="recommendations">
              <TabsList className="mb-4">
                <TabsTrigger value="recommendations" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  המלצות
                </TabsTrigger>
                <TabsTrigger value="requests" className="gap-2">
                  <Target className="h-4 w-4" />
                  מה מחפשים
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations">
                <div className="space-y-4">
                  {recommendations.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>אין המלצות עדיין</p>
                      </CardContent>
                    </Card>
                  ) : (
                    recommendations.map(entity => (
                      <InsightCard
                        key={entity.id}
                        entity={entity}
                        providerName={
                          entity.providerId
                            ? getProviderById(entity.providerId)?.businessName
                            : undefined
                        }
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="requests">
                <div className="space-y-4">
                  {serviceRequests.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <Target className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>אין בקשות שירות עדיין</p>
                      </CardContent>
                    </Card>
                  ) : (
                    serviceRequests.map(entity => (
                      <InsightCard key={entity.id} entity={entity} />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Popular Providers */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  הספקים הנפוצים ביותר
                </CardTitle>
                <CardDescription>
                  ספקים שמדברים עליהם הכי הרבה בקהילה
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProviders.map(({ provider, count, stats }) => (
                    <Link
                      key={provider!.id}
                      href={`/providers/${provider!.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div>
                        <div className="font-medium">{provider!.businessName}</div>
                        <div className="text-sm text-muted-foreground">
                          {count} אזכורים
                          {stats.positiveCount > 0 && (
                            <span className="text-green-600 mr-2">
                              • {stats.positiveCount} חיוביים
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA for providers */}
            <Card className="mt-4 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">בעל עסק?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  ראה מה אומרים עליך בקהילה והגב לבקשות שירות
                </p>
                <Button asChild size="sm">
                  <Link href="/dashboard/mentions">צפה באזכורים שלי</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
