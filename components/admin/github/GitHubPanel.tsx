'use client'

import { useState, useEffect } from 'react'
import {GitCommit, GitPullRequest, CircleDot, Zap, ExternalLink, Link2, Unlink, Loader2, AlertCircle } from 'lucide-react';
import GithubIcon from '@iconify-react/mdi/github';
import { cn } from '@/lib/utils'
import { kfToast } from '@/lib/admin/toast'
import { format } from 'date-fns'

interface Commit {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

interface CIRun {
  name: string
  status: string
  conclusion: string | null
  url: string
  updatedAt: string
}

interface RepoData {
  linked: boolean
  owner?: string
  repo?: string
  commits?: Commit[]
  openPRs?: number
  openIssues?: number
  lastRun?: CIRun | null
}

interface GitHubPanelProps {
  projectId: string
  initialRepoUrl: string | null
}

const CI_COLORS: Record<string, string> = {
  success: 'text-green-600',
  failure: 'text-red-600',
  cancelled: 'text-zinc-400',
  skipped: 'text-zinc-400',
}

export default function GitHubPanel({ projectId, initialRepoUrl }: GitHubPanelProps) {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl ?? '')
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState(repoUrl)
  const [data, setData] = useState<RepoData | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (repoUrl) fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoUrl])

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/github/repo/${projectId}`)
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      setData(json)
    } catch {
      setError('Failed to fetch GitHub data')
    } finally {
      setLoading(false)
    }
  }

  async function handleLink() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/github/link/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: input || null }),
      })
      const json = await res.json()
      if (!res.ok) { kfToast.error(json.error ?? 'Failed to link repo'); return }
      kfToast.success(input ? 'Repository linked' : 'Repository unlinked')
      setRepoUrl(input)
      setEditing(false)
      if (!input) setData(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="kf-card rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-zinc-900 text-white">
          <GithubIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--kf-text)]">GitHub</h3>
          <p className="text-xs text-[var(--kf-text-muted)]">
            {repoUrl ? repoUrl.replace('https://github.com/', '') : 'No repository linked'}
          </p>
        </div>
        <button
          onClick={() => { setEditing(!editing); setInput(repoUrl) }}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          title={repoUrl ? 'Change repository' : 'Link repository'}
        >
          {repoUrl ? <Link2 className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </button>
        {repoUrl && (
          <a href={repoUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition" title="Open on GitHub">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {editing && (
        <div className="mb-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="flex-1 h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20"
          />
          <button
            onClick={handleLink}
            disabled={saving}
            className="h-9 px-4 rounded-lg bg-[var(--kf-green)] text-white text-sm font-medium flex items-center gap-1.5 hover:bg-[var(--kf-green-dark)] transition disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Save
          </button>
          {repoUrl && (
            <button
              onClick={() => { setInput(''); handleLink() }}
              className="h-9 px-3 rounded-lg border border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-200 transition text-sm"
              title="Unlink"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {!repoUrl && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="w-full h-9 rounded-lg border-2 border-dashed border-zinc-200 text-zinc-400 hover:border-[var(--kf-green)] hover:text-[var(--kf-green)] text-sm transition"
        >
          + Link a repository
        </button>
      )}

      {repoUrl && loading && (
        <div className="flex items-center justify-center py-6 text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading GitHub data…</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {data?.linked && !loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Open PRs" value={data.openPRs ?? 0} icon={<GitPullRequest className="w-4 h-4" />} />
            <Stat label="Open Issues" value={data.openIssues ?? 0} icon={<CircleDot className="w-4 h-4" />} />
            <Stat
              label="CI"
              value={data.lastRun?.conclusion ?? data.lastRun?.status ?? '—'}
              icon={<Zap className="w-4 h-4" />}
              valueClass={CI_COLORS[data.lastRun?.conclusion ?? ''] ?? 'text-zinc-600'}
              href={data.lastRun?.url}
            />
          </div>

          {(data.commits ?? []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--kf-text-muted)] uppercase tracking-wide mb-2">
                Recent commits
              </p>
              <div className="space-y-1.5">
                {(data.commits ?? []).map((c) => (
                  <a
                    key={c.sha}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-2 group rounded-lg px-2 py-1.5 hover:bg-zinc-50 transition"
                  >
                    <GitCommit className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-800 truncate group-hover:text-[var(--kf-green)]">
                        {c.message}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {c.author} · {format(new Date(c.date), 'dd MMM HH:mm')}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0">{c.sha}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({
  label, value, icon, valueClass, href,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  valueClass?: string
  href?: string
}) {
  const body = (
    <div className="bg-zinc-50 rounded-xl p-3 text-center">
      <div className="flex justify-center text-zinc-400 mb-1">{icon}</div>
      <p className={cn('text-sm font-semibold', valueClass ?? 'text-zinc-800')}>{value}</p>
      <p className="text-[11px] text-zinc-400 mt-0.5">{label}</p>
    </div>
  )
  if (href) return <a href={href} target="_blank" rel="noreferrer" className="hover:scale-105 transition">{body}</a>
  return body
}
