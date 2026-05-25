// ============================================================
// FOOTER
// Site-wide footer. Logo + 4 link columns + social icons +
// bottom bar with copyright + dynamic year.
// ============================================================

import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'

/** Footer link column data — change here to update every column */
const FOOTER_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us',     href: '/about' },
      { label: 'The Ecosystem', href: '/about#ecosystem' },
      { label: 'Newsroom',     href: '/newsroom' },
      { label: 'Contact',      href: '/contact' },
    ],
  },
  {
    title: 'Work',
    links: [
      { label: 'Projects',       href: '/projects' },
      { label: 'Case Studies',   href: '/case-studies' },
      { label: 'Solutions',      href: '/solutions' },
      { label: 'Pricing',        href: '/pricing' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Web Development',    href: '/solutions#web-app' },
      { label: 'Mobile Apps',         href: '/solutions#mobile-app' },
      { label: 'AI Integration',      href: '/solutions#ai' },
      { label: 'USSD Solutions',      href: '/solutions#ussd' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog',         href: '/blog' },
      { label: 'Mwamba AI',     href: '#' },
      { label: 'Stackable',    href: '#' },
      { label: 'Kiliforge',    href: '#' },
    ],
  },
]

const SOCIAL_LINKS = [
  { icon: 'ri:linkedin-box-fill', label: 'LinkedIn',  href: 'https://linkedin.com' },
  { icon: 'ri:twitter-x-fill',    label: 'Twitter/X', href: 'https://x.com/kyfarulabs' },
  { icon: 'ri:instagram-fill',    label: 'Instagram', href: 'https://www.instagram.com/kyfaru.labs/' },
  { icon: 'ri:facebook-fill',     label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61583969110587' },
]

/**
 * Site-wide footer.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ky-base border-t border-ky-border">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* Top grid — logo column + 4 link columns */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          {/* Logo + tagline + socials — wider column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/Logos/DarkLogosText.png"
                alt="Kyfaru"
                width={180}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            <p className="text-sm text-ky-muted leading-relaxed font-inter max-w-xs mb-7">
              The Kenyan technology company designing systems that power Africa&apos;s future — across web, mobile, AI, and infrastructure.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-ky-surface border border-ky-border flex items-center justify-center text-ky-muted hover:text-ky-gold hover:border-ky-gold-dim transition-colors"
                >
                  <Icon icon={social.icon} className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-ky-gold font-display mb-5">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ky-muted hover:text-ky-ivory font-inter transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-ky-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-ky-faint font-inter">
            © {currentYear} Kyfaru. Designed and built in Africa.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-xs text-ky-faint hover:text-ky-ivory transition-colors font-inter">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-ky-faint hover:text-ky-ivory transition-colors font-inter">
              Terms & Services
            </Link>
            <Link href="/contact" className="text-xs text-ky-gold hover:text-ky-gold-hi transition-colors font-display tracking-wider">
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
