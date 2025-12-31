'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WhatsAppUpload } from '@/components/admin/whatsapp-upload'
import { ImportTable } from '@/components/admin/import-table'
import { whatsappImports, getImportStats } from '@/lib/mock-data/whatsapp-imports'
import type { ParseResult } from '@/types/whatsapp'

export default function AdminImportsPage() {
  const t = useTranslations('admin')
  const [imports, setImports] = useState(whatsappImports)
  const stats = getImportStats()

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
          <WhatsAppUpload onUpload={handleUpload} />
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
