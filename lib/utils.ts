// ============================================================
// UTILITY FUNCTIONS
// General-purpose helpers used across the entire project.
// Import as: import { cn, truncate, formatDate } from '@/lib/utils'
// ============================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS class names safely, resolving conflicts.
 * Use this instead of string concatenation everywhere.
 * Example: cn('text-red-500', isActive && 'font-bold', 'p-4')
 */
export function cn(...inputs: ClassValue[]): string {
  try {
    return twMerge(clsx(inputs))
  } catch (error) {
    console.error('[cn] Class merge error:', error)
    return ''
  }
}

/**
 * Cuts a string at maxLength characters and adds '...' if needed.
 * @param text      — The string to truncate
 * @param maxLength — Max characters before cutting (default: 120)
 */
export function truncate(text: string, maxLength: number = 120): string {
  try {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trimEnd() + '...'
  } catch (error) {
    console.error('[truncate] Error:', error)
    return text ?? ''
  }
}

/**
 * Converts an ISO date string to a human-readable format.
 * Example: '2025-05-01' → 'May 1, 2025'
 */
export function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString))
  } catch (error) {
    console.error('[formatDate] Error formatting date:', error)
    return dateString
  }
}

/**
 * Builds a thum.io screenshot URL for a given live website URL.
 * thum.io is a free screenshot service — no API key required.
 */
const url = 'https://kyfaru.com';

export function getProjectScreenshotUrl(
  liveUrl: string,
  width: number = 1200,
  crop: number = 675
): string {
  try {
    if (!liveUrl) return ''
    return `//image.thum.io/get/width/${width}/crop/${crop}/${liveUrl}`
  } catch (error) {
    console.error('[getProjectScreenshotUrl] Error building URL:', error)
    return ''
  }
}
