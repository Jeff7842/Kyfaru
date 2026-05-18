// ============================================================
// BLOG POST PAGE (dynamic [slug])
// Placeholder full-post layout — single-column editorial style.
// Replace lorem text with real post content as posts are added.
// ============================================================

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Icon } from '@iconify/react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import { getBlogPostBySlug, blogPosts } from '@/lib/data/blog-posts'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Pre-generate static paths for all blog posts */
export function generateStaticParams() {
  try {
    return blogPosts.map((post) => ({ slug: post.slug }))
  } catch (error) {
    console.error('[BlogPost] generateStaticParams error:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      {/* Article wrapper */}
      <article className="bg-ky-base pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-ky-muted hover:text-ky-gold transition-colors font-display tracking-wider mb-10"
          >
            <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
            <span>BACK TO BLOG</span>
          </Link>

          {/* Article header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase px-2.5 py-1 bg-ky-raised text-ky-gold-hi font-display">
                {post.category}
              </span>
              <span className="text-xs text-ky-faint font-inter">{post.readTime}</span>
              <span className="text-xs text-ky-faint font-inter">·</span>
              <span className="text-xs text-ky-faint font-inter">{formatDate(post.publishedAt)}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-semibold text-ky-ivory tracking-tight font-display leading-[1.1] mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-ky-muted leading-relaxed font-inter">
              {post.excerpt}
            </p>
          </header>

          {/* Article body — placeholder content */}
          <div className="prose prose-invert max-w-none flex flex-col gap-6 text-base md:text-lg text-ky-ivory/85 leading-relaxed font-inter">
            <p>
              This is a placeholder article body. Replace it with real post content when you publish this entry. Editorial typography is intentionally generous — wide line-height, large body sizes — so readers settle in.
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-ky-ivory font-display tracking-tight mt-6">
              A section heading.
            </h2>
            <p>
              Sub-sections break up long-form pieces. Use them generously. The Kyfaru editorial voice is precise, practical, and rooted in real African context — never marketing copy dressed up as a blog post.
            </p>
            <blockquote className="border-l-2 border-ky-gold pl-6 text-xl text-ky-ivory italic font-inter">
              Pull quotes work best when they say something genuinely surprising or useful, not when they just restate the headline.
            </blockquote>
            <p>
              Wrap up with a clear takeaway. Tell the reader what to do with what they just read.
            </p>
          </div>

          {/* Footer / CTA */}
          <div className="mt-16 pt-10 border-t border-ky-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-sm text-ky-muted font-inter">Found this useful? Talk to us about your project.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 gold-gradient-bg text-ky-base px-6 py-3 text-sm font-display tracking-[0.15em] font-semibold uppercase"
            >
              <span>Get in Touch</span>
              <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
