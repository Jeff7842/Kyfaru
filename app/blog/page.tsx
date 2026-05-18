// ============================================================
// BLOG LISTING PAGE
// 3-col grid of cards from blog-posts.ts, sorted by recent first.
// ============================================================

import Link from 'next/link'
import { Icon } from '@iconify/react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import { getAllBlogPosts } from '@/lib/data/blog-posts'
import { formatDate } from '@/lib/utils'

/** Renders the Blog listing page. */
export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="The Kyfaru Journal"
        labelIcon="heroicons:newspaper"
        headline={{ lead: 'Insights from', accent: 'the build floor', tail: '.' }}
        subtitle="Practical writing about AI, engineering, design, and the realities of building technology in Africa."
      />

      {/* Post grid */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-ky-muted font-inter">
              No posts published yet. Check back soon.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-ky-surface ghost-border card-lift p-7 md:p-8 flex flex-col"
                >
                  {/* Top row — category + read time */}
                  <div className="flex items-center justify-between mb-7">
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase px-2.5 py-1 bg-ky-raised text-ky-gold-hi font-display">
                      {post.category}
                    </span>
                    <span className="text-xs text-ky-faint font-inter">{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold text-ky-ivory tracking-tight font-display mb-4 leading-tight group-hover:text-ky-gold transition-colors flex-1">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-ky-muted leading-relaxed font-inter mb-6">
                    {post.excerpt}
                  </p>

                  {/* Bottom row — date + arrow */}
                  <div className="flex items-center justify-between pt-5 border-t border-ky-border/50">
                    <span className="text-xs text-ky-faint font-inter">{formatDate(post.publishedAt)}</span>
                    <Icon icon="heroicons:arrow-right" className="w-4 h-4 text-ky-muted transition-all group-hover:text-ky-gold group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
