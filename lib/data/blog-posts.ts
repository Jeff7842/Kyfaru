// ============================================================
// BLOG POSTS — PLACEHOLDER DATA
// Replace these with real posts. Categories: 'AI & Tech',
// 'Product Update', 'Guide'.
// ============================================================

import type { BlogPost } from '@/types'

/** Blog posts shown on /blog */
export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-in-kenyan-schools',
    title: 'How AI Is Quietly Transforming Kenyan Classrooms',
    excerpt:
      'Five practical ways AI is already helping teachers, students, and administrators across the country — beyond the hype.',
    publishedAt: '2025-05-01',
    category: 'AI & Tech',
    readTime: '6 min read',
  },
  {
    slug: 'why-ussd-still-matters',
    title: 'Why USSD Still Matters in 2025',
    excerpt:
      'Despite the smartphone revolution, USSD remains the most inclusive digital channel in Africa. Here is why we keep building for it.',
    publishedAt: '2025-04-15',
    category: 'Guide',
    readTime: '4 min read',
  },
  {
    slug: 'kyfaru-launches-stackable-academy',
    title: 'Stackable Academy Is Now Live',
    excerpt:
      'Our digital learning arm officially opens its doors. Free starter courses for educators across East Africa.',
    publishedAt: '2025-03-22',
    category: 'Product Update',
    readTime: '3 min read',
  },
]

/**
 * Returns all blog posts sorted by most recent first.
 */
export function getAllBlogPosts(): BlogPost[] {
  try {
    return [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  } catch (error) {
    console.error('[getAllBlogPosts] Error:', error)
    return []
  }
}

/**
 * Looks up one blog post by slug.
 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  try {
    return blogPosts.find((post) => post.slug === slug)
  } catch (error) {
    console.error('[getBlogPostBySlug] Error:', error)
    return undefined
  }
}
