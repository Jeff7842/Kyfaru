// Shared bits genuinely common to agreement-docx.ts and scope-docx.ts.
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const LOGO_PATH = path.join(process.cwd(), 'public', 'Logos', 'Kyfaru Logo-08.png')
// Real aspect ratio of the source artwork (5420x1635) - keep any resize proportional.
export const LOGO_ASPECT = 5420 / 1635

let cachedLogoBytes: Buffer | null = null
export async function getKyfaruLogoBytes(): Promise<Buffer> {
  if (!cachedLogoBytes) cachedLogoBytes = await readFile(LOGO_PATH)
  return cachedLogoBytes
}

// 1.5x line spacing, restoring what Fechi's real signed Agreement/SOW shipped with.
export const LINE_1_5X = { line: 360, lineRule: 'auto' as const }
