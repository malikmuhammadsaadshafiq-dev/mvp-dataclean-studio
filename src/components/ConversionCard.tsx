'use client'

import { useState } from 'react'
import { 
  FileJson, 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowRightLeft,
  Copy,
  Check
} from 'lucide-react'
import { cn, formatDate, formatNumber } from '@/lib/utils'

export interface ConversionItem {
  id: string
  filename: string
  sourceFormat: 'csv' | 'json' | 'xml' | 'yaml'
  targetFormat: 'csv' | 'json' | 'xml' | 'yaml'
  status: 'completed' | 'processing' | 'error' | 'warning'
  createdAt: string
  recordCount: number
  errors?: string[]
  content?: string
  convertedContent?: string
}

interface ConversionCardProps {
  item: ConversionItem
  onDelete: (id: string) => void
  onDownload: (item: ConversionItem) => void
  onPreview: (item: ConversionItem) => void
  style?: React.CSSProperties
}

export function ConversionCard({ item, onDelete, onDownload, onPreview, style }: ConversionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      onDelete(item.id)
    }, 300)
  }

  const handleCopy = async () => {
    if (item.convertedContent) {
      await navigator.clipboard.writeText(item.convertedContent)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const getIcon = (format: string) => {
    switch (format) {
      case 'json':
        return <FileJson className="w-5 h-5 text-blue-400" />
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-green-400" />
      case 'xml':
        return <FileCode className="w-5 h-5 text-orange-400" />
      case 'yaml':
        return <FileText className="w-5 h-5 text-purple-400" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusIcon = () => {
    switch (item.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (item.status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'processing':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    }
  }

  return (
    <div 
      style={style}
      className={cn(
        "glass-card p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-emerald-500/10",
        isDeleting && "opacity-0 translate-x-[-20px]"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            {getIcon(item.sourceFormat)}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm truncate max-w-[180px]">
              {item.filename}
            </h3>
            <p className="text-xs text-emerald-200/60">
              {formatDate(item.createdAt)}
            </p>
          </div>
        </div>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium border",
          getStatusColor()
        )}>
          {item.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-emerald-200/80">
        <span className="uppercase font-mono text-xs bg-white/10 px-2 py-1 rounded">
          {item.sourceFormat}
        </span>
        <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
        <span className="uppercase font-mono text-xs bg-white/10 px-2 py-1 rounded">
          {item.targetFormat}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4 text-xs text-emerald-200/60">
        <span>{formatNumber(item.recordCount)} records</span>
        <span>{getStatusIcon()}</span>
      </div>

      {item.errors && item.errors.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-200">
          {item.errors[0]}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onPreview(item)}
          className="flex-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors border border-white/10"
        >
          Preview
        </button>
        {item.status === 'completed' && (
          <>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors border border-white/10"
              title="Copy to clipboard"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDownload(item)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors border border-white/10"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        )}
        <button
          onClick={handleDelete}
          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors border border-white/10"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}