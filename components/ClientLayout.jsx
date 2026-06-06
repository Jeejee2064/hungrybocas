'use client'
import { useEffect } from 'react'
import Navbar from './Navbar'
import FloatingCartButton from './FloatingCartButton'
import CartSheet from './CartSheet'
import PageTransition from './PageTransition'
import PWAInstallBanner from './PWAInstallBanner'
import ActiveOrderCard from './ActiveOrderCard'

export default function ClientLayout({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Navbar />
      <main className="pt-16">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <FloatingCartButton />
      <CartSheet />
      <ActiveOrderCard />
      <PWAInstallBanner />
    </div>
  )
}
