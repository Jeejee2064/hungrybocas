'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrderStore, STATUS_STEPS, computeStatus } from '@/lib/order-store'

function ProgressBar({ placedAt }) {
  const totalMs = STATUS_STEPS.at(-1).minutes * 60_000
  const elapsed = Math.min(Date.now() - placedAt, totalMs)
  const pct = (elapsed / totalMs) * 100
  return (
    <div className="mt-3 rounded-full overflow-hidden" style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.15)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: '#22C55E' }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  )
}

function StepDots({ currentKey }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentKey)
  return (
    <div className="flex items-center gap-1 mt-2">
      {STATUS_STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1">
          <div
            className="rounded-full transition-all duration-500"
            style={{
              width: i <= currentIndex ? 8 : 5,
              height: i <= currentIndex ? 8 : 5,
              backgroundColor: i <= currentIndex ? '#22C55E' : 'rgba(255,255,255,0.25)',
            }}
          />
          {i < STATUS_STEPS.length - 1 && (
            <div
              className="rounded-full transition-all duration-500"
              style={{
                width: 16,
                height: 2,
                backgroundColor: i < currentIndex ? '#22C55E' : 'rgba(255,255,255,0.15)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function ActiveOrderCard() {
  const activeOrder = useOrderStore((s) => s.activeOrder)
  const clearOrder = useOrderStore((s) => s.clearOrder)
  const [status, setStatus] = useState(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!activeOrder) return

    const update = () => setStatus(computeStatus(activeOrder.placedAt))
    update()

    const interval = setInterval(update, 15_000)
    return () => clearInterval(interval)
  }, [activeOrder])

  // Auto-dismiss 30 s after delivery
  useEffect(() => {
    if (status?.key !== 'delivered') return
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(clearOrder, 400)
    }, 30_000)
    return () => clearTimeout(t)
  }, [status, clearOrder])

  if (!activeOrder || !status || !visible) return null

  const isDelivered = status.key === 'delivered'

  return (
    <AnimatePresence>
      <motion.div
        key="active-order"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="fixed bottom-24 left-4 right-4 z-40 md:left-auto md:right-6 md:bottom-8 md:w-80"
      >
        <div
          className="rounded-2xl px-4 py-3.5 text-white"
          style={{
            background: isDelivered
              ? 'linear-gradient(135deg, #065F46, #059669)'
              : 'linear-gradient(135deg, #1e1b4b, #2d2a6e)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
          }}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">{status.emoji}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Active order · {activeOrder.restaurantName}
                </p>
                <p className="text-sm font-bold mt-0.5 leading-snug">{status.label}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setVisible(false)
                if (isDelivered) setTimeout(clearOrder, 400)
              }}
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
              aria-label="Dismiss"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Items summary */}
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {activeOrder.items.map((i) => `${i.qty}× ${i.name}`).join(', ')} · ${activeOrder.total.toFixed(2)}
          </p>

          {/* Progress */}
          <StepDots currentKey={status.key} />
          <ProgressBar placedAt={activeOrder.placedAt} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
