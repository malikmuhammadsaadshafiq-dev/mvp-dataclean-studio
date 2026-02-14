import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function validateJSON(str: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(str)
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}

export function validateYAML(str: string): { valid: boolean; error?: string } {
  try {
    const YAML = require('js-yaml')
    YAML.load(str)
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}

export function validateXML(str: string): { valid: boolean; error?: string } {
  try {
    const { XMLParser } = require('fast-xml-parser')
    const parser = new XMLParser()
    parser.parse(str)
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}

export function detectFormat(content: string, filename: string): 'csv' | 'json' | 'xml' | 'yaml' | 'unknown' {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'csv') return 'csv'
  if (ext === 'json') return 'json'
  if (ext === 'xml') return 'xml'
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  
  const trimmed = content.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json'
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) return 'xml'
  if (trimmed.includes('---') || trimmed.includes(':')) return 'yaml'
  if (trimmed.includes(',') && !trimmed.includes('{')) return 'csv'
  
  return 'unknown'
}

export function convertData(data: any, from: string, to: string): string {
  let parsed = data
  
  if (from === 'json') {
    if (typeof data === 'string') parsed = JSON.parse(data)
  } else if (from === 'yaml') {
    const YAML = require('js-yaml')
    if (typeof data === 'string') parsed = YAML.load(data)
  } else if (from === 'xml') {
    const { XMLParser } = require('fast-xml-parser')
    const parser = new XMLParser()
    if (typeof data === 'string') parsed = parser.parse(data)
  } else if (from === 'csv') {
    const Papa = require('papaparse')
    if (typeof data === 'string') {
      parsed = Papa.parse(data, { header: true }).data
    }
  }
  
  if (to === 'json') {
    return JSON.stringify(parsed, null, 2)
  } else if (to === 'yaml') {
    const YAML = require('js-yaml')
    return YAML.dump(parsed)
  } else if (to === 'xml') {
    const { XMLBuilder } = require('fast-xml-parser')
    const builder = new XMLBuilder()
    return builder.build(parsed)
  } else if (to === 'csv') {
    const Papa = require('papaparse')
    return Papa.unparse(parsed)
  }
  
  return String(parsed)
}

export function minifyJSON(str: string): string {
  return JSON.stringify(JSON.parse(str))
}

export function prettifyJSON(str: string): string {
  return JSON.stringify(JSON.parse(str), null, 2)
}

export function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

export function unescapeString(str: string): string {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
}

export function formatCurrency(amount: number | string): string { const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0); }

export function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export function truncate(str: string, len: number): string { return str.length > len ? str.slice(0, len) + '...' : str; }

export function slugify(str: string): string { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
}}
