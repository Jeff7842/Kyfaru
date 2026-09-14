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
  // invoice-pdf.ts/quote-pdf.ts read @fontsource .woff files off disk at
  // runtime via a plain path.join() string (deliberately not a static
  // import/require, which would break turbopack bundling of the .woff as a
  // JS module) - but that same dynamic-path trick means Vercel's output file
  // tracer can't see the dependency either, so it gets dropped from the
  // deployed serverless function and every PDF export 500s with ENOENT.
  // Explicitly re-include them here.
  outputFileTracingIncludes: {
    '/api/admin/invoices/[id]/pdf': ['./node_modules/@fontsource/**/*.woff'],
    '/api/admin/projects/[id]/quote/pdf': ['./node_modules/@fontsource/**/*.woff'],
  },
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
