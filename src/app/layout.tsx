import type { Metadata } from 'next'
import { Inter, Heebo } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
})

export const metadata: Metadata = {
  title: 'RBS Directory | מדריך רמת בית שמש',
  description: 'המקום המרכזי לכל החוגים, העסקים והשירותים ברמת בית שמש - The central hub for all activities, businesses, and services in Ramat Beit Shemesh',
  keywords: ['RBS', 'Ramat Beit Shemesh', 'רמת בית שמש', 'חוגים', 'activities', 'directory', 'מדריך'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={`${inter.variable} ${heebo.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        {/* Demo Mode Banner */}
        <div className="demo-banner">
          🎯 מצב הדגמה | Demo Mode - נתונים לדוגמה בלבד
        </div>
      </body>
    </html>
  )
}
