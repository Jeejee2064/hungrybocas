'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const COLORS = ['#fa5d66', '#1e1b4b', '#22C55E', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6']

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
    const dist = 90 + Math.random() * 200
    return {
      id: i,
      color: COLORS[i % COLORS.length],
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      rotation: Math.random() * 720 - 360,
      size: 5 + Math.random() * 9,
      isRect: i % 3 === 0,
      delay: Math.random() * 0.15,
    }
  })
}

const particles = generateParticles(36)

function Confetti() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1.2, 0.9], opacity: [1, 1, 0], rotate: p.rotation }}
          transition={{ duration: 0.9 + Math.random() * 0.4, delay: p.delay, ease: 'easeOut' }}
          style={{
            width: p.isRect ? p.size * 1.8 : p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isRect ? 2 : '50%',
          }}
        />
      ))}
    </div>
  )
}

function ScooterTrack() {
  return (
    <div className="absolute bottom-28 left-0 right-0 overflow-hidden h-14 pointer-events-none">
      <motion.div
        initial={{ x: '110vw' }}
        animate={{ x: '-200px' }}
        transition={{ duration: 2.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-1 text-4xl"
        style={{ willChange: 'transform' }}
      >
        <span>🛵</span>
        <motion.span
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 1.2 }}
          className="text-lg"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          ···
        </motion.span>
      </motion.div>
    </div>
  )
}

function PulseRings() {
  return (
    <>
      {[0, 0.4, 0.8].map((delay) => (
        <motion.div
          key={delay}
          className="absolute rounded-full"
          initial={{ scale: 0.7, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'easeOut' }}
          style={{ width: 80, height: 80, border: '2px solid #22C55E' }}
        />
      ))}
    </>
  )
}

async function scheduleOrderNotification(restaurantName) {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return

  let permission = Notification.permission
  if (permission === 'default') {
    permission = await Notification.requestPermission()
  }
  if (permission !== 'granted') return

  const reg = await navigator.serviceWorker.ready
  reg.active?.postMessage({
    type: 'SCHEDULE_ORDER_NOTIFICATION',
    delay: 60_000,
    restaurantName,
  })
}

export default function OrderConfirmation({ restaurantName, onDone }) {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(onDone, 5000)
    scheduleOrderNotification(restaurantName)
    return () => clearTimeout(timerRef.current)
  }, [onDone, restaurantName])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ backgroundColor: '#1e1b4b' }}
    >
      <Confetti />
      <ScooterTrack />

      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 }}
        className="relative flex items-center justify-center mb-6"
        style={{ width: 96, height: 96 }}
      >
        <PulseRings />
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#22C55E' }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </div>
      </motion.div>

      {/* ¡Listo! */}
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.35 }}
        className="text-5xl font-bold text-white mb-2"
        style={{ fontFamily: 'var(--font-playfair), serif' }}
      >
        ¡Listo!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        className="text-lg font-medium mb-1"
        style={{ color: 'rgba(255,255,255,0.85)' }}
      >
        Your order is on its way
      </motion.p>

      {restaurantName && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm mb-10"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          from {restaurantName}
        </motion.p>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDone}
        className="px-8 py-3.5 rounded-2xl text-sm font-semibold"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
      >
        Back to restaurants
      </motion.button>
    </motion.div>
  )
}
