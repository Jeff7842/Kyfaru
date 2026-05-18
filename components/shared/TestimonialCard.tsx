// ============================================================
// TESTIMONIAL CARD
// Glassmorphism card with oversized gold quote mark, author
// initials avatar, and metadata.
// ============================================================

import { Icon } from '@iconify/react'
import type { Testimonial } from '@/types'

interface TestimonialCardProps {
  testimonial: Testimonial
}

/**
 * Derives 2-letter initials from a full name.
 */
function getInitials(name: string): string {
  try {
    return name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase()
  } catch (error) {
    console.error('[getInitials] Error:', error)
    return '??'
  }
}

/**
 * One testimonial card.
 */
export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = getInitials(testimonial.author)

  return (
    <article className="relative bg-ky-surface ghost-border ky-rounded card-lift p-8 md:p-10 flex flex-col">
      {/* Giant gold quote mark watermark */}
      <Icon
        icon="heroicons:chat-bubble-bottom-center-text-solid"
        className="absolute top-6 right-6 w-10 h-10 text-ky-gold/15"
      />

      {/* Quote */}
      <blockquote className="text-base md:text-lg text-ky-ivory/90 leading-relaxed font-inter mb-8 flex-1">
        <span className="text-ky-gold font-display mr-1">&ldquo;</span>
        {testimonial.quote}
        <span className="text-ky-gold font-display ml-1">&rdquo;</span>
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-ky-border/50">
        <div className="w-11 h-11 rounded-full bg-ky-raised border border-ky-border-hi flex items-center justify-center text-ky-gold font-semibold font-display text-sm">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-ky-ivory font-semibold text-sm font-display truncate">
            {testimonial.author}
          </p>
          <p className="text-ky-muted text-xs font-inter truncate">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  )
}
