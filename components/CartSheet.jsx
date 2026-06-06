'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { useOrderStore } from '@/lib/order-store'
import OrderModal from './OrderModal'
import OrderConfirmation from './OrderConfirmation'

export default function CartSheet() {
  const isOpen = useCartStore((s) => s.isOpen)
  const setIsOpen = useCartStore((s) => s.setIsOpen)
  const items = useCartStore((s) => s.items)
  const restaurantName = useCartStore((s) => s.restaurantName)
  const restaurantId = useCartStore((s) => s.restaurantId)
  const deliveryFee = useCartStore((s) => s.deliveryFee)
  const incrementItem = useCartStore((s) => s.incrementItem)
  const decrementItem = useCartStore((s) => s.decrementItem)
  const clearCart = useCartStore((s) => s.clearCart)

  const placeOrder = useOrderStore((s) => s.placeOrder)

  // Computed values as inline selectors — avoids getSnapshot loop
  const subtotal = useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.qty, 0))
  const total = useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.qty, 0) + s.deliveryFee)

  const [showOrder, setShowOrder] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleOrderSuccess = useCallback((customerData) => {
    const state = useCartStore.getState()
    placeOrder({
      restaurantName: state.restaurantName,
      restaurantId: state.restaurantId,
      items: state.items,
      deliveryFee: state.deliveryFee,
      total: state.items.reduce((s, i) => s + i.price * i.qty, 0) + state.deliveryFee,
      customer: customerData,
    })
    setShowOrder(false)
    setShowConfirmation(true)
  }, [placeOrder])

  const handleConfirmationDone = useCallback(() => {
    setShowConfirmation(false)
    clearCart()
    setIsOpen(false)
  }, [clearCart, setIsOpen])

  return (
    <>
      <AnimatePresence>
        {isOpen && !showConfirmation && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-lg"
              style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2 shrink-0">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#E5E7EB' }} />
              </div>

              {/* Header */}
              <div className="px-6 pb-4 flex items-center justify-between shrink-0">
                <div>
                  <h2
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    Your Cart
                  </h2>
                  {restaurantName && <p className="text-xs text-gray-400 mt-0.5">{restaurantName}</p>}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                  aria-label="Close cart"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Items */}
              <div className="overflow-y-auto flex-1 px-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">🛒</p>
                    <p className="text-gray-400 text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        className="flex items-center gap-4 py-4"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                          {item.notes ? (
                            <p className="text-xs mt-0.5 italic" style={{ color: '#fa5d66' }}>
                              {item.notes}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 mt-0.5">${item.price.toFixed(2)} each</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => decrementItem(item.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                            style={{ backgroundColor: '#fde8e9', color: '#fa5d66' }}
                          >
                            −
                          </motion.button>
                          <motion.span
                            key={item.qty}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            className="w-5 text-center font-bold text-sm text-gray-900"
                          >
                            {item.qty}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => incrementItem(item.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
                            style={{ backgroundColor: '#fa5d66' }}
                          >
                            +
                          </motion.button>
                        </div>
                        <span
                          className="text-sm font-semibold shrink-0"
                          style={{ color: '#fa5d66', minWidth: 48, textAlign: 'right' }}
                        >
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-6 pt-4 pb-6 shrink-0">
                  <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: '#F9FAFB' }}>
                    <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span>Delivery fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowOrder(true)}
                    className="w-full py-4 rounded-xl text-white font-semibold text-base"
                    style={{ backgroundColor: '#fa5d66' }}
                  >
                    Place Order · ${total.toFixed(2)}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrder && (
          <OrderModal
            restaurantName={restaurantName}
            onClose={() => setShowOrder(false)}
            onSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmation && (
          <OrderConfirmation
            restaurantName={restaurantName}
            onDone={handleConfirmationDone}
          />
        )}
      </AnimatePresence>
    </>
  )
}
