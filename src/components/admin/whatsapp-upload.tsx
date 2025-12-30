'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { parseWhatsAppExport, isValidWhatsAppExport, getExportStats } from '@/lib/whatsapp'
import type { ParseResult } from '@/types/whatsapp'

interface WhatsAppUploadProps {
  onUpload?: (result: ParseResult, fileName: string) => void
  className?: string
}

export function WhatsAppUpload({ onUpload, className }: WhatsAppUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = useCallback(async (selectedFile: File) => {
    setError(null)
    setParseResult(null)
    setIsProcessing(true)

    try {
      // Validate file type
      if (!selectedFile.name.endsWith('.txt')) {
        throw new Error('יש להעלות קובץ טקסט (.txt) בלבד')
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        throw new Error('הקובץ גדול מדי. גודל מקסימלי: 10MB')
      }

      // Read file content
      const content = await selectedFile.text()

      // Validate WhatsApp format
      if (!isValidWhatsAppExport(content)) {
        throw new Error('הקובץ אינו נראה כייצוא של וואטסאפ. ודא שהקובץ הוא ייצוא צ\'אט מוואטסאפ.')
      }

      // Parse the file
      const result = parseWhatsAppExport(content)

      if (!result.success) {
        throw new Error('שגיאה בניתוח הקובץ')
      }

      setFile(selectedFile)
      setParseResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה')
      setFile(null)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }, [processFile])

  const handleSubmit = useCallback(() => {
    if (parseResult && file && onUpload) {
      onUpload(parseResult, file.name)
    }
  }, [parseResult, file, onUpload])

  const handleClear = useCallback(() => {
    setFile(null)
    setParseResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const stats = parseResult ? getExportStats(parseResult) : null

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          isDragging && 'border-primary bg-primary/5',
          file && 'border-green-500 bg-green-50',
          error && 'border-destructive bg-destructive/5',
          !isDragging && !file && !error && 'border-muted-foreground/25 hover:border-muted-foreground/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isProcessing ? (
          <div className="space-y-2">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground">מעבד את הקובץ...</p>
          </div>
        ) : file ? (
          <div className="space-y-2">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : error ? (
          <div className="space-y-2">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
            <p className="text-destructive font-medium">{error}</p>
            <Button variant="outline" size="sm" onClick={handleClear}>
              נסה שוב
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="font-medium">גרור קובץ לכאן או לחץ לבחירה</p>
            <p className="text-sm text-muted-foreground">
              קובץ .txt מייצוא וואטסאפ (עד 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Parse Results Preview */}
      {stats && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold mb-2">תצוגה מקדימה</h3>
                {parseResult?.groupName && (
                  <p className="text-sm text-muted-foreground mb-2">
                    קבוצה: {parseResult.groupName}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
                <div className="text-xs text-muted-foreground">הודעות</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.uniqueSenders}</div>
                <div className="text-xs text-muted-foreground">משתתפים</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {stats.dateRange.start.toLocaleDateString('he-IL')}
                </div>
                <div className="text-xs text-muted-foreground">מתאריך</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {stats.dateRange.end.toLocaleDateString('he-IL')}
                </div>
                <div className="text-xs text-muted-foreground">עד תאריך</div>
              </div>
            </div>

            {stats.topSenders.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">שולחים מובילים:</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.topSenders.slice(0, 5).map(sender => (
                    <span
                      key={sender.name}
                      className="text-xs bg-muted px-2 py-1 rounded"
                    >
                      {sender.name} ({sender.count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button onClick={handleSubmit}>
                <FileText className="h-4 w-4 ml-2" />
                התחל ניתוח
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
