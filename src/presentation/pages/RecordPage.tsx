import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type RecordState = 'countdown' | 'recording' | 'idle'

const SCRIPT_SENTENCES = [
  'To be honest, traveling has always been one of my favorite hobbies.',
  'I really enjoy exploring new places and experiencing different cultures.',
  'In my everyday life, I try to watch movies whenever I have free time.',
  'It helps me relax and unwind after a long day at work.',
  'I would say that maintaining a healthy balance between work and leisure is quite important to me.',
]

export default function RecordPage() {
  const [state, setState] = useState<RecordState>('idle')
  const [countdown, setCountdown] = useState(5)
  const [elapsed, setElapsed] = useState(0)
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0)
  const [voiceLevels, setVoiceLevels] = useState<number[]>(
    () => Array.from({ length: 12 }, () => 0.2),
  )
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const voiceRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeRef = useRef<HTMLParagraphElement | null>(null)

  const startCountdown = () => {
    setState('countdown')
    setCountdown(5)
    setElapsed(0)
    setCurrentSentenceIdx(0)
  }

  useEffect(() => {
    if (state !== 'countdown') return
    if (countdown <= 0) {
      setState('recording')
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [state, countdown])

  useEffect(() => {
    if (state !== 'recording') return

    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1)
    }, 1000)

    voiceRef.current = setInterval(() => {
      setVoiceLevels(
        Array.from({ length: 12 }, () => 0.15 + Math.random() * 0.85),
      )
    }, 150)

    const sentenceTimer = setInterval(() => {
      setCurrentSentenceIdx((i) => Math.min(i + 1, SCRIPT_SENTENCES.length - 1))
    }, 4000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (voiceRef.current) clearInterval(voiceRef.current)
      clearInterval(sentenceTimer)
    }
  }, [state])

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentSentenceIdx])

  const stopRecording = () => {
    setState('idle')
    setVoiceLevels(Array.from({ length: 12 }, () => 0.2))
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <motion.div
      className="flex flex-col h-full py-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {/* ── Countdown ── */}
        {state === 'countdown' && (
          <motion.div
            key="countdown"
            className="flex-1 flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              className="w-[80px] h-[80px] rounded-full border-2 border-gray-300 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <motion.span
                key={countdown}
                className="text-[32px] font-normal text-black"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {countdown}
              </motion.span>
            </motion.div>
            <p className="text-base text-gray-600 tracking-[-0.5px]">Get ready to speak</p>
          </motion.div>
        )}

        {/* ── Recording ── */}
        {state === 'recording' && (
          <motion.div
            key="recording"
            className="flex-1 flex flex-col gap-3 min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Script follow-along — real text */}
            <div className="flex-1 min-h-0 flex flex-col">
              <p className="text-sm text-gray-500 tracking-[-0.5px] mb-2">
                Follow along while you speak
              </p>
              <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg py-6 px-5 space-y-4">
                {SCRIPT_SENTENCES.map((sentence, idx) => (
                  <motion.p
                    key={idx}
                    ref={idx === currentSentenceIdx ? activeRef : undefined}
                    className="text-sm leading-relaxed tracking-[-0.5px] transition-colors duration-300"
                    animate={{
                      color:
                        idx < currentSentenceIdx
                          ? '#a3a3a3'
                          : idx === currentSentenceIdx
                            ? '#171717'
                            : '#d4d4d4',
                    }}
                    style={{
                      fontWeight: idx === currentSentenceIdx ? 500 : 400,
                    }}
                  >
                    {sentence}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Voice level visualizer */}
            <div>
              <p className="text-sm text-gray-500 tracking-[-0.5px] mb-2">Your voice level</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-3">
                <div className="flex items-end justify-center gap-[5px] h-[36px]">
                  {voiceLevels.map((level, idx) => (
                    <motion.div
                      key={idx}
                      className="w-[3px] rounded-full"
                      animate={{
                        height: `${level * 36}px`,
                        backgroundColor: level > 0.6 ? '#3b82f6' : level > 0.3 ? '#93c5fd' : '#d4d4d4',
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recording controls */}
            <div className="flex flex-col items-center gap-2 pt-1 pb-1">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 tracking-[-0.5px] w-12 text-right tabular-nums">
                  {formatTime(elapsed)}
                </span>

                <motion.button
                  className="w-[52px] h-[52px] rounded-full bg-[#ef4444] flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                  onClick={stopRecording}
                >
                  <div className="w-[18px] h-[18px] rounded-[3px] bg-white" />
                </motion.button>

                <span className="w-12" />
              </div>
              <p className="text-xs text-gray-400 tracking-[-0.5px]">Tap to stop</p>
            </div>
          </motion.div>
        )}

        {/* ── Idle ── */}
        {state === 'idle' && (
          <motion.div
            key="idle"
            className="flex-1 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center space-y-2">
              <h2 className="text-lg font-normal text-black tracking-[-0.5px]">
                Practice speaking
              </h2>
              <p className="text-sm text-gray-500 tracking-[-0.5px]">
                Record yourself reading the script aloud.
              </p>
            </div>

            {elapsed > 0 && (
              <p className="text-sm text-gray-400 tracking-[-0.5px]">
                Last recording: {formatTime(elapsed)}
              </p>
            )}

            <motion.button
              className="w-full h-[44px] bg-black text-white rounded-lg text-sm tracking-[-0.5px]"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={startCountdown}
            >
              Start recording
            </motion.button>

            {elapsed > 0 && (
              <div className="flex gap-3 w-full">
                <motion.button
                  className="flex-1 h-[40px] rounded-full bg-white border border-gray-200 text-sm text-gray-600 tracking-[-0.5px]"
                  whileTap={{ scale: 0.95 }}
                >
                  Play back
                </motion.button>
                <motion.button
                  className="flex-1 h-[40px] rounded-full bg-white border border-gray-200 text-sm text-gray-600 tracking-[-0.5px]"
                  whileTap={{ scale: 0.95 }}
                >
                  Save
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
