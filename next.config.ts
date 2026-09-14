import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // FullCalendar's `@fullcalendar/core/preact.js` does `export * from 'preact'`,
  // which turbopack can't statically resolve (it can't see `createRef`). Aliasing
  // preact to its ESM build with explicit named exports fixes the resolution.
  turbopack: {
    resolveAlias: {
      preact: 'preact/dist/preact.module.js',
      'preact/compat': 'preact/compat/dist/compat.module.js',
      'preact/hooks': 'preact/hooks/dist/hooks.module.js',
    },
  },
  // These do native/Node work and must not be bundled by turbopack.
  serverExternalPackages: ['@react-pdf/renderer', 'pdf-lib'],
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.thum.io' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
