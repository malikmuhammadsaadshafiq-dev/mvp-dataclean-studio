'use client'

import { useState, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileDropZoneProps {
  onFileSelect: (file: File, content: string) => void
  className?: string
}

export function FileDropZone({ onFileSelect, className }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }, [])

  const processFile = (file: File) => {
    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onFileSelect(file, content)
      setIsLoading(false)
    }
    reader.readAsText(file)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer group",
        "bg-white/5 backdrop-blur-sm border-emerald-500/30 hover:border-emerald-400/60",
        isDragging && "border-emerald-400 bg-emerald-400/10 scale-[1.02]",
        isLoading && "opacity-50 pointer-events-none",
        className
      )}
    >
      <input
        type="file"
        accept=".csv,.json,.xml,.yaml,.yml"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
          <Upload className="w-12 h-12 text-emerald-400 mb-4" />
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">
            Drop your data file here
          </p>
          <p className="text-sm text-emerald-200/70">
            Supports CSV, JSON, XML, and YAML formats
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-emerald-200 border border-emerald-500/20">
            CSV
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-emerald-200 border border-emerald-500/20">
            JSON
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-emerald-200 border border-emerald-500/20">
            XML
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-emerald-200 border border-emerald-500/20">
            YAML
          </span>
        </div>
      </div>
    </div>
  )
}