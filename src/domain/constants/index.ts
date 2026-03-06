import type { OPIcLevel, Topic } from '@/domain/types'

export const LEVELS: readonly OPIcLevel[] = [
  'IM1',
  'IM2',
  'IM3',
  'IH',
  'IL',
  'AM',
  'AL',
] as const

export const TOPICS: Topic[] = [
  { id: 'daily-life', label: 'Daily Life' },
  { id: 'travel', label: 'Travel' },
  { id: 'work', label: 'Work' },
  { id: 'movies', label: 'Movies' },
  { id: 'health', label: 'Health' },
  { id: 'technology', label: 'Technology' },
]

export const TOPIC_ROWS: Topic[][] = [
  [TOPICS[0], TOPICS[1]],
  [TOPICS[2], TOPICS[3]],
  [TOPICS[4], TOPICS[5]],
]
