'use client'

import React from 'react';
import styled from 'styled-components';
import './header/header.css';
import { useEffect, useRef } from "react";

export default function Pattern() {     
    const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("grid-fade-in-opacity");
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

const StyledWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  .grid-background {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(0, 0, 0, 0.3) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 1px, transparent 1px);
    background-size: 60px 80px;

    -webkit-mask-image: radial-gradient(
      ellipse 70% 60% at 50% 0%,
      #000 60%,
      transparent 100%
    );
    mask-image: radial-gradient(
      ellipse 70% 60% at 50% 0%,
      #000 60%,
      transparent 100%
    );
  }
`;
  return (
    <StyledWrapper>
      <div className="grid-background" ref={gridRef} />
    </StyledWrapper>
  );

}
