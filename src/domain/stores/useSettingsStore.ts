import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  currentLevelIdx: number
  targetLevelIdx: number
  selectedTopics: string[]

  setCurrentLevelIdx: (idx: number) => void
  setTargetLevelIdx: (idx: number) => void
  toggleTopic: (topicLabel: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currentLevelIdx: 1,
      targetLevelIdx: 3,
      selectedTopics: ['Daily Life', 'Work', 'Health'],

      setCurrentLevelIdx: (idx) => set({ currentLevelIdx: idx }),
      setTargetLevelIdx: (idx) => set({ targetLevelIdx: idx }),
      toggleTopic: (topicLabel) =>
        set((state) => {
          const topics = new Set(state.selectedTopics)
          if (topics.has(topicLabel)) {
            topics.delete(topicLabel)
          } else {
            topics.add(topicLabel)
          }
          return { selectedTopics: Array.from(topics) }
        }),
    }),
    { name: 'opic-settings' },
  ),
)
