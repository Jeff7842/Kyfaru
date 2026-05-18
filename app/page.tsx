'use client'

import Image from "next/image";
import React from "react";
import Header from "../components/header/header";
import Link from "next/link";
import "../components/styles/home.css";
import { useEffect, useRef } from "react";
import BackgroundPattern from "../components/BackgroundPattern"

// New homepage section components
import TrustStrip from "@/components/sections/TrustStrip";
import AboutSection from "@/components/sections/AboutSection";
import OrbitalServicesSection from "@/components/sections/OrbitalServicesSection";
import PageWrapper from "@/components/shared/PageWrapper";
import EcosystemSection from "@/components/sections/EcosystemSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ClientLogosStrip from "@/components/sections/ClientLogosStrip";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";

// Social icon definitions shared between the desktop rail and the mobile row
const SOCIAL_LINKS: Array<{ label: string; href: string; path: React.ReactNode; stroke?: boolean }> = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61583969110587",
    path: <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/kyfarulabs",
    path: <path d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: <path d="M18.336 18.339h-2.665v-4.177c0-.996-.02-2.278-1.39-2.278c-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387c2.7 0 3.2 1.778 3.2 4.092v4.714M7.004 8.575a1.546 1.546 0 0 1-1.548-1.549a1.548 1.548 0 1 1 1.547 1.549m1.336 9.764H5.667V9.75H8.34zM19.67 3H4.33C3.594 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.339C20.4 21 21 20.42 21 19.703V4.297C21 3.581 20.4 3 19.666 3z" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kyfaru.labs/",
    stroke: true,
    path: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
];

export default function Home() {
const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".fade-up-scroll, .fade-side-scroll");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((item) =>
            item.classList.add("animate")
          );
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
           
    <div className="min-h-screen overflow-x-hidden  scrollbar-thin-yellow">
       

      <div className="absolute inset-0 pointer-events-none z-20 opacity-0 fade-in-opacity bg-blend-soft-light pulse-in-opacity">
        <Image
          className="brightness-95 relative -left-20 -top-40 w-full h-full"
          src="/images/TheLight.png"
          alt=""
          width={8014}
          height={6133}
        ></Image>
      </div>

      <Header />

      {/* ============================================================
          HERO
          Mobile-first responsive layout. The previous build used hard
          pixel offsets (right-80, left-250, width=1200) that broke
          completely below ~1280px. This rewrite uses flex containers
          and clamp()-style breakpoints so the hero composes cleanly
          from a 360px phone up to 4K desktop.
          ============================================================ */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-44 pb-32 sm:pb-40 bg-[#0c3413]">
        {/* SVG decorative background */}
        <BackgroundPattern />

        {/* Vertical social rail \u2014 desktop only */}
        <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-7 z-30">
          {SOCIAL_LINKS.map((s, i) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="group block w-fit cursor-pointer fade-up"
              style={{ "--delay": `${0.8 + i * 0.3}s` } as React.CSSProperties}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-5 h-5 ${s.stroke ? "stroke-[#fbffe2] group-hover:stroke-[#efbc31] fill-none" : "text-[#fbffe2] group-hover:text-[#efbc31] fill-current"} transition-colors duration-300`}
                strokeWidth={s.stroke ? 2 : undefined}
              >
                {s.path}
              </svg>
            </Link>
          ))}
        </div>

        {/* Main column \u2014 always centred horizontally */}
        <main className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">
          {/* WELCOME TO line \u2014 centered on mobile, drifts left at lg */}
          <h1
            className="text-[#b9c0ba] font-body tracking-[0.35em] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal fade-up lg:self-start lg:ml-10"
            style={{ "--delay": "0s" } as React.CSSProperties}
          >
            WELCOME TO
          </h1>

          {/* Logo text \u2014 scales by viewport */}
          <div
            className="w-full flex justify-center pt-4 sm:pt-6 fade-up"
            style={{ "--delay": "0.5s" } as React.CSSProperties}
          >
            <Image
              src="/Logos/DarkLogosText.png"
              alt="Kyfaru"
              priority
              width={1200}
              height={210}
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 70vw, 60vw"
              className="w-[88vw] max-w-[640px] sm:w-[70vw] sm:max-w-[760px] lg:max-w-[920px] h-auto"
            />
          </div>

          {/* Gold tagline \u2014 right-aligned on lg, centred on mobile */}
          <h2
            className="text-[#efbc31] font-body tracking-[0.32em] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] pt-8 sm:pt-10 font-normal leading-relaxed fade-up text-center lg:self-end lg:text-right lg:mr-10"
            style={{ "--delay": "1s" } as React.CSSProperties}
          >
            DESIGNING SYSTEMS POWERING <br />
            AFRICA&apos;S FUTURE
          </h2>

          {/* Mobile social row \u2014 inline, lg+ uses the vertical rail above */}
          <div className="lg:hidden mt-12 flex items-center justify-center gap-6">
            {SOCIAL_LINKS.map((s, i) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="group block cursor-pointer fade-up"
                style={{ "--delay": `${0.8 + i * 0.15}s` } as React.CSSProperties}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-5 h-5 ${s.stroke ? "stroke-[#fbffe2] group-hover:stroke-[#efbc31] fill-none" : "text-[#fbffe2] group-hover:text-[#efbc31] fill-current"} transition-colors duration-300`}
                  strokeWidth={s.stroke ? 2 : undefined}
                >
                  {s.path}
                </svg>
              </Link>
            ))}
          </div>
        </main>

        {/* SCROLL indicator — visible on all screens; centered on mobile, right-aligned on md+ */}
        <div className="flex absolute bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-10 lg:right-16 flex-col items-center gap-3 z-20 pointer-events-none">
          <span
            className="text-[11px] md:text-[12px] tracking-[0.3rem] text-[#fbffe2] rotate-90 origin-center font-semibold fade-side"
            style={{ "--delay": "1.5s" } as React.CSSProperties}
          >
            SCROLL
          </span>
          <div
            className="relative w-px h-16 md:h-20 bg-white/0 overflow-hidden animate-scrollBounce fade-up"
            style={{ "--delay": "1.8s" } as React.CSSProperties}
          >
            <span className="absolute top-8 left-0 w-px h-20 bg-[#fbffe2] animate-scrollEffect" />
          </div>
        </div>
      </section>
      {/* ── New Kyfaru landing sections (wrapped with fade-in PageWrapper) ── */}
      <PageWrapper>
        <TrustStrip />
        <AboutSection />
        <OrbitalServicesSection />
        <EcosystemSection />
        <ProjectsSection />
        <ProcessSection />
        <IndustriesSection />
        <ClientLogosStrip />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </PageWrapper>
    </div>
    
  );
}
