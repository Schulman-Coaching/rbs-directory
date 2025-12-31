'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { WhatsAppUpload } from '@/components/admin/whatsapp-upload'
import { ImportTable } from '@/components/admin/import-table'
import { whatsappImports, getImportStats } from '@/lib/mock-data/whatsapp-imports'
import type { ParseResult } from '@/types/whatsapp'

interface CSVImportResult {
  success: boolean
  stats: {
    created: number
    skipped: number
    errors: number
    warnings: number
  }
  errors: { row: number; message: string }[]
  warnings: { row: number; message: string }[]
}

export default function AdminImportsPage() {
  const t = useTranslations('admin')
  const [imports, setImports] = useState(whatsappImports)
  const stats = getImportStats()

  // CSV import state
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvImporting, setCsvImporting] = useState(false)
  const [csvResult, setCsvResult] = useState<CSVImportResult | null>(null)
  const [autoApprove, setAutoApprove] = useState(false)
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (result: ParseResult, fileName: string) => {
    // In a real app, this would send to the API
    // For demo, we add a new mock import
    const newImport = {
      id: `import-${Date.now()}`,
      fileName,
      fileSize: 0,
      uploadedBy: 'admin-1',
      status: 'PROCESSING' as const,
      messageCount: result.messages.length,
      extractedEntitiesCount: 0,
      dateRangeStart: result.dateRange.start,
      dateRangeEnd: result.dateRange.end,
      groupName: result.groupName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setImports([newImport, ...imports])

    // Simulate processing completion after 3 seconds
    setTimeout(() => {
      setImports(prev =>
        prev.map(imp =>
          imp.id === newImport.id
            ? { ...imp, status: 'COMPLETED' as const, extractedEntitiesCount: Math.floor(result.messages.length * 0.05) }
            : imp
        )
      )
    }, 3000)
  }

  const handleDelete = (id: string) => {
    setImports(imports.filter(imp => imp.id !== id))
  }

  const handleReprocess = (id: string) => {
    setImports(
      imports.map(imp =>
        imp.id === id
          ? { ...imp, status: 'PROCESSING' as const, processingError: undefined }
          : imp
      )
    )

    // Simulate reprocessing
    setTimeout(() => {
      setImports(prev =>
        prev.map(imp =>
          imp.id === id
            ? { ...imp, status: 'COMPLETED' as const }
            : imp
        )
      )
    }, 2000)
  }

  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      setCsvResult(null)
    }
  }

  const handleCSVImport = async () => {
    if (!csvFile) return

    setCsvImporting(true)
    setCsvResult(null)

    try {
      const formData = new FormData()
      formData.append('file', csvFile)
      formData.append('autoApprove', autoApprove.toString())
      formData.append('skipDuplicates', skipDuplicates.toString())

      const response = await fetch('/api/listings/bulk', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      setCsvResult({
        success: data.success,
        stats: data.stats || { created: 0, skipped: 0, errors: 0, warnings: 0 },
        errors: data.errors || [],
        warnings: data.warnings || [],
      })

      if (data.success) {
        setCsvFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      setCsvResult({
        success: false,
        stats: { created: 0, skipped: 0, errors: 1, warnings: 0 },
        errors: [{ row: 0, message: 'Failed to import CSV file' }],
        warnings: [],
      })
    } finally {
      setCsvImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = `title,titleHe,description,descriptionHe,category,price,priceType,phone,email,location,neighborhood,ageMin,ageMax,gender,language
"Kids Soccer Class","חוג כדורגל לילדים","Professional soccer training","אימוני כדורגל מקצועיים","Sports",200,"MONTHLY","052-123-4567","info@example.com","Sports Center","רמת בית שמש א",6,12,"ALL","he,en"`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'listings-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('imports.title')}</h1>
        <p className="text-muted-foreground">
          {t('imports.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">{t('imports.totalImports')}</div>
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
                <div className="text-2xl font-bold">{stats.totalEntities}</div>
                <div className="text-sm text-muted-foreground">{t('imports.entitiesExtracted')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.pendingReview}</div>
                <div className="text-sm text-muted-foreground">{t('imports.pendingReview')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{t('imports.messagesAnalyzed')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('imports.uploadNew')}
          </CardTitle>
          <CardDescription>
            {t('imports.uploadDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="csv" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                CSV / Excel
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
            </TabsList>

            <TabsContent value="csv">
              <div className="space-y-6">
                {/* CSV Upload */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="mb-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleCSVFileChange}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="outline" asChild className="cursor-pointer">
                        <span>בחר קובץ CSV</span>
                      </Button>
                    </label>
                    {csvFile && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {csvFile.name}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    גרור קובץ CSV או לחץ לבחירה
                  </p>
                  <Button variant="link" size="sm" onClick={downloadTemplate}>
                    הורד תבנית לדוגמה
                  </Button>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="skip-duplicates"
                      checked={skipDuplicates}
                      onCheckedChange={setSkipDuplicates}
                    />
                    <Label htmlFor="skip-duplicates">דלג על כפילויות</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="auto-approve"
                      checked={autoApprove}
                      onCheckedChange={setAutoApprove}
                    />
                    <Label htmlFor="auto-approve">אשר אוטומטית</Label>
                  </div>
                </div>

                {/* Import Button */}
                <Button
                  onClick={handleCSVImport}
                  disabled={!csvFile || csvImporting}
                  className="w-full"
                >
                  {csvImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      מייבא...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 ml-2" />
                      ייבא שירותים
                    </>
                  )}
                </Button>

                {/* Results */}
                {csvResult && (
                  <div
                    className={`p-4 rounded-lg ${
                      csvResult.success
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {csvResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {csvResult.success ? 'הייבוא הושלם בהצלחה' : 'שגיאה בייבוא'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <Badge variant="secondary">
                        נוצרו: {csvResult.stats.created}
                      </Badge>
                      <Badge variant="secondary">
                        דולגו: {csvResult.stats.skipped}
                      </Badge>
                      {csvResult.stats.errors > 0 && (
                        <Badge variant="destructive">
                          שגיאות: {csvResult.stats.errors}
                        </Badge>
                      )}
                      {csvResult.stats.warnings > 0 && (
                        <Badge variant="outline" className="text-amber-600">
                          אזהרות: {csvResult.stats.warnings}
                        </Badge>
                      )}
                    </div>
                    {csvResult.errors.length > 0 && (
                      <div className="mt-3 text-sm text-red-600">
                        <strong>שגיאות:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {csvResult.errors.slice(0, 5).map((err, i) => (
                            <li key={i}>
                              שורה {err.row}: {err.message}
                            </li>
                          ))}
                          {csvResult.errors.length > 5 && (
                            <li>ועוד {csvResult.errors.length - 5} שגיאות...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="whatsapp">
              <WhatsAppUpload onUpload={handleUpload} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('imports.importHistory')}</CardTitle>
          <CardDescription>
            {t('imports.allImports')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportTable
            imports={imports}
            onDelete={handleDelete}
            onReprocess={handleReprocess}
          />
        </CardContent>
      </Card>
    </div>
  )
}
