import { motion } from 'framer-motion'
import { LEVELS } from '@/domain/constants'

interface LevelSliderProps {
  label: string
  value: number
  onChange: (val: number) => void
}

export function LevelSlider({ label, value, onChange }: LevelSliderProps) {
  const fillPercent = (value / (LEVELS.length - 1)) * 100
  const badgePrefix = label.split(' ')[0]

  return (
    <div className="space-y-2">
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

      <div className="relative h-[18px] flex items-center">
        <div className="absolute w-full h-2 bg-[#e5e5e5] rounded-full border-[0.5px] border-[#b7b5b5]" />
        <motion.div
          className="absolute h-2 bg-[#0075ff] rounded-full"
          animate={{ width: `${fillPercent}%` }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
        <motion.div
          className="absolute w-[18px] h-[18px] rounded-full bg-[#0075ff] border-2 border-white pointer-events-none z-10"
          style={{ boxShadow: '0 0 0 1.5px #0075ff' }}
          animate={{ left: `calc(${fillPercent}% - 9px)` }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
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
