import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '@/domain/stores/useSettingsStore'
import { LEVELS } from '@/domain/constants'

const FILLER_OPTIONS = [
  { label: 'Low', desc: 'More concise, fewer filler words.' },
  { label: 'Medium', desc: 'Balanced natural speech.' },
  { label: 'High', desc: 'Very conversational, frequent fillers.' },
] as const

interface ScriptSegment {
  text: string
  highlighted: boolean
}

const SAMPLE_SCRIPT: ScriptSegment[][] = [
  [
    { text: 'To be honest,', highlighted: true },
    { text: ' traveling has always been one of my favorite hobbies. I really enjoy exploring new places and experiencing different cultures.', highlighted: false },
  ],
  [
    { text: 'In my everyday life,', highlighted: true },
    { text: ' I try to watch movies whenever I have free time. It helps me relax and unwind after a long day at work.', highlighted: false },
  ],
  [
    { text: 'When it comes to daily routines, ', highlighted: false },
    { text: 'I would say that', highlighted: true },
    { text: ' maintaining a healthy balance between work and leisure is quite important to me. I believe that taking breaks and enjoying hobbies like traveling and watching movies helps me stay productive and motivated in my professional life.', highlighted: false },
  ],
]

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function ScriptPage() {
  const targetLevelIdx = useSettingsStore((s) => s.targetLevelIdx)
  const selectedTopics = useSettingsStore((s) => s.selectedTopics)
  const targetLevel = LEVELS[targetLevelIdx]

  const [fillerLevel, setFillerLevel] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)

  const handleRegenerate = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 2000)
  }

  return (
    <motion.div
      className="py-3 space-y-5"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* Header section */}
      <motion.section className="space-y-3" variants={sectionVariants}>
        <h2 className="text-2xl font-normal text-black tracking-[-0.5px]">
          Generate OPIc script
        </h2>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-sm tracking-[-0.5px]">
            Target: {targetLevel}
          </span>
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-sm tracking-[-0.5px]">
            Topics: {selectedTopics.slice(0, 3).join(', ')}
          </span>
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-sm tracking-[-0.5px]">
            Length: 120–150 words
          </span>
        </div>

        <p className="text-sm text-gray-600 tracking-[-0.5px]">
          We will combine your learned patterns and advanced vocabulary into one script.
        </p>
      </motion.section>

      {/* Filler usage — Segmented Control */}
      <motion.section className="space-y-3" variants={sectionVariants}>
        <h3 className="text-base font-normal text-black tracking-[-0.5px]">
          Filler usage
        </h3>

        {/* Segmented control */}
        <div className="relative flex bg-gray-100 rounded-lg p-[3px]">
          {/* Sliding indicator */}
          <motion.div
            className="absolute top-[3px] bottom-[3px] bg-white rounded-[6px]"
            style={{ width: `calc(${100 / 3}% - 2px)` }}
            animate={{ left: `calc(${fillerLevel * (100 / 3)}% + 3px)` }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
          {FILLER_OPTIONS.map((opt, idx) => (
            <button
              key={opt.label}
              className="relative z-10 flex-1 py-2 text-center"
              onClick={() => setFillerLevel(idx)}
            >
              <motion.span
                className="text-xs font-medium tracking-[-0.5px]"
                animate={{ color: idx === fillerLevel ? '#171717' : '#737373' }}
                transition={{ duration: 0.2 }}
              >
                {opt.label}
              </motion.span>
            </button>
          ))}
        </div>

        {/* Description for selected level */}
        <AnimatePresence mode="wait">
          <motion.p
            key={fillerLevel}
            className="text-xs text-gray-500 tracking-[-0.5px] text-center"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {FILLER_OPTIONS[fillerLevel].desc}
          </motion.p>
        </AnimatePresence>
      </motion.section>

      {/* Script preview */}
      <motion.section variants={sectionVariants}>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 tracking-[-0.5px]">
              Your script (auto-highlighted patterns)
            </span>
            {isGenerating && (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 tracking-[-0.5px]">Generating</span>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm leading-relaxed tracking-[-0.5px]">
            {SAMPLE_SCRIPT.map((paragraph, pIdx) => (
              <p key={pIdx} className="text-gray-700">
                {paragraph.map((segment, sIdx) =>
                  segment.highlighted ? (
                    <mark
                      key={sIdx}
                      className="bg-amber-100 text-gray-800 rounded px-0.5 py-[1px]"
                    >
                      {segment.text}
                    </mark>
                  ) : (
                    <span key={sIdx}>{segment.text}</span>
                  ),
                )}
              </p>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Actions */}
      <motion.section className="space-y-3 pb-2" variants={sectionVariants}>
        {/* More options — chevron accordion */}
        <button
          className="flex items-center gap-1.5 text-sm text-gray-500 tracking-[-0.5px]"
          onClick={() => setShowMoreOptions((v) => !v)}
        >
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            animate={{ rotate: showMoreOptions ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#737373"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          <span>More options</span>
        </button>

        <AnimatePresence>
          {showMoreOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pb-2 text-xs text-gray-500 tracking-[-0.5px]">
                Additional script options will appear here.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary CTA */}
        <motion.button
          className="w-full h-[44px] bg-black text-white rounded-lg text-sm tracking-[-0.5px]"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.975 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={handleRegenerate}
        >
          Regenerate script
        </motion.button>

        {/* Ghost text link */}
        <button className="w-full text-center text-sm text-gray-500 tracking-[-0.5px] py-1">
          Save script to My Library
        </button>
      </motion.section>
    </motion.div>
  )
}
