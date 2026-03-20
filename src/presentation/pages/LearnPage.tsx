import { useState, useCallback } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useSettingsStore } from '@/domain/stores/useSettingsStore'
import { LEVELS } from '@/domain/constants'

interface PatternCard {
  id: number
  category: string
  pattern: string
  meaning: string
}

const SAMPLE_PATTERNS: PatternCard[] = [
  {
    id: 1,
    category: 'Essential pattern',
    pattern: 'Well, to be honest, I usually …',
    meaning: '솔직히 말하면, 저는 보통 …',
  },
  {
    id: 2,
    category: 'Essential pattern',
    pattern: 'In my everyday life, I tend to …',
    meaning: '일상생활에서, 저는 보통 …하는 편이에요',
  },
  {
    id: 3,
    category: 'Essential pattern',
    pattern: 'I would say that …',
    meaning: '저는 …라고 말할 수 있어요',
  },
  {
    id: 4,
    category: 'Transition pattern',
    pattern: 'When it comes to …',
    meaning: '…에 관해서 말하자면',
  },
  {
    id: 5,
    category: 'Opinion pattern',
    pattern: 'Personally, I believe that …',
    meaning: '개인적으로, 저는 …라고 생각해요',
  },
]

export default function LearnPage() {
  const targetLevelIdx = useSettingsStore((s) => s.targetLevelIdx)
  const targetLevel = LEVELS[targetLevelIdx]

  const [currentIdx, setCurrentIdx] = useState(0)
  const [learnedCount, setLearnedCount] = useState(15)
  const [showMeaning, setShowMeaning] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const totalPatterns = 50
  const progressPercent = (learnedCount / totalPatterns) * 100
  const currentCard = SAMPLE_PATTERNS[currentIdx % SAMPLE_PATTERNS.length]

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      setSwipeDirection(direction)
      if (direction === 'right') {
        setLearnedCount((c) => Math.min(c + 1, totalPatterns))
      }
      setTimeout(() => {
        setCurrentIdx((i) => i + 1)
        setShowMeaning(false)
        setSwipeDirection(null)
      }, 300)
    },
    [],
  )

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x > 80) {
        handleSwipe('right')
      } else if (info.offset.x < -80) {
        handleSwipe('left')
      }
    },
    [handleSwipe],
  )

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1)
      setShowMeaning(false)
    }
  }

  const handleNext = () => {
    setCurrentIdx((i) => i + 1)
    setShowMeaning(false)
  }

  return (
    <motion.div
      className="flex flex-col h-full py-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress section */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600 tracking-[-0.5px]">
          Pattern Learning – Beginner to {targetLevel}
        </p>
        <p className="text-base font-normal text-black tracking-[-0.5px]">
          {learnedCount} / {totalPatterns} patterns learned
        </p>
        <div className="relative h-[5px] bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#3b82f6] rounded-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Swipe instructions */}
      <div className="flex justify-between mt-4 text-xs text-gray-500 tracking-[-0.5px]">
        <div className="flex items-center gap-1">
          <span>←</span>
          <span>Swipe left · Learn again</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Swipe right · Memorized</span>
          <span>→</span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center mt-2 mb-2 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            className="w-full bg-white border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: swipeDirection === 'left' ? 100 : swipeDirection === 'right' ? -100 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
            }}
            transition={{ duration: 0.25 }}
            onClick={() => setShowMeaning((v) => !v)}
          >
            {/* Category badge */}
            <div className="px-5 pt-5 pb-2">
              <span className="text-xs text-[#3b82f6] bg-blue-50 px-2 py-0.5 rounded-full tracking-[-0.5px]">
                {currentCard.category}
              </span>
            </div>

            {/* Pattern text */}
            <div className="px-5 py-5">
              <p className="text-xl font-normal text-black tracking-[-0.5px] leading-relaxed">
                {currentCard.pattern}
              </p>
            </div>

            {/* Korean meaning */}
            <div className="px-5 pb-5 min-h-[48px]">
              <AnimatePresence>
                {showMeaning ? (
                  <motion.p
                    className="text-sm text-gray-600 tracking-[-0.5px]"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentCard.meaning}
                  </motion.p>
                ) : (
                  <motion.p
                    className="text-xs text-gray-500 tracking-[-0.5px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Tap to see Korean meaning
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <motion.button
            className="flex-1 h-[40px] rounded-full bg-white border border-gray-200 text-sm text-gray-600 tracking-[-0.5px]"
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
          >
            Previous
          </motion.button>
          <motion.button
            className="flex-1 h-[40px] rounded-full bg-white border border-gray-200 text-sm text-gray-600 tracking-[-0.5px]"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMeaning(true)}
          >
            Show example
          </motion.button>
          <motion.button
            className="flex-1 h-[40px] rounded-full bg-white border border-gray-200 text-sm text-gray-600 tracking-[-0.5px]"
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
          >
            Next
          </motion.button>
        </div>
        <button className="w-full text-center text-sm text-gray-600 tracking-[-0.5px] py-1">
          Skip this topic
        </button>
      </div>
    </motion.div>
  )
}
