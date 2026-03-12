import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NavItem } from '@/presentation/components/NavItem'
import { HomeIcon, LearnIcon, ScriptIcon, RecordIcon } from '@/presentation/components/icons'

const NAV_ITEMS = [
  { path: '/', label: 'Home', Icon: HomeIcon },
  { path: '/learn', label: 'Learn', Icon: LearnIcon },
  { path: '/script', label: 'Script', Icon: ScriptIcon },
  { path: '/record', label: 'Record', Icon: RecordIcon },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.nav
      className="absolute bottom-0 left-0 right-0 h-[101px] bg-white border-t border-gray-200 flex items-start"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
    >
      {NAV_ITEMS.map(({ path, label, Icon }) => (
        <NavItem
          key={path}
          label={label}
          active={location.pathname === path}
          icon={<Icon active={location.pathname === path} />}
          onClick={() => navigate(path)}
        />
      ))}
    </motion.nav>
  )
}
