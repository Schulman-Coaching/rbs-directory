'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle, Loader2, MoreHorizontal, Eye, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { WhatsAppImport } from '@/types/whatsapp'

interface ImportTableProps {
  imports: WhatsAppImport[]
  onDelete?: (id: string) => void
  onReprocess?: (id: string) => void
  className?: string
}

const statusConfig = {
  PENDING: {
    label: 'ממתין',
    icon: Clock,
    variant: 'secondary' as const,
  },
  PROCESSING: {
    label: 'מעבד',
    icon: Loader2,
    variant: 'default' as const,
    animate: true,
  },
  COMPLETED: {
    label: 'הושלם',
    icon: CheckCircle,
    variant: 'success' as const,
  },
  FAILED: {
    label: 'נכשל',
    icon: XCircle,
    variant: 'destructive' as const,
  },
}

export function ImportTable({ imports, onDelete, onReprocess, className }: ImportTableProps) {
  return (
    <div className={cn('rounded-lg border', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-right p-4 font-medium">קובץ</th>
              <th className="text-right p-4 font-medium">קבוצה</th>
              <th className="text-right p-4 font-medium">הודעות</th>
              <th className="text-right p-4 font-medium">ישויות</th>
              <th className="text-right p-4 font-medium">סטטוס</th>
              <th className="text-right p-4 font-medium">תאריך</th>
              <th className="text-right p-4 font-medium">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((item) => {
              const status = statusConfig[item.status]
              const StatusIcon = status.icon

              return (
                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.fileName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(item.fileSize / 1024).toFixed(1)} KB
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">
                      {item.groupName || '—'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{item.messageCount.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{item.extractedEntitiesCount}</span>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={status.variant === 'success' ? 'default' : status.variant}
                      className={cn(
                        status.variant === 'success' && 'bg-green-500',
                        'gap-1'
                      )}
                    >
                      <StatusIcon
                        className={cn(
                          'h-3 w-3',
                          status.animate && 'animate-spin'
                        )}
                      />
                      {status.label}
                    </Badge>
                    {item.processingError && (
                      <div className="text-xs text-destructive mt-1 max-w-[200px] truncate">
                        {item.processingError}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {item.createdAt.toLocaleDateString('he-IL')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.createdAt.toLocaleTimeString('he-IL', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {item.status === 'COMPLETED' && (
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/imports/${item.id}`}>
                              <Eye className="h-4 w-4 ml-2" />
                              צפה בפרטים
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {item.status === 'FAILED' && onReprocess && (
                          <DropdownMenuItem onClick={() => onReprocess(item.id)}>
                            <RefreshCw className="h-4 w-4 ml-2" />
                            נסה שוב
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 ml-2" />
                            מחק
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {imports.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>אין ייבואים עדיין</p>
        </div>
      )}
    </div>
  )
}
