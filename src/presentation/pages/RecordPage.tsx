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
      {/* Countdown / Recording state */}
      <AnimatePresence mode="wait">
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

        {state === 'recording' && (
          <motion.div
            key="recording"
            className="flex-1 flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Script follow-along */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 tracking-[-0.5px]">
                Follow along while you speak
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-2">
                {SCRIPT_SENTENCES.map((sentence, idx) => (
                  <motion.div
                    key={idx}
                    className="h-2 rounded-sm"
                    animate={{
                      backgroundColor:
                        idx < currentSentenceIdx
                          ? '#a3a3a3'
                          : idx === currentSentenceIdx
                            ? '#404040'
                            : '#e5e5e5',
                    }}
                    style={{ width: `${60 + (idx % 3) * 15}%` }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Voice level visualizer */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 tracking-[-0.5px]">Your voice level</p>
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <div className="flex items-end justify-center gap-[4px] h-[40px]">
                  {voiceLevels.map((level, idx) => (
                    <motion.div
                      key={idx}
                      className="w-1 rounded-full"
                      animate={{
                        height: `${level * 40}px`,
                        backgroundColor: level > 0.6 ? '#404040' : level > 0.3 ? '#737373' : '#a3a3a3',
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recording controls */}
            <div className="mt-auto flex flex-col items-center gap-3 pb-2">
              <div className="flex items-center gap-4">
                {/* Timer */}
                <span className="text-sm text-gray-600 tracking-[-0.5px] w-12 text-right">
                  {formatTime(elapsed)}
                </span>

                {/* Stop button */}
                <motion.button
                  className="w-[56px] h-[56px] rounded-full bg-black flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                  onClick={stopRecording}
                >
                  <div className="w-5 h-5 rounded-sm bg-white" />
                </motion.button>

                {/* Spacer for centering */}
                <span className="w-12" />
              </div>

              <p className="text-xs text-gray-500 tracking-[-0.5px]">Tap to stop</p>
            </div>
          </motion.div>
        )}

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
              <p className="text-sm text-gray-600 tracking-[-0.5px]">
                Record yourself reading the script aloud.
              </p>
            </div>

            {elapsed > 0 && (
              <div className="text-center space-y-1">
                <p className="text-sm text-gray-500 tracking-[-0.5px]">
                  Last recording: {formatTime(elapsed)}
                </p>
              </div>
            )}

            <motion.button
              className="w-full h-[44px] bg-black text-white rounded text-sm tracking-[-0.5px]"
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
                  className="flex-1 h-[40px] rounded-full bg-gray-100 border border-gray-200 text-sm text-black tracking-[-0.5px]"
                  whileTap={{ scale: 0.95 }}
                >
                  Play back
                </motion.button>
                <motion.button
                  className="flex-1 h-[40px] rounded-full bg-gray-100 border border-gray-200 text-sm text-black tracking-[-0.5px]"
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
