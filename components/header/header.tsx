// Legacy entry point — the implementation lives in Navbar.tsx now.
// Keeping this file so existing `import Header from '@/components/header/header'`
// statements throughout the app continue to work.
import Navbar from './Navbar'

export default function Header() {
  return <Navbar />
}

// ── Legacy markup removed ── superseded by Navbar.tsx ──
