import { motion, AnimatePresence } from 'framer-motion'

interface TopicCardProps {
  label: string
  selected: boolean
  onToggle: () => void
}

export function TopicCard({ label, selected, onToggle }: TopicCardProps) {
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

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-2 right-2 w-4 h-4 bg-white rounded-[2px] flex items-center justify-center"
          >
            <div className="w-2 h-[4px] bg-[#262626] rounded-[1px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
