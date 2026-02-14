'use client'

import { TrendingUp, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: 'files' | 'success' | 'warning' | 'trend'
  className?: string
  delay?: number
}

export function StatsCard({ title, value, subtitle, trend, icon, className, delay = 0 }: StatsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'files':
        return <FileText className="w-6 h-6 text-cyan-400" />
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-emerald-400" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-400" />
      case 'trend':
        return <TrendingUp className="w-6 h-6 text-blue-400" />
    }
  }

  return (
    <div 
      className={cn(
        "glass-card p-6 fade-in-up",
        className
      )}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          {getIcon()}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' && "bg-emerald-500/20 text-emerald-300",
            trend === 'down' && "bg-red-500/20 text-red-300",
            trend === 'neutral' && "bg-white/10 text-white/60"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} 12%
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-emerald-200/60 font-medium">{title}</p>
        {subtitle && (
          <p className="text-xs text-emerald-200/40 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}