import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  const base = 'w-full h-[44px] rounded text-sm font-normal'
  const variants = {
    primary: 'bg-black text-white',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-200',
  }

  return (
    <motion.button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      {children}
    </motion.button>
  )
}
