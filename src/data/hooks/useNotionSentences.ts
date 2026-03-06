import { useQuery } from '@tanstack/react-query'
import { fetchSentences } from '@/data/services/notionApi'
import type { SentencesResponse } from '@/domain/types'

interface UseNotionSentencesOptions {
  topic?: string
  level?: string
  enabled?: boolean
}

export function useNotionSentences(options?: UseNotionSentencesOptions) {
  const { topic, level, enabled = true } = options ?? {}

  const query = useQuery<SentencesResponse>({
    queryKey: ['sentences', { topic, level }],
    queryFn: () => fetchSentences({ topic, level }),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return {
    sentences: query.data?.data ?? [],
    rawSample: query.data?._raw_sample ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
  }
}
