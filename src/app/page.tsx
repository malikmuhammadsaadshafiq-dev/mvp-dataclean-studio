'use client'

import { useState, useEffect } from 'react'
import { FileDropzone } from '@/components/FileDropzone'
import { CodeEditor } from '@/components/CodeEditor'
import { Toast } from '@/components/Toast'
import { ConversionCard } from '@/components/ConversionCard'
import { generateId } from '@/lib/utils'
import { 
  FileCode, 
  Settings, 
  LayoutDashboard, 
  Home, 
  Moon, 
  Sun, 
  Download,
  Trash2,
  Search,
  ArrowUpDown,
  Play,
  Minimize2,
  Maximize2,
  Shield,
  Copy,
  Check,
  Filter
} from 'lucide-react'
import Papa from 'papaparse'
import YAML from 'js-yaml'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

interface ConversionItem {
  id: string
  filename: string
  sourceFormat: string
  targetFormat: string
  size: string
  date: string
  status: 'success' | 'error' | 'pending'
  content: string
}

const initialItems: ConversionItem[] = [
  {
    id: '1',
    filename: 'quarterly_sales_q1_2024.csv',
    sourceFormat: 'CSV',
    targetFormat: 'JSON',
    size: '2.4 MB',
    date: '2024-03-15',
    status: 'success',
    content: JSON.stringify([{ month: 'Jan', sales: 45000, region: 'North' }, { month: 'Feb', sales: 52000, region: 'South' }], null, 2)
  },
  {
    id: '2',
    filename: 'user_profiles_backup.json',
    sourceFormat: 'JSON',
    targetFormat: 'YAML',
    size: '8.1 MB',
    date: '2024-03-14',
    status: 'success',
    content: 'users:\n  - id: 1\n    name: Sarah Chen\n    email: sarah.chen@techcorp.com\n  - id: 2\n    name: Marcus Johnson\n    email: m.johnson@innovate.io'
  },
  {
    id: '3',
    filename: 'inventory_export.xml',
    sourceFormat: 'XML',
    targetFormat: 'CSV',
    size: '1.2 MB',
    date: '2024-03-13',
    status: 'success',
    content: 'SKU,Name,Quantity,Price\nINV-001,Wireless Mouse,150,29.99\nINV-002,Mechanical Keyboard,75,89.99\nINV-003,USB-C Hub,200,45.00'
  },
  {
    id: '4',
    filename: 'config_settings.yaml',
    sourceFormat: 'YAML',
    targetFormat: 'JSON',
    size: '45 KB',
    date: '2024-03-12',
    status: 'success',
    content: '{"database": {"host": "localhost", "port": 5432, "name": "production_db"}, "cache": {"enabled": true, "ttl": 3600}}'
  },
  {
    id: '5',
    filename: 'customer_contacts.csv',
    sourceFormat: 'CSV',
    targetFormat: 'XML',
    size: '3.5 MB',
    date: '2024-03-11',
    status: 'success',
    content: '<contacts><contact><name>Emily Rodriguez</name><email>emily.r@globaltech.com</email><phone>+1-555-0123</phone></contact></contacts>'
  },
  {
    id: '6',
    filename: 'product_catalog.json',
    sourceFormat: 'JSON',
    targetFormat: 'CSV',
    size: '5.7 MB',
    date: '2024-03-10',
    status: 'success',
    content: 'id,name,category,price\n101,Ergonomic Chair,Furniture,299.99\n102,Standing Desk,Furniture,449.50\n103,Monitor Arm,Accessories,89.00'
  },
  {
    id: '7',
    filename: 'server_logs.xml',
    sourceFormat: 'XML',
    targetFormat: 'YAML',
    size: '12 MB',
    date: '2024-03-09',
    status: 'error',
    content: 'logs:\n  - timestamp: 2024-03-09T10:23:45Z\n    level: error\n    message: Connection timeout'
  },
  {
    id: '8',
    filename: 'employee_data.csv',
    sourceFormat: 'CSV',
    targetFormat: 'JSON',
    size: '890 KB',
    date: '2024-03-08',
    status: 'success',
    content: '[{"id": "E001", "name": "David Park", "department": "Engineering", "salary": 95000}, {"id": "E002", "name": "Lisa Wong", "department": "Design", "salary": 88000}]'
  },
  {
    id: '9',
    filename: 'api_response.json',
    sourceFormat: 'JSON',
    targetFormat: 'XML',
    size: '234 KB',
    date: '2024-03-07',
    status: 'success',
    content: '<response><status>success</status><data><users>42</users><sessions>128</sessions></data></response>'
  },
  {
    id: '10',
    filename: 'database_backup.yaml',
    sourceFormat: 'YAML',
    targetFormat: 'CSV',
    size: '15 MB',
    date: '2024-03-06',
    status: 'success',
    content: 'table,records,size,last_backup\nusers,15420,2.1MB,2024-03-05\norders,89300,8.4MB,2024-03-05\nproducts,540,0.8MB,2024-03-05'
  },
  {
    id: '11',
    filename: 'transaction_log.csv',
    sourceFormat: 'CSV',
    targetFormat: 'JSON',
    size: '4.2 MB',
    date: '2024-03-05',
    status: 'success',
    content: '[{"tx_id": "TX-9981", "amount": 150.00, "currency": "USD", "status": "completed"}, {"tx_id": "TX-9982", "amount": 2300.00, "currency": "EUR", "status": "pending"}]'
  },
  {
    id: '12',
    filename: 'user_preferences.xml',
    sourceFormat: 'XML',
    targetFormat: 'YAML',
    size: '156 KB',
    date: '2024-03-04',
    status: 'success',
    content: 'preferences:\n  theme: dark\n  notifications:\n    email: true\n    push: false\n  language: en-US'
  }
]

export default function DataCleanStudio() {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'settings'>('home')
  const [items, setItems] = useState<ConversionItem[]>(initialItems)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date')
  const [darkMode, setDarkMode] = useState(true)
  const [userName, setUserName] = useState('Alex Developer')
  const [inputContent, setInputContent] = useState('')
  const [outputContent, setOutputContent] = useState('')
  const [sourceFormat, setSourceFormat] = useState<'auto' | 'CSV' | 'JSON' | 'XML' | 'YAML'>('auto')
  const [targetFormat, setTargetFormat] = useState<'JSON' | 'CSV' | 'XML' | 'YAML'>('JSON')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [settingsFormErrors, setSettingsFormErrors] = useState<{ userName?: string }>({})

  useEffect(() => {
    const saved = localStorage.getItem('dataclean-items')
    const savedUser = localStorage.getItem('dataclean-user')
    const savedDark = localStorage.getItem('dataclean-dark')
    
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load items')
      }
    }
    
    if (savedUser) setUserName(savedUser)
    if (savedDark) setDarkMode(savedDark === 'true')
    
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('dataclean-items', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('dataclean-user', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('dataclean-dark', String(darkMode))
  }, [darkMode])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
  }

  const detectFormat = (content: string): string => {
    const trimmed = content.trim()
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        JSON.parse(trimmed)
        return 'JSON'
      } catch { }
    }
    if (trimmed.startsWith('<')) return 'XML'
    if (trimmed.includes(':') && !trimmed.includes(',')) return 'YAML'
    if (trimmed.includes(',') && trimmed.split('\n')[0].split(',').length > 1) return 'CSV'
    return 'TXT'
  }

  const convertData = async () => {
    if (!inputContent.trim()) {
      setValidationError('Please enter some content to convert')
      return
    }

    setIsConverting(true)
    setValidationError(null)

    try {
      const from = sourceFormat === 'auto' ? detectFormat(inputContent) : sourceFormat
      let result = ''
      let parsed: any

      switch (from) {
        case 'JSON':
          parsed = JSON.parse(inputContent)
          break
        case 'CSV':
          parsed = Papa.parse(inputContent, { header: true }).data
          break
        case 'XML':
          const parser = new XMLParser()
          parsed = parser.parse(inputContent)
          break
        case 'YAML':
          parsed = YAML.load(inputContent)
          break
        default:
          throw new Error('Unknown format')
      }

      switch (targetFormat) {
        case 'JSON':
          result = JSON.stringify(parsed, null, 2)
          break
        case 'CSV':
          if (Array.isArray(parsed)) {
            result = Papa.unparse(parsed)
          } else {
            result = Papa.unparse([parsed])
          }
          break
        case 'XML':
          const builder = new XMLBuilder({ format: true })
          result = builder.build(parsed)
          break
        case 'YAML':
          result = YAML.dump(parsed)
          break
      }

      setOutputContent(result)
      
      const newItem: ConversionItem = {
        id: generateId(),
        filename: `conversion_${Date.now()}.${from.toLowerCase()}`,
        sourceFormat: from,
        targetFormat: targetFormat,
        size: `${(inputContent.length / 1024).toFixed(1)} KB`,
        date: new Date().toISOString().split('T')[0],
        status: 'success',
        content: result
      }
      
      setItems(prev => [newItem, ...prev])
      showToast('Conversion completed successfully', 'success')
    } catch (err: any) {
      setValidationError(err.message || 'Conversion failed')
      showToast('Conversion failed: ' + err.message, 'error')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
    showToast('Item deleted', 'info')
  }

  const handleClear = () => {
    setInputContent('')
    setOutputContent('')
    setValidationError(null)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputContent)
    showToast('Copied to clipboard', 'success')
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputContent)
      setInputContent(JSON.stringify(parsed))
      showToast('Minified', 'success')
    } catch {
      showToast('Invalid JSON for minification', 'error')
    }
  }

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(inputContent)
      setInputContent(JSON.stringify(parsed, null, 2))
      showToast('Prettified', 'success')
    } catch {
      showToast('Invalid JSON for prettify', 'error')
    }
  }

  const handleFileLoad = (content: string, filename: string) => {
    setInputContent(content)
    showToast(`Loaded ${filename}`, 'success')
  }

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { userName?: string } = {}
    
    if (!userName.trim()) {
      errors.userName = 'Display name is required'
    }
    
    if (Object.keys(errors).length > 0) {
      setSettingsFormErrors(errors)
      return
    }
    
    setSettingsFormErrors({})
    showToast('Settings saved', 'success')
  }

  const handleExportData = () => {
    const data = JSON.stringify(items, null, 2)
    navigator.clipboard.writeText(data)
    showToast('All data copied to clipboard', 'success')
  }

  const filteredItems = items
    .filter(item => item.filename.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === 'name') return a.filename.localeCompare(b.filename)
      return 0
    })

  const stats = {
    total: items.length,
    success: items.filter(i => i.status === 'success').length,
    error: items.filter(i => i.status === 'error').length,
    formats: [...new Set(items.map(i => i.sourceFormat))].length
  }

  if (loading) {
    return (
      <div className="min-h-screen aurora-bg flex items-center justify-center">
        <div className="w-64 h-64 rounded-3xl skeleton" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen aurora-bg ${darkMode ? 'dark' : ''}`}>
      <nav className="sticky top-0 z-40 glass-card border-b border-white/10 rounded-none">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <FileCode className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">DataClean Studio</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'home' ? 'bg-white/10 text-emerald-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Home
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-emerald-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-white/10 text-emerald-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8 fade-in-up">
            <div className="text-center py-12">
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                Transform Your Data
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Convert between CSV, JSON, XML, and YAML with validation and formatting tools
              </p>
            </div>

            <div className="glass-card p-8">
              <FileDropzone onFileLoad={handleFileLoad} className="mb-6" />
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/80">Input</label>
                    <select 
                      value={sourceFormat}
                      onChange={(e) => setSourceFormat(e.target.value as any)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white"
                    >
                      <option value="auto">Auto Detect</option>
                      <option value="CSV">CSV</option>
                      <option value="JSON">JSON</option>
                      <option value="XML">XML</option>
                      <option value="YAML">YAML</option>
                    </select>
                  </div>
                  <CodeEditor 
                    value={inputContent}
                    onChange={setInputContent}
                    language={sourceFormat === 'auto' ? 'text' : sourceFormat.toLowerCase()}
                    error={validationError}
                    placeholder="Paste your data here or drag a file above..."
                  />
                  <div className="flex gap-2">
                    <button onClick={handleMinify} className="btn-secondary text-xs">
                      <Minimize2 className="w-3 h-3 mr-1" />
                      Minify
                    </button>
                    <button onClick={handlePrettify} className="btn-secondary text-xs">
                      <Maximize2 className="w-3 h-3 mr-1" />
                      Prettify
                    </button>
                    <button onClick={handleClear} className="btn-secondary text-xs text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/80">Output</label>
                    <select 
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value as any)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white"
                    >
                      <option value="JSON">JSON</option>
                      <option value="CSV">CSV</option>
                      <option value="XML">XML</option>
                      <option value="YAML">YAML</option>
                    </select>
                  </div>
                  <CodeEditor 
                    value={outputContent}
                    onChange={() => {}}
                    language={targetFormat.toLowerCase()}
                    placeholder="Converted output will appear here..."
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={convertData}
                      disabled={isConverting}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isConverting ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Convert
                    </button>
                    <button 
                      onClick={handleCopy}
                      disabled={!outputContent}
                      className="btn-secondary px-4 disabled:opacity-50"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Conversion History</h2>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input 
                      type="text"
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400/50"
                    />
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <Filter className="w-8 h-8 text-white/40" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No conversions found</h3>
                  <p className="text-white/60 mb-6">Start by converting your first file above</p>
                  <button onClick={() => setSearchQuery('')} className="btn-primary">
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, index) => (
                    <ConversionCard 
                      key={item.id} 
                      item={item} 
                      onDelete={handleDelete}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8 fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Total Conversions</span>
                  <FileCode className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-emerald-400 mt-2">+{items.filter(i => new Date(i.date) > new Date(Date.now() - 7*24*60*60*1000)).length} this week</div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Success Rate</span>
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%
                </div>
                <div className="text-sm text-white/60 mt-2">{stats.success} successful</div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Formats Used</span>
                  <ArrowUpDown className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.formats}</div>
                <div className="text-sm text-white/60 mt-2">Different types</div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Failed</span>
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.error}</div>
                <div className="text-sm text-red-400 mt-2">Needs attention</div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {items.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <div>
                        <p className="text-white font-medium">{item.filename}</p>
                        <p className="text-sm text-white/60">{item.sourceFormat} → {item.targetFormat}</p>
                      </div>
                    </div>
                    <span className="text-sm text-white/40">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
            
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="glass-card p-6 space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Display Name</label>
                  <input 
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g., John Smith"
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400/50 ${settingsFormErrors.userName ? 'border-red-500/50' : 'border-white/20'}`}
                  />
                  {settingsFormErrors.userName && (
                    <p className="mt-2 text-sm text-red-400">{settingsFormErrors.userName}</p>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-sm text-white/60">Toggle between light and dark themes</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {darkMode ? <Moon className="w-5 h-5 text-emerald-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                  </button>
                </div>
              </div>

              <div className="glass-card p-6 space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Data Management</h2>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Export All Data</p>
                    <p className="text-sm text-white/60">Copy all conversion history to clipboard</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleExportData}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export JSON
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-red-500/20">
                  <div>
                    <p className="text-white font-medium">Clear History</p>
                    <p className="text-sm text-white/60">Delete all conversion history permanently</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setItems([])
                      showToast('All history cleared', 'info')
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}
}
