import Link from 'next/link'
import {
  Eye, MessageCircle, Calendar, TrendingUp,
  ArrowUp, ArrowDown, Plus, ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock dashboard data
const stats = [
  {
    title: 'צפיות החודש',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: Eye,
  },
  {
    title: 'הודעות חדשות',
    value: '23',
    change: '+5',
    trend: 'up',
    icon: MessageCircle,
  },
  {
    title: 'הזמנות',
    value: '8',
    change: '+3',
    trend: 'up',
    icon: Calendar,
  },
  {
    title: 'המרות',
    value: '6.2%',
    change: '-0.3%',
    trend: 'down',
    icon: TrendingUp,
  },
]

const recentActivity = [
  { type: 'view', message: 'מישהו צפה בשירות "קורס אופני הרים לילדים"', time: 'לפני 5 דקות' },
  { type: 'message', message: 'הודעה חדשה מ-שרה כהן', time: 'לפני 15 דקות' },
  { type: 'booking', message: 'הזמנה חדשה לשיעור ביום ראשון', time: 'לפני שעה' },
  { type: 'view', message: 'מישהו צפה בשירות "קורס אופני הרים לילדים"', time: 'לפני 2 שעות' },
  { type: 'message', message: 'הודעה חדשה מ-דוד לוי', time: 'לפני 3 שעות' },
]

const topListings = [
  { name: 'קורס אופני הרים לילדים', views: 234, bookings: 12 },
  { name: 'סיור אופניים משפחתי', views: 156, bookings: 8 },
  { name: 'שיעור פרטי', views: 89, bookings: 5 },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">שלום, Geerz Biking!</h1>
          <p className="text-muted-foreground">הנה מה שקורה בעסק שלך</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <Plus className="h-4 w-4 ml-2" />
            הוסף שירות
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <Badge
                  variant={stat.trend === 'up' ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>פעילות אחרונה</CardTitle>
            <Button variant="ghost" size="sm">
              הכל
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'message' ? 'bg-primary' :
                    activity.type === 'booking' ? 'bg-green-500' :
                    'bg-muted-foreground'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>שירותים מובילים</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/listings">
                הכל
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topListings.map((listing, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="font-medium">{listing.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{listing.views} צפיות</span>
                    <span>{listing.bookings} הזמנות</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/listings/new">
                <Plus className="h-5 w-5" />
                <span>הוסף שירות</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/messages">
                <MessageCircle className="h-5 w-5" />
                <span>הודעות</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/settings">
                <Eye className="h-5 w-5" />
                <span>צפה בפרופיל</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/settings">
                <TrendingUp className="h-5 w-5" />
                <span>שדרג לפרימיום</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
