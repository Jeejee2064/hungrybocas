'use client'
import { motion } from 'framer-motion'
import { computeStatus } from '@/lib/order-store'

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-1.5">
      <span className="text-sm text-gray-400 shrink-0">{label}</span>
      <span className="text-sm font-medium text-right truncate" style={{ color: accent ? '#fa5d66' : '#111827' }}>
        {value}
      </span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-2">{title}</p>
      {children}
    </div>
  )
}

export default function OrderDetailSheet({ order, onClose }) {
  const status = computeStatus(order.placedAt)
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0)
  const deliveryFee = order.deliveryFee ?? (order.total - subtotal)
  const time = new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = new Date(order.placedAt).toLocaleDateString([], { day: 'numeric', month: 'short' })

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full bg-white md:rounded-2xl md:max-w-md md:mx-4"
        style={{ maxHeight: '88vh', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#E5E7EB' }} />
        </div>

        {/* Header */}
        <div className="px-6 pt-3 pb-4 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Order details
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{order.restaurantName} · {date} at {time}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
            <span>{status.emoji}</span>
            <span>{status.label}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#F3F4F6' }} className="shrink-0" />

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pt-5 pb-8">

          {/* Items */}
          <Section title="Items">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #F3F4F6' }}>
              {order.items.map((item, i) => (
                <div
                  key={item.id}
                  className="px-4 py-3"
                  style={{ borderBottom: i < order.items.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: '#fde8e9', color: '#fa5d66' }}
                      >
                        {item.qty}×
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold shrink-0" style={{ color: '#fa5d66' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-xs mt-1 ml-8 italic" style={{ color: '#9CA3AF' }}>
                      {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Price breakdown */}
          <Section title="Total">
            <div className="rounded-2xl px-4 py-1" style={{ backgroundColor: '#F9FAFB' }}>
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Delivery fee" value={`$${deliveryFee.toFixed(2)}`} />
              <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '4px 0' }} />
              <Row label="Total" value={`$${order.total.toFixed(2)}`} accent />
            </div>
          </Section>

          {/* Customer info */}
          <Section title="Delivery info">
            <div className="rounded-2xl px-4 py-1" style={{ backgroundColor: '#F9FAFB' }}>
              {order.customer?.name && <Row label="👤 Name" value={order.customer.name} />}
              {order.customer?.phone && <Row label="📞 Phone" value={`+${order.customer.phone}`} />}
              {order.customer?.address && <Row label="📝 Notes" value={order.customer.address} />}
              {order.customer?.location && (
                <Row
                  label="📍 Pin"
                  value={`${order.customer.location.lat.toFixed(4)}, ${order.customer.location.lng.toFixed(4)}`}
                />
              )}
            </div>
          </Section>
        </div>
      </motion.div>
    </div>
  )
}
