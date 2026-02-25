import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVELS = ['IM1', 'IM2', 'IM3', 'IH', 'IL', 'AM', 'AL'] as const

const TOPICS = [
  { id: 'daily-life', label: 'Daily Life' },
  { id: 'travel', label: 'Travel' },
  { id: 'work', label: 'Work' },
  { id: 'movies', label: 'Movies' },
  { id: 'health', label: 'Health' },
  { id: 'technology', label: 'Technology' },
]

const TOPIC_ROWS = [
  [TOPICS[0], TOPICS[1]],
  [TOPICS[2], TOPICS[3]],
  [TOPICS[4], TOPICS[5]],
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? '#171717' : '#a3a3a3'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
        fill={color}
      />
    </svg>
  )
}

function LearnIcon({ active }: { active: boolean }) {
  const color = active ? '#171717' : '#a3a3a3'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="11" height="17" rx="2" fill={color} opacity="0.4" />
      <rect x="8" y="2" width="11" height="17" rx="2" fill={color} />
      <rect x="11" y="7" width="5" height="1.5" rx="0.75" fill="white" />
      <rect x="11" y="11" width="5" height="1.5" rx="0.75" fill="white" />
    </svg>
  )
}

function ScriptIcon({ active }: { active: boolean }) {
  const color = active ? '#171717' : '#a3a3a3'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" fill={color} />
      <rect x="7" y="7" width="10" height="1.5" rx="0.75" fill="white" />
      <rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="white" />
      <rect x="7" y="15" width="6" height="1.5" rx="0.75" fill="white" />
    </svg>
  )
}

function RecordIcon({ active }: { active: boolean }) {
  const color = active ? '#171717' : '#a3a3a3'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
      <path
        d="M5 11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="22" x2="14" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── LevelSlider ──────────────────────────────────────────────────────────────

interface LevelSliderProps {
  label: string
  value: number
  onChange: (val: number) => void
}

function LevelSlider({ label, value, onChange }: LevelSliderProps) {
  const fillPercent = (value / (LEVELS.length - 1)) * 100
  const badgePrefix = label.split(' ')[0] // "Current" | "Target"

  return (
    <div className="space-y-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#404040] tracking-[-0.5px]">{label}</span>
        <motion.div
          className="bg-[#262626] text-white text-[12px] rounded-full px-3 py-[3px] tracking-[-0.5px] whitespace-nowrap"
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        >
          {badgePrefix}: {LEVELS[value]}
        </motion.div>
      </div>

      {/* Track + thumb + invisible input */}
      <div className="relative h-[18px] flex items-center">
        {/* Gray track */}
        <div className="absolute w-full h-2 bg-[#e5e5e5] rounded-full border-[0.5px] border-[#b7b5b5]" />

        {/* Animated blue fill */}
        <motion.div
          className="absolute h-2 bg-[#0075ff] rounded-full"
          animate={{ width: `${fillPercent}%` }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />

        {/* Animated thumb circle */}
        <motion.div
          className="absolute w-[18px] h-[18px] rounded-full bg-[#0075ff] border-2 border-white pointer-events-none z-10"
          style={{ boxShadow: '0 0 0 1.5px #0075ff' }}
          animate={{ left: `calc(${fillPercent}% - 9px)` }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />

        {/* Invisible native range — handles all interaction */}
        <input
          type="range"
          min={0}
          max={LEVELS.length - 1}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </div>

      {/* Level labels */}
      <div className="relative h-4">
        {LEVELS.map((level, idx) => {
          const pct = (idx / (LEVELS.length - 1)) * 100
          return (
            <span
              key={level}
              className="absolute text-[12px] text-[#737373] tracking-[-0.5px] -translate-x-1/2 select-none"
              style={{ left: `${pct}%` }}
            >
              {level}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ─── TopicCard ────────────────────────────────────────────────────────────────

interface TopicCardProps {
  label: string
  selected: boolean
  onToggle: () => void
}

function TopicCard({ label, selected, onToggle }: TopicCardProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative w-full h-[54px] rounded-[8px] flex items-center px-4 text-left overflow-hidden border"
      animate={{
        backgroundColor: selected ? '#262626' : 'rgba(0,0,0,0)',
        borderColor: selected ? '#262626' : '#d4d4d4',
      }}
      transition={{ duration: 0.15 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        className="text-[14px] tracking-[-0.5px] font-normal"
        animate={{ color: selected ? '#ffffff' : '#404040' }}
        transition={{ duration: 0.15 }}
      >
        {label}
      </motion.span>

      {/* Check badge (top-right) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-2 right-2 w-4 h-4 bg-white rounded-[2px] flex items-center justify-center"
          >
            {/* Minus bar — matches Figma's "deselect" indicator */}
            <div className="w-2 h-[4px] bg-[#262626] rounded-[1px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps {
  label: string
  active: boolean
  icon: React.ReactNode
  onClick: () => void
}

function NavItem({ label, active, icon, onClick }: NavItemProps) {
  return (
    <motion.button
      className="flex flex-col items-center gap-[2px] flex-1 pt-2"
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {icon}
      <span
        className="text-[12px] tracking-[-0.5px]"
        style={{ color: active ? '#171717' : '#737373' }}
      >
        {label}
      </span>
    </motion.button>
  )
}

// ─── Animation variants ───────────────────────────────────────────────────────

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

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(1) // IM2
  const [targetLevelIdx, setTargetLevelIdx] = useState(3)   // IH
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(
    new Set(['Daily Life', 'Work', 'Health']),
  )
  const [activeNav, setActiveNav] = useState('home')

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) next.delete(topic)
      else next.add(topic)
      return next
    })
  }

  return (
    <div
      className="relative w-[375px] bg-white rounded-[8px] overflow-hidden border-2 border-[#ced4da] shadow-sm"
      style={{ height: '853px' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.header
        className="absolute top-0 left-0 right-0 h-[89px] bg-white border-b border-[#e5e5e5] flex items-end justify-center pb-[13px]"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <h1 className="text-[18px] font-normal tracking-[-0.5px] text-black">
          LM &amp; OPIc
        </h1>
      </motion.header>

      {/* ── Scrollable main ────────────────────────────────────────────── */}
      <motion.main
        className="absolute left-0 right-0 overflow-y-auto px-4"
        style={{ top: '89px', bottom: '101px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Level section */}
        <motion.section
          className="mt-6 bg-[#fafafa] border border-[#e5e5e5] rounded-[8px] p-4 space-y-6"
          variants={sectionVariants}
        >
          <h2 className="text-[16px] font-normal tracking-[-0.5px] text-black">
            Current level &amp; Target level
          </h2>
          <LevelSlider
            label="Current level"
            value={currentLevelIdx}
            onChange={setCurrentLevelIdx}
          />
          <LevelSlider
            label="Target level"
            value={targetLevelIdx}
            onChange={setTargetLevelIdx}
          />
        </motion.section>

        {/* Topics section */}
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
                    selected={selectedTopics.has(topic.label)}
                    onToggle={() => toggleTopic(topic.label)}
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA section */}
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
        </motion.section>
      </motion.main>

      {/* ── Bottom nav ─────────────────────────────────────────────────── */}
      <motion.nav
        className="absolute bottom-0 left-0 right-0 h-[101px] bg-white border-t border-[#e5e5e5] flex items-start"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
      >
        {[
          { id: 'home',   label: 'Home',   Icon: HomeIcon },
          { id: 'learn',  label: 'Learn',  Icon: LearnIcon },
          { id: 'script', label: 'Script', Icon: ScriptIcon },
          { id: 'record', label: 'Record', Icon: RecordIcon },
        ].map(({ id, label, Icon }) => (
          <NavItem
            key={id}
            label={label}
            active={activeNav === id}
            icon={<Icon active={activeNav === id} />}
            onClick={() => setActiveNav(id)}
          />
        ))}
      </motion.nav>
    </div>
  )
}
