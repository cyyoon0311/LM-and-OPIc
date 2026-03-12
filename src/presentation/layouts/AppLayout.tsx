import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="flex items-center justify-center p-6 min-h-screen">
      <div
        className="relative w-[375px] bg-white rounded-[8px] overflow-hidden border-2 border-[#ced4da] shadow-sm"
        style={{ height: '853px' }}
      >
        <motion.header
          className="absolute top-0 left-0 right-0 h-[89px] bg-white border-b border-gray-200 flex items-end justify-center pb-[13px]"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <h1 className="text-lg font-normal text-black">LM &amp; OPIc</h1>
        </motion.header>

        <main
          className="absolute left-0 right-0 overflow-y-auto px-4"
          style={{ top: '89px', bottom: '101px' }}
        >
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
