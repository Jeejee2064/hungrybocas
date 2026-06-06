'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrderNotificationToast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let timer
    const handler = (e) => {
      setToast(e.detail)
      clearTimeout(timer)
      timer = setTimeout(() => setToast(null), 6000)
    }
    window.addEventListener('bocas-order-notification', handler)
    return () => {
      window.removeEventListener('bocas-order-notification', handler)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="fixed top-20 left-4 right-4 z-[100] md:left-auto md:right-6 md:max-w-xs cursor-pointer"
          onClick={() => setToast(null)}
        >
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b, #2d2a6e)',
              boxShadow: '0 8px 32px rgba(30,27,75,0.35)',
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              🛵
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">Your order is on its way!</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {toast.restaurantName} is preparing your order
              </p>
            </div>
            {/* Progress bar draining down */}
            <motion.div
              className="absolute bottom-0 left-0 rounded-b-2xl"
              style={{ height: 3, backgroundColor: '#fa5d66' }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
