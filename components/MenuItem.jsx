'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import ConfirmDialog from './ConfirmDialog'

export default function MenuItem({ item, restaurant, index }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const decrementItem = useCartStore((s) => s.decrementItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const setItemNote = useCartStore((s) => s.setItemNote)
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === item.id))

  const qtyInCart = cartItem?.qty ?? 0
  const noteInCart = cartItem?.notes ?? ''

  const doAdd = () => {
    addItem({
      item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      deliveryFee: restaurant.deliveryFee,
    })
  }

  const handleAdd = () => {
    const result = addItem({
      item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      deliveryFee: restaurant.deliveryFee,
    })
    if (result === false) {
      setShowConfirm(true)
    }
  }

  const handleConfirm = () => {
    clearCart()
    doAdd()
    setShowConfirm(false)
  }

  const bgColor = restaurant.headerColor + '18'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
        className="py-4"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.045)' }}
      >
        {/* Main row */}
        <div className="flex items-center gap-4">
          {/* Emoji tile */}
          <div
            className="w-[72px] h-[72px] rounded-2xl shrink-0 flex items-center justify-center text-3xl"
            style={{
              backgroundColor: bgColor,
              boxShadow: `0 2px 10px ${restaurant.headerColor}22`,
            }}
          >
            {restaurant.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-snug">{item.name}</p>
            {item.description && (
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
            )}
            <p className="text-sm font-bold mt-1" style={{ color: '#fa5d66' }}>
              ${item.price.toFixed(2)}
            </p>
          </div>

          {/* Quantity controls */}
          <AnimatePresence mode="wait" initial={false}>
            {qtyInCart === 0 ? (
              <motion.button
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.88 }}
                onClick={handleAdd}
                className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-xl"
                style={{ backgroundColor: '#F3F4F6', color: '#374151' }}
                aria-label={`Add ${item.name}`}
              >
                +
              </motion.button>
            ) : (
              <motion.div
                key="controls"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 shrink-0"
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => decrementItem(item.id)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: '#fde8e9', color: '#fa5d66' }}
                  aria-label="Remove one"
                >
                  −
                </motion.button>

                <motion.span
                  key={qtyInCart}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="w-6 text-center font-bold text-gray-900 text-sm"
                >
                  {qtyInCart}
                </motion.span>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleAdd}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg text-white"
                  style={{ backgroundColor: '#fa5d66' }}
                  aria-label="Add one more"
                >
                  +
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notes input — appears when item is in cart */}
        <AnimatePresence initial={false}>
          {qtyInCart > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ overflow: 'hidden', paddingLeft: 88 }}
            >
              <input
                type="text"
                value={noteInCart}
                onChange={(e) => setItemNote(item.id, e.target.value)}
                placeholder="Special requests, e.g. no onions…"
                className="w-full mt-2 text-xs py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  color: '#374151',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#fa5d66' }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showConfirm && (
        <ConfirmDialog
          message="Your cart has items from another restaurant. Clear it to add this item?"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}
