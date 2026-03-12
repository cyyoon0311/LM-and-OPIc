import { motion } from 'framer-motion'

interface NavItemProps {
  label: string
  active: boolean
  icon: React.ReactNode
  onClick: () => void
}

export function NavItem({ label, active, icon, onClick }: NavItemProps) {
  return (
    <motion.button
      className="flex flex-col items-center gap-[2px] flex-1 pt-2"
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {icon}
      <span className={`text-xs ${active ? 'text-black' : 'text-gray-500'}`}>
        {label}
      </span>
    </motion.button>
  )
}
