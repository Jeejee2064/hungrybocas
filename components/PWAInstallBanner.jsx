'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Already installed — nothing to show
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && navigator.standalone)
    if (isStandalone) return

    // Dismissed this session
    if (sessionStorage.getItem('pwa-dismissed')) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window).MSStream
    setIsIOS(ios)

    if (ios) {
      // iOS has no beforeinstallprompt — show instructions after a delay
      const t = setTimeout(() => setShow(true), 4000)
      return () => clearTimeout(t)
    }

    // Chrome/Android: capture the prompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') dismiss()
    setDeferredPrompt(null)
  }

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-6 md:bottom-8 md:max-w-xs"
        >
          <div
            className="bg-white rounded-2xl p-4 flex items-center gap-3"
            style={{
              boxShadow: '0 8px 32px rgba(30,27,75,0.18)',
              border: '1px solid rgba(30,27,75,0.06)',
            }}
          >
            <Image
              src="/icon-192.png"
              alt="Bocas Delivery"
              width={44}
              height={44}
              className="rounded-xl shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-snug">
                Install Bocas Delivery
              </p>
              {isIOS ? (
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  Tap <span className="inline-flex items-center gap-0.5 font-semibold text-gray-600">
                    Share
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline' }}>
                      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </span>{' '}
                  → "Add to Home Screen"
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-0.5">
                  Add to your home screen
                </p>
              )}
            </div>

            {!isIOS && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleInstall}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: '#fa5d66' }}
              >
                Install
              </motion.button>
            )}

            <button
              onClick={dismiss}
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }}
              aria-label="Dismiss"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
