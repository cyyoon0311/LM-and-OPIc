import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '@/domain/stores/useSettingsStore'
import { LEVELS } from '@/domain/constants'

const FILLER_LABELS = ['Low', 'Medium', 'High'] as const
const FILLER_DESCRIPTIONS = [
  'More concise, fewer filler words.',
  'Balanced natural speech.',
  'Very conversational, frequent fillers.',
]

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

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-xs text-black bg-gray-100 border border-gray-200 rounded-sm tracking-[-0.5px]">
            Target: {targetLevel}
          </span>
          <span className="px-2 py-1 text-xs text-black bg-gray-100 border border-gray-200 rounded-sm tracking-[-0.5px]">
            Topics: {selectedTopics.slice(0, 3).join(', ')}
          </span>
          <span className="px-2 py-1 text-xs text-black bg-gray-100 border border-gray-200 rounded-sm tracking-[-0.5px]">
            Length: 120–150 words
          </span>
        </div>

        <p className="text-sm text-gray-600 tracking-[-0.5px]">
          We will combine your learned patterns and advanced vocabulary into one script.
        </p>
      </motion.section>

      {/* Filler usage section */}
      <motion.section className="space-y-3" variants={sectionVariants}>
        <h3 className="text-base font-normal text-black tracking-[-0.5px]">
          Filler usage
        </h3>

        <div className="space-y-3">
          {/* Custom step selector */}
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((step) => (
              <button
                key={step}
                className="flex-1 flex flex-col items-center"
                onClick={() => setFillerLevel(step)}
              >
                <div className="relative w-full flex justify-center">
                  <motion.div
                    className="w-3 h-3 rounded-full border"
                    animate={{
                      backgroundColor: step === fillerLevel ? '#171717' : step < fillerLevel ? '#171717' : '#e5e5e5',
                      borderColor: step === fillerLevel ? '#d4d4d4' : 'transparent',
                      scale: step === fillerLevel ? 1.3 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Track line */}
          <div className="relative h-[2px] -mt-5 mx-auto" style={{ width: '66%' }}>
            <div className="absolute inset-0 bg-gray-200 rounded-full" />
            <motion.div
              className="absolute inset-y-0 left-0 bg-black rounded-full"
              animate={{ width: `${fillerLevel * 50}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between">
            {FILLER_LABELS.map((label, idx) => (
              <div
                key={label}
                className="flex-1 text-center"
              >
                <p className="text-xs text-black tracking-[-0.5px]">{label}</p>
              </div>
            ))}
          </div>

          {/* Descriptions */}
          <div className="flex justify-between">
            {FILLER_DESCRIPTIONS.map((desc, idx) => (
              <div key={idx} className="flex-1 text-center px-1">
                <p className="text-xs text-gray-600 tracking-[-0.5px] leading-tight">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Script preview section */}
      <motion.section variants={sectionVariants}>
        <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-black tracking-[-0.5px]">
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
                <span className="text-xs text-gray-600 tracking-[-0.5px]">Generating</span>
              </div>
            )}
          </div>

          {/* Script content */}
          <div className="space-y-1 text-sm leading-relaxed tracking-[-0.5px]">
            {SAMPLE_SCRIPT.map((paragraph, pIdx) => (
              <p key={pIdx} className="text-gray-700">
                {paragraph.map((segment, sIdx) =>
                  segment.highlighted ? (
                    <span
                      key={sIdx}
                      className="bg-black text-white rounded-sm px-1 py-[1px] text-sm"
                    >
                      {segment.text}
                    </span>
                  ) : (
                    <span key={sIdx}>{segment.text}</span>
                  ),
                )}
              </p>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Actions section */}
      <motion.section className="space-y-3" variants={sectionVariants}>
        {/* More options toggle */}
        <button
          className="flex items-center gap-1.5 text-sm text-gray-700 tracking-[-0.5px]"
          onClick={() => setShowMoreOptions((v) => !v)}
        >
          <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center">
            <div
              className="w-2 h-[1.5px] border-b border-gray-500"
              style={{ transform: showMoreOptions ? 'rotate(0)' : 'none' }}
            />
          </div>
          <span>More options</span>
        </button>

        {/* Regenerate button */}
        <motion.button
          className="w-full h-[44px] bg-black text-white rounded text-sm tracking-[-0.5px]"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.975 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={handleRegenerate}
        >
          Regenerate script
        </motion.button>

        {/* Save button */}
        <button className="w-full text-center text-sm text-gray-700 tracking-[-0.5px] py-1">
          Save script to My Library
        </button>
      </motion.section>
    </motion.div>
  )
}
