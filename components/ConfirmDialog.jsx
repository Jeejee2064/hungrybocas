'use client'
import { motion } from 'framer-motion'

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />
      {/* Dialog */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="relative bg-white rounded-2xl p-6 w-full max-w-sm"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
      >
        <div className="text-center mb-5">
          <div className="text-3xl mb-3">🛒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Start new order?</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100"
          >
            Keep cart
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#fa5d66' }}
          >
            Clear &amp; add
          </button>
        </div>
      </motion.div>
    </div>
  )
}
