'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/cart-store'

export default function FloatingCartButton() {
  const count = useCartStore((s) => s.getCount())
  const total = useCartStore((s) => s.getTotal())
  const setIsOpen = useCartStore((s) => s.setIsOpen)

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="fixed left-4 right-4 z-30 bottom-6 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-sm"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-between py-4 px-5 rounded-2xl text-white font-semibold"
            style={{
              backgroundColor: '#fa5d66',
              boxShadow: '0 8px 32px rgba(250, 93, 102, 0.4)',
            }}
          >
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">
                {count}
              </span>
              View cart
            </span>
            <span>${total.toFixed(2)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
