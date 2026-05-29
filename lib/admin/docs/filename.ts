// Builds a download filename like "[Fechi] Invoice.pdf" from a project name.
export function docFilename(projectName: string | null | undefined, kind: string): string {
  const first = (projectName ?? '').trim().split(/\s+/)[0] || 'Document'
  return `[${first}] ${kind}.pdf`
}
