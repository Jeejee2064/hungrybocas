'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart-store'

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

export default function Navbar() {
  const setIsOpen = useCartStore((s) => s.setIsOpen)
  const count = useCartStore((s) => s.getCount())

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 md:px-8"
      style={{
        backgroundColor: '#1e1b4b',
        boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <motion.div whileHover={{ rotate: -8, scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <Image
            src="/icon-192.png"
            alt="Hungry Bocas"
            width={36}
            height={36}
            className="rounded-none"
            priority
          />
        </motion.div>
        <div className="hidden sm:block">
          <span
            className="text-white font-bold text-base leading-none block"
            style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
          >
            Hungry Bocas
          </span>
          <span className="text-xs leading-none mt-0.5 block" style={{ color: '#FFD93D' }}>
            Bocas del Toro 🇵🇦
          </span>
        </div>
      </Link>

      {/* Cart */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 text-white py-2 pl-3 pr-4 rounded-xl transition-colors"
        style={{ backgroundColor: count > 0 ? 'rgba(250,93,102,0.15)' : 'rgba(255,255,255,0.07)' }}
        aria-label="Open cart"
      >
        <CartIcon />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="text-white text-xs font-bold leading-none"
              style={{ fontSize: 13 }}
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
        {count > 0 && (
          <motion.span
            layoutId="cart-dot"
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: '#fa5d66' }}
          />
        )}
      </button>
    </nav>
  )
}
