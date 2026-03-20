import { motion } from 'framer-motion'

interface TopicCardProps {
  label: string
  selected: boolean
  onToggle: () => void
}

export function TopicCard({ label, selected, onToggle }: TopicCardProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="w-full h-[54px] rounded-[8px] flex items-center border"
      animate={{
        backgroundColor: selected ? '#eff6ff' : '#ffffff',
        borderColor: selected ? '#3b82f6' : '#d4d4d4',
      }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Text area — fixed ratio */}
      <div className="flex-1 flex items-center justify-center min-w-0">
        <motion.span
          className="text-sm font-normal truncate"
          animate={{ color: selected ? '#1d4ed8' : '#404040' }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </div>

      {/* Check area — fixed width */}
      <div className="w-[40px] flex items-center justify-center flex-shrink-0">
        <motion.div
          className="w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center"
          animate={{
            backgroundColor: selected ? '#3b82f6' : '#ffffff',
            borderColor: selected ? '#3b82f6' : '#d4d4d4',
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.svg
            width="9"
            height="7"
            viewBox="0 0 10 8"
            fill="none"
            animate={{ opacity: selected ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </div>
    </motion.button>
  )
}
