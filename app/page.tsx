'use client'

import Image from "next/image";
import React from "react";
import Header from "../components/header/header";
import Link from "next/link";
import "../components/styles/home.css";
import Grid from "../components/grid";
import { styled } from "styled-components";
import { useEffect, useRef } from "react";
import BackgroundPattern from "../components/BackgroundPattern"

export default function Home() {

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: radial-gradient(
      circle at top,
      rgba(255, 255, 255, 0.05),
      transparent 60%
    ),
    #0b0f1a;
  overflow: hidden;
`;
  
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
      <section className="text-center justify-center pt-85 pb-40 px-4 bg-[#0c3413]">
{/* SVG BACKGROUND */}
      <BackgroundPattern />
        <main>
          {/* Main content goes here */}

          {/* Text content */}
          <div className="text-center mb-30 fade-container">
  <h1
    className="text-[#b9c0ba] font-body tracking-[5px] text-[22px] pb-1 font-normal relative right-80 fade-up"
    style={{ "--delay": "0s" } as React.CSSProperties}
  >
    WELCOME TO
  </h1>

  <div
    className="w-full h-full flex justify-center pt-6 fade-up"
    style={{ "--delay": "0.5s" } as React.CSSProperties}
  >
    <Image
      src="/Logos/DarkLogosText.png"
      className="mx-auto"
      alt="Kyfaru Logo"
      width={1200}
      height={210}
    />
  </div>

  <h1
    className="text-[#efbc31] font-body tracking-[5px] text-[22px] pt-10 text-left relative left-250 font-normal fade-up"
    style={{ "--delay": "1s" } as React.CSSProperties}
  >
    DESIGNING SYSTEMS POWERING <br /> AFRICA&apos;S FUTURE
  </h1>
</div>

          <div>
            {/* Socials content */}
            <div className="relative z-50 ">
              <div className="social-content flex flex-col pl-8 space-y-8 h-25">
                {/* Facebook */}
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-fit cursor-pointer fade-up"
                  style={{ "--delay": "0.8s" } as React.CSSProperties}
                >
                  <svg
                    className="w-5.5 h-5.5 text-[#fbffe2] group-hover:text-[#efbc31] transition-colors duration-300 pointer-events-auto"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
                  </svg>
                </Link>

                {/* X / Twitter */}
                <Link
                  href="https://x.com"
                  target="_blank"
                  className="group block w-fit cursor-pointer fade-up"
                  style={{ "--delay": "1.2s" } as React.CSSProperties}
                >
                  <svg
                    className="w-5.5 h-5.5 text-[#fbffe2] group-hover:text-[#efbc31] transition-colors duration-300"

                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z" />
                  </svg>
                </Link>

                {/* LinkedIn */}
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  className="group block w-fit cursor-pointer fade-up"
                  style={{ "--delay": "1.5s" } as React.CSSProperties}
                >
                  <svg
                    className="w-5.5 h-5.5 text-[#fbffe2] group-hover:text-[#efbc31] transition-colors duration-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.336 18.339h-2.665v-4.177c0-.996-.02-2.278-1.39-2.278c-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387c2.7 0 3.2 1.778 3.2 4.092v4.714M7.004 8.575a1.546 1.546 0 0 1-1.548-1.549a1.548 1.548 0 1 1 1.547 1.549m1.336 9.764H5.667V9.75H8.34zM19.67 3H4.33C3.594 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.339C20.4 21 21 20.42 21 19.703V4.297C21 3.581 20.4 3 19.666 3z" />
                  </svg>
                </Link>

                {/* Instagram (Stroke Icon) */}
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="group block w-fit cursor-pointer fade-up"
                  style={{ "--delay": "1.8s" } as React.CSSProperties}
                >
                  <svg
                    className="w-5.5 h-5.5 stroke-[#fbffe2] group-hover:stroke-[#efbc31] transition-colors duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37" />
                    <path d="M17.5 6.5h.01" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* Sticky container */}
              <div className="absolute -bottom-22.5 right-25 flex flex-col items-center gap-3 z-0 pointer-events-none">
                {" "}
                <div className="flex flex-col items-center gap-3 sticky">
                  {" "}
                  <span className="text-[14px] tracking-[0.3rem] text-[#fbffe2] rotate-90 origin-center font-bold fade-side" style={{ "--delay": "1.5s" } as React.CSSProperties}>
                    {" "}
                    SCROLL{" "}
                  </span>{" "}
                  <div className="relative w-px h-25 bg-white/0 overflow-hidden animate-scrollBounce fade-up" style={{ "--delay": "1.8s" } as React.CSSProperties}>
                    {" "}
                    <span className="absolute top-8 left-0 w-px h-25 bg-[#fbffe2] animate-scrollEffect" />{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            </div>
          </div>
        </main>
      </section>
       <PageWrapper>
      <section className="bg-[#fbffe2] min-h-screen" >
        {/* hero Section */}

          <div style={{ position: "relative", zIndex: 2 }} ref={containerRef}>
<Grid />

        <div className="text-center pt-85 pb-40 px-4">
          <h2 className="text-[#0c3413] font-body tracking-[5px] text-[22px] pb-1 font-normal fade-up-scroll" ref={containerRef} style={{ "--delay": "0.2s" } as React.CSSProperties}>
            OUR MISSION
          </h2>
          <p className="text-[#0c3413] max-w-3xl mx-auto mt-6 text-lg leading-7 fade-up-scroll" ref={containerRef} style={{ "--delay": "0.5s" } as React.CSSProperties}>
            At Kyfaru, our mission is to design and implement cutting-edge
            systems that drive Africa&apos;s technological advancement. We are
            committed to empowering communities, fostering innovation, and
            creating sustainable solutions that address the unique challenges
            faced by the continent. Through collaboration and a deep
            understanding of local needs, we strive to build a future where
            technology serves as a catalyst for growth, development, and
            prosperity across Africa.
          </p>
        </div>
</div>

      </section>
</PageWrapper>
    </div>
    
  );
}
