'use client'

import { useEffect } from 'react'
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100'
      case 'error':
        return 'bg-red-950/90 border-red-500/30 text-red-100'
      case 'warning':
        return 'bg-amber-950/90 border-amber-500/30 text-amber-100'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-lg shadow-xl min-w-[300px]",
        getStyles()
      )}>
        {getIcon()}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}