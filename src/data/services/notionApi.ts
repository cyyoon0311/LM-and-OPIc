import type { SentencesResponse } from '@/domain/types'

export async function fetchSentences(params?: {
  topic?: string
  level?: string
}): Promise<SentencesResponse> {
  const query = new URLSearchParams()
  if (params?.topic) query.set('topic', params.topic)
  if (params?.level) query.set('level', params.level)

  const url = `/api/sentences${query.toString() ? `?${query}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchDatabaseSchema(): Promise<unknown> {
  const res = await fetch('/api/raw-database')
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
