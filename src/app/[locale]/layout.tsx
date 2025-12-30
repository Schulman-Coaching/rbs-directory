import type { Metadata } from 'next'
import { Inter, Heebo } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
})

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['RBS', 'Ramat Beit Shemesh', 'רמת בית שמש', 'חוגים', 'activities', 'directory', 'מדריך'],
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()
  const dir = locale === 'he' ? 'rtl' : 'ltr'
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${heebo.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          {/* Demo Mode Banner */}
          <div className="demo-banner">
            🎯 {t('demoBanner')}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
