'use client'

import { useState } from 'react'
import { Save, Upload, Crown, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState('Geerz Biking')
  const [description, setDescription] = useState('Professional biking lessons and guided tours for kids and adults in the beautiful hills around Beit Shemesh.')
  const [phone, setPhone] = useState('052-123-4567')
  const [email, setEmail] = useState('info@geerz.co.il')
  const [website, setWebsite] = useState('https://geerz.co.il')
  const [location, setLocation] = useState('רחוב נחל לכיש 15, רמת בית שמש א׳')

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">הגדרות</h1>
        <p className="text-muted-foreground">נהל את פרטי העסק והחשבון שלך</p>
      </div>

      {/* Subscription Status */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  חבילת פרימיום
                  <Badge className="bg-amber-500">פעיל</Badge>
                </h3>
                <p className="text-sm text-muted-foreground">
                  תוקף עד: 15 בינואר 2025
                </p>
              </div>
            </div>
            <Button variant="outline">נהל מנוי</Button>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>מיקום מוביל בחיפוש</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>תג "מומלץ"</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>אנליטיקס מתקדם</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>תמיכה VIP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle>פרטי העסק</CardTitle>
          <CardDescription>מידע שיוצג בפרופיל הציבורי שלך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=200" />
              <AvatarFallback className="text-xl">GR</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 ml-2" />
                העלה לוגו
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG עד 2MB
              </p>
            </div>
          </div>

          <Separator />

          {/* Form */}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">שם העסק</label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">תיאור</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">טלפון</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">אימייל</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">אתר</label>
              <Input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">כתובת</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 ml-2" />
              שמור שינויים
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>התראות</CardTitle>
          <CardDescription>הגדר איך תרצה לקבל עדכונים</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">הודעות חדשות</div>
              <div className="text-sm text-muted-foreground">קבל התראה כשמגיעה הודעה חדשה</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">הזמנות חדשות</div>
              <div className="text-sm text-muted-foreground">קבל התראה על הזמנות חדשות</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">דוח שבועי</div>
              <div className="text-sm text-muted-foreground">קבל סיכום שבועי של הפעילות</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">עדכונים מהמערכת</div>
              <div className="text-sm text-muted-foreground">חדשות ועדכונים מהפלטפורמה</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
