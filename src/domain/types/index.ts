export interface OPIcSentence {
  id: string
  sentence: string
  topic: string
  level: string
  category: string
}

export type OPIcLevel = 'IM1' | 'IM2' | 'IM3' | 'IH' | 'IL' | 'AM' | 'AL'

export interface Topic {
  id: string
  label: string
}

export interface SentencesResponse {
  success: boolean
  count: number
  data: OPIcSentence[]
  _raw_sample: unknown
}
