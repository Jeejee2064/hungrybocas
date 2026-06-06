'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrderStore, STATUS_STEPS, computeStatus } from '@/lib/order-store'
import OrderDetailSheet from './OrderDetailSheet'

function ProgressBar({ placedAt }) {
  const totalMs = STATUS_STEPS.at(-1).minutes * 60_000
  const pct = Math.min(100, ((Date.now() - placedAt) / totalMs) * 100)
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
                width: 16, height: 2,
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
  const [expanded, setExpanded] = useState(true)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    if (!activeOrder) return
    const update = () => setStatus(computeStatus(activeOrder.placedAt))
    update()
    const interval = setInterval(update, 15_000)
    return () => clearInterval(interval)
  }, [activeOrder])

  useEffect(() => {
    if (status) setExpanded(true)
  }, [status?.key])

  useEffect(() => {
    if (status?.key !== 'delivered') return
    const t = setTimeout(clearOrder, 30_000)
    return () => clearTimeout(t)
  }, [status, clearOrder])

  if (!activeOrder || !status) return null

  const isDelivered = status.key === 'delivered'
  const bg = isDelivered
    ? 'linear-gradient(135deg, #065F46, #059669)'
    : 'linear-gradient(135deg, #1e1b4b, #2d2a6e)'

  return (
    <>
      <AnimatePresence mode="wait">
        {expanded ? (
          /* ── Full card ── */
          <motion.div
            key="card"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 left-4 right-4 z-40 md:left-auto md:right-6 md:bottom-8 md:w-80"
          >
            {/* Tappable body */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDetail(true)}
              className="w-full rounded-2xl px-4 py-3.5 text-white text-left"
              style={{ background: bg, boxShadow: '0 8px 32px rgba(0,0,0,0.22)' }}
            >
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

                {/* Action buttons — stop propagation so they don't open detail */}
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  {/* Details hint */}
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>details</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>

                  <button
                    onClick={(e) => { e.stopPropagation(); isDelivered ? clearOrder() : setExpanded(false) }}
                    className="w-6 h-6 rounded-full flex items-center justify-center ml-1"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
                    aria-label={isDelivered ? 'Dismiss' : 'Minimize'}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {activeOrder.items.map((i) => `${i.qty}× ${i.name}`).join(', ')} · ${activeOrder.total.toFixed(2)}
              </p>

              <StepDots currentKey={status.key} />
              <ProgressBar placedAt={activeOrder.placedAt} />
            </motion.button>
          </motion.div>
        ) : (
          /* ── Minimised pill ── */
          <motion.button
            key="pill"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={() => setShowDetail(true)}
            className="fixed bottom-24 right-4 z-40 md:right-6 md:bottom-8 flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold"
            style={{ background: bg, boxShadow: '0 4px 20px rgba(0,0,0,0.22)' }}
          >
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              {status.emoji}
            </motion.span>
            {status.label}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Detail sheet */}
      <AnimatePresence>
        {showDetail && (
          <OrderDetailSheet
            order={activeOrder}
            onClose={() => setShowDetail(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
