'use client'

import { useCallback } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileDropzoneProps {
  onFileLoad: (content: string, filename: string) => void
  className?: string
}

export function FileDropzone({ onFileLoad, className }: FileDropzoneProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileLoad(event.target.result as string, file.name)
        }
      }
      reader.readAsText(file)
    }
  }, [onFileLoad])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileLoad(event.target.result as string, file.name)
        }
      }
      reader.readAsText(file)
    }
  }, [onFileLoad])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        "border-2 border-dashed border-emerald-500/30 rounded-2xl p-8 text-center hover:border-emerald-400/50 transition-colors cursor-pointer bg-white/5",
        className
      )}
    >
      <input
        type="file"
        accept=".csv,.json,.xml,.yaml,.yml"
        onChange={handleFileInput}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer block">
        <Upload className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
        <p className="text-lg font-medium text-white mb-2">Drop your file here</p>
        <p className="text-sm text-white/60">Supports CSV, JSON, XML, and YAML</p>
      </label>
    </div>
  )
}