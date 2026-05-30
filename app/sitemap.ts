import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/data/blog-posts'
import { caseStudies } from '@/lib/data/case-studies'

const baseUrl = 'https://kyfaru.com'

const staticRoutes = [
  '/',
  '/about',
  '/blog',
  '/case-studies',
  '/contact',
  '/Home',
  '/newsroom',
  '/pricing',
  '/projects',
  '/quote',
  '/solutions',
]

const buildUrl = (path: string) => new URL(path, baseUrl).toString()

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((path) => ({
    url: buildUrl(path),
    lastModified: new Date(),
  }))

  const blogEntries = blogPosts.map((post) => ({
    url: buildUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt),
  }))

  const caseStudyEntries = caseStudies.map((study) => ({
    url: buildUrl(`/case-studies/${study.slug}`),
    lastModified: new Date(),
  }))

  return [...staticEntries, ...blogEntries, ...caseStudyEntries]
}
