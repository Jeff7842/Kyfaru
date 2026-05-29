'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Mail, MessageSquare, Phone, Send, Loader2, Smile, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/admin/utils'
import { kfToast } from '@/lib/admin/toast'

type Channel = 'email' | 'sms' | 'whatsapp'

interface ThreadClient { id: string; name: string; email: string | null; phone: string | null; whatsappNumber: string | null; logoUrl: string | null }
interface Thread { client: ThreadClient; lastMessage: { body: string; channel: string; direction: string; createdAt: string } | null }
interface Message { id: string; channel: string; direction: string; subject: string | null; body: string; createdAt: string }

const EMOJIS = ['😀','😅','🙏','👍','🎉','🔥','✅','❤️','😊','🤝','📌','⚡','💡','📞','📧','💬']

const CHANNELS: { value: Channel; label: string; icon: typeof Mail }[] = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { value: 'sms', label: 'SMS', icon: Phone },
]

export default function CommsCenter() {
  const qc = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [channel, setChannel] = useState<Channel>('email')
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)

  const { data: threadsData, isLoading: threadsLoading } = useQuery({
    queryKey: ['comms-threads'],
    queryFn: async () => (await fetch('/api/admin/communications/threads')).json() as Promise<{ threads: Thread[] }>,
  })
  const threads = (threadsData?.threads ?? []).filter((t) =>
    t.client.name.toLowerCase().includes(search.toLowerCase()),
  )
  const active = threads.find((t) => t.client.id === activeId) ?? null

  const { data: msgData } = useQuery({
    queryKey: ['comms-thread', activeId],
    queryFn: async () => (await fetch(`/api/admin/communications/${activeId}`)).json() as Promise<{ messages: Message[] }>,
    enabled: !!activeId,
  })
  const messages = msgData?.messages ?? []

  async function send() {
    if (!activeId || (!text.trim())) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/communications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: activeId, channel, message: text, subject: subject || undefined }),
      })
      const data = await res.json()
      if (!res.ok) return kfToast.error(data.error ?? 'Send failed')
      kfToast.success('Message sent')
      setText(''); setSubject('')
      qc.invalidateQueries({ queryKey: ['comms-thread', activeId] })
      qc.invalidateQueries({ queryKey: ['comms-threads'] })
    } catch {
      kfToast.error('Something went wrong')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 md:-m-6 bg-white">
      {/* LEFT — thread list */}
      <aside className="w-72 lg:w-80 border-r border-zinc-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-zinc-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients…" className="kf-input w-full pl-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threadsLoading && <div className="p-4 text-sm text-zinc-400">Loading…</div>}
          {threads.map((t) => (
            <button
              key={t.client.id}
              onClick={() => setActiveId(t.client.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 text-left border-b border-zinc-50 hover:bg-zinc-50 transition',
                activeId === t.client.id && 'bg-[var(--kf-green)]/5',
              )}
            >
              <div className="w-9 h-9 rounded-full bg-[var(--kf-green)]/10 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[var(--kf-green)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-zinc-800 truncate">{t.client.name}</div>
                <div className="text-xs text-zinc-400 truncate">
                  {t.lastMessage ? `${t.lastMessage.direction === 'inbound' ? '↙ ' : '↗ '}${t.lastMessage.body}` : 'No messages yet'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* RIGHT — thread */}
      <section className="flex-1 flex flex-col min-w-0">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm">Select a client to start messaging</div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--kf-green)]/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-[var(--kf-green)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">{active.client.name}</div>
                <div className="text-xs text-zinc-400">{active.client.email ?? active.client.phone ?? ''}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-zinc-50">
              {messages.length === 0 && <p className="text-center text-sm text-zinc-400 mt-8">No messages yet.</p>}
              {messages.map((m) => {
                const inbound = m.direction === 'inbound'
                return (
                  <div key={m.id} className={cn('flex', inbound ? 'justify-start' : 'justify-end')}>
                    <div className={cn('max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm', inbound ? 'bg-white text-zinc-800' : 'bg-[var(--kf-green)] text-white')}>
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide opacity-70 mb-0.5">
                        {m.channel} {m.subject ? `· ${m.subject}` : ''}
                      </div>
                      <p className="whitespace-pre-wrap break-words">{m.body}</p>
                      <div className="text-[10px] opacity-60 mt-1 text-right">{formatDateTime(m.createdAt)}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Composer */}
            <div className="border-t border-zinc-200 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                {CHANNELS.map((c) => {
                  const Icon = c.icon
                  const enabled = c.value === 'email' ? !!active.client.email : c.value === 'whatsapp' ? !!(active.client.whatsappNumber || active.client.phone) : !!active.client.phone
                  return (
                    <button
                      key={c.value}
                      disabled={!enabled}
                      onClick={() => setChannel(c.value)}
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition disabled:opacity-30',
                        channel === c.value ? 'bg-[var(--kf-green)] text-white border-[var(--kf-green)]' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50',
                      )}
                    >
                      <Icon className="w-3 h-3" /> {c.label}
                    </button>
                  )
                })}
              </div>

              {channel === 'email' && (
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="kf-input w-full" />
              )}

              <div className="relative flex items-end gap-2">
                <div className="relative">
                  <button onClick={() => setEmojiOpen((o) => !o)} className="p-2 text-zinc-400 hover:text-zinc-700 transition" aria-label="Emoji">
                    <Smile className="w-5 h-5" />
                  </button>
                  {emojiOpen && (
                    <div className="absolute bottom-10 left-0 z-10 bg-white border border-zinc-200 rounded-xl shadow-lg p-2 grid grid-cols-8 gap-1 w-64">
                      {EMOJIS.map((e) => (
                        <button key={e} onClick={() => { setText((t) => t + e); setEmojiOpen(false) }} className="text-lg hover:bg-zinc-100 rounded">{e}</button>
                      ))}
                    </div>
                  )}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={1}
                  placeholder={`Message via ${channel}…`}
                  className="kf-input flex-1 resize-none max-h-32"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                />
                <button onClick={send} disabled={sending || !text.trim()} className="h-10 px-4 rounded-lg bg-[var(--kf-green)] text-white flex items-center gap-1.5 disabled:opacity-50">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
