import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSettingsStore } from '@/domain/stores/useSettingsStore'
import { TOPIC_ROWS } from '@/domain/constants'
import { LevelSlider } from '@/presentation/components/LevelSlider'
import { TopicCard } from '@/presentation/components/TopicCard'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function HomePage() {
  const currentLevelIdx = useSettingsStore((s) => s.currentLevelIdx)
  const targetLevelIdx = useSettingsStore((s) => s.targetLevelIdx)
  const selectedTopics = useSettingsStore((s) => s.selectedTopics)
  const setCurrentLevelIdx = useSettingsStore((s) => s.setCurrentLevelIdx)
  const setTargetLevelIdx = useSettingsStore((s) => s.setTargetLevelIdx)
  const toggleTopic = useSettingsStore((s) => s.toggleTopic)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.section
        className="mt-6 bg-[#fafafa] border border-[#e5e5e5] rounded-[8px] p-4 space-y-6"
        variants={sectionVariants}
      >
        <h2 className="text-[16px] font-normal tracking-[-0.5px] text-black">
          Current level &amp; Target level
        </h2>
        <LevelSlider label="Current level" value={currentLevelIdx} onChange={setCurrentLevelIdx} />
        <LevelSlider label="Target level" value={targetLevelIdx} onChange={setTargetLevelIdx} />
      </motion.section>

      <motion.section className="mt-6 space-y-4" variants={sectionVariants}>
        <div>
          <h2 className="text-[18px] font-normal tracking-[-0.5px] text-black">
            Select your topics
          </h2>
          <p className="text-[14px] text-[#525252] tracking-[-0.5px] mt-1">
            Choose at least 3 topics for your OPIc test.
          </p>
        </div>

        <div className="space-y-3">
          {TOPIC_ROWS.map((pair, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-2 gap-3">
              {pair.map((topic) => (
                <TopicCard
                  key={topic.id}
                  label={topic.label}
                  selected={selectedTopics.includes(topic.label)}
                  onToggle={() => toggleTopic(topic.label)}
                />
              ))}
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section className="mt-6 pb-6 space-y-3" variants={sectionVariants}>
        <p className="text-[12px] text-[#737373] tracking-[-0.5px] text-center">
          You can change your level and topics anytime in Settings.
        </p>
        <motion.button
          className="w-full h-[44px] bg-[#171717] rounded-[8px] text-white text-[14px] tracking-[-0.5px] font-normal"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.975 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          Start pattern learning
        </motion.button>
        <Link
          to="/notion-test"
          className="block text-center text-[12px] text-[#737373] underline"
        >
          Notion DB Test →
        </Link>
      </motion.section>
    </motion.div>
  )
}
