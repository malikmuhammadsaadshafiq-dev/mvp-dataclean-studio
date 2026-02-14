'use client'

import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  error?: string | null
  lineNumbers?: boolean
  className?: string
  placeholder?: string
}

export function CodeEditor({ 
  value, 
  onChange, 
  error, 
  lineNumbers = true,
  className,
  placeholder
}: CodeEditorProps) {
  const lineCount = value.split('\n').length

  return (
    <div className={cn("relative rounded-xl overflow-hidden border", error ? "border-red-500/50" : "border-emerald-500/20", className)}>
      <div className="flex">
        {lineNumbers && (
          <div className="bg-black/30 text-white/40 py-4 px-3 text-sm font-mono text-right select-none min-w-[3rem]">
            {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1).map((num) => (
              <div key={num} className="leading-6">{num}</div>
            ))}
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-black/20 text-white p-4 text-sm font-mono resize-none outline-none min-h-[300px] leading-6"
          spellCheck={false}
        />
      </div>
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500/20 border-t border-red-500/50 p-3 text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}