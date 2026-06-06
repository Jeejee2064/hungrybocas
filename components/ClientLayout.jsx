'use client'
import Navbar from './Navbar'
import FloatingCartButton from './FloatingCartButton'
import CartSheet from './CartSheet'
import PageTransition from './PageTransition'
import PWAInstallBanner from './PWAInstallBanner'

export default function ClientLayout({ children }) {
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
      <PWAInstallBanner />
    </div>
  )
}
