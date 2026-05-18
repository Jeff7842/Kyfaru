import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne, DM_Sans, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import CeraCy from 'next/font/local';
import SInhala from 'next/font/local';
import Providers from '@/providers/Providers';

// Existing local fonts — kept intact
const ceraCy = CeraCy({
  src: [
    { path: '/fonts/Cera-CY-Regular.ttf', weight: '200', style: 'thin' },
    { path: '/fonts/Cera-CY-Regular.ttf', weight: '400', style: 'normal' },
    { path: '/fonts/Cera-CY-Bold.ttf', weight: '700', style: 'bold' },
  ],
  display: 'swap',
  variable: "--font-cera-cy",
});

const sinhala = SInhala({
  src: [
    { path: '/fonts/SinhalaMN.woff', weight: '200', style: 'thin' },
    { path: '/fonts/SinhalaMN.woff', weight: '400', style: 'normal' },
    { path: '/fonts/SinhalaMN-Bold.woff', weight: '700', style: 'bold' },
  ],
  display: 'swap',
  variable: "--font-sinhala",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// New brand fonts — Stitch design system

/* Syne — Architectural display font (alternate headlines) */
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

/* DM Sans — Body alternative */
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

/* Space Grotesk — Primary headline font (Stitch directive) */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

/* Inter — Primary body font (Stitch directive) */
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Kyfaru — Designing Systems Powering Africa's Future",
  description:
    'Kyfaru is a Kenyan technology company that builds web apps, mobile apps, AI systems, USSD solutions, and digital infrastructure for businesses and institutions across Africa.',
  keywords: [
    'web development Kenya',
    'mobile app development Nairobi',
    'USSD solutions Africa',
    'school management system Kenya',
    'African tech company',
    'Kyfaru',
  ],
  openGraph: {
    title: 'Kyfaru — Technology Systems for Africa',
    description:
      'Web apps, mobile apps, AI, USSD and digital infrastructure. Built in Kenya for the world.',
    url: 'https://kyfaru.vercel.app',
    siteName: 'Kyfaru',
    locale: 'en_KE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ceraCy.variable} ${sinhala.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
