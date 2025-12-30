import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-white text-primary rounded-lg p-2 font-bold text-lg">
            RBS
          </div>
          <span className="text-white font-bold text-xl">מדריך רמב״ש</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">
            המקום המרכזי לכל
            <br />
            החוגים והשירותים
            <br />
            ברמת בית שמש
          </h1>
          <p className="text-white/80 text-lg">
            הצטרפו לאלפי משפחות וספקים שכבר משתמשים בפלטפורמה
          </p>
        </div>

        <div className="flex gap-8 text-white/60 text-sm">
          <span>1,200+ חוגים</span>
          <span>500+ ספקים</span>
          <span>10,000+ משתמשים</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-lg p-2 font-bold text-lg">
                RBS
              </div>
              <span className="font-bold text-xl">מדריך רמב״ש</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
