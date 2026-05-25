'use client'

import { useEffect } from 'react'
import {CheckCircle2, AlertCircle, Link2 } from 'lucide-react';
import GithubIcon from '@iconify-react/mdi/github';
import { kfToast } from '@/lib/admin/toast'

interface GitHubConnectCardProps {
  githubLogin: string | null
  githubStatus: string | null
}

export default function GitHubConnectCard({ githubLogin, githubStatus }: GitHubConnectCardProps) {
  useEffect(() => {
    if (githubStatus === 'connected') kfToast.success(`GitHub connected as @${githubLogin}`)
    if (githubStatus === 'error') kfToast.error('GitHub connection failed. Please try again.')
  }, [githubStatus, githubLogin])

  return (
    <div className="kf-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-zinc-900 text-white">
          <GithubIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--kf-text)]">GitHub Integration</h3>
          <p className="text-xs text-[var(--kf-text-muted)]">
            Connect your GitHub account to link repositories to projects.
          </p>
        </div>
      </div>

      {githubLogin ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">Connected</p>
            <p className="text-xs text-green-600">Signed in as @{githubLogin}</p>
          </div>
          <a
            href="/api/admin/github/oauth/start"
            className="ml-auto text-xs text-green-700 hover:underline flex items-center gap-1"
          >
            <Link2 className="w-3 h-3" />
            Reconnect
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {githubStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Connection failed. Make sure github credentials are set.
            </div>
          )}
          <a
            href="/api/admin/github/oauth/start"
            className="flex items-center justify-center gap-2 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium transition w-full"
          >
            <GithubIcon className="w-4 h-4" />
            Connect GitHub Account
          </a>
        </div>
      )}
    </div>
  )
}
