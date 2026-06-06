'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import MenuItem from './MenuItem'

function BackIcon2() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export default function MenuPage({ restaurant }) {
  const categories = Object.entries(restaurant.menu)
  const categoryNames = categories.map(([name]) => name)
  const [activeCategory, setActiveCategory] = useState(categoryNames[0])
  const navRef = useRef(null)

  // Scroll-spy: update active pill on scroll
  useEffect(() => {
    const OFFSET = 16 + 64 + 56 // topbar + navbar + category nav height

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('cat-', '')
            setActiveCategory(id)
          }
        })
      },
      { rootMargin: `-${OFFSET}px 0px -60% 0px`, threshold: 0 }
    )

    categoryNames.forEach((name) => {
      const el = document.getElementById(`cat-${name}`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToCategory = useCallback((name) => {
    setActiveCategory(name)
    const el = document.getElementById(`cat-${name}`)
    if (!el) return
    const OFFSET = 16 + 64 + 56
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  return (
    <div>
      {/* ── Restaurant info bar ── */}
      <div className="px-5 pt-5 pb-4 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <Link href="/" aria-label="Back" className="mt-1 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#F3F4F6' }}>
            <BackIcon2 />
          </Link>
          <div className="flex-1 min-w-0">
            <h1
              className="text-xl font-bold text-gray-900 leading-snug"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              {restaurant.emoji} {restaurant.name}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: '#FFD93D22', color: '#b8860b' }}>
                ⭐ {restaurant.rating}
              </span>
              <span className="text-xs text-gray-400">⏱ {restaurant.deliveryTime}</span>
              <span className="text-xs text-gray-400">🛵 ${restaurant.deliveryFee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky category nav ── */}
      <div
        ref={navRef}
        className="sticky z-30 bg-white"
        style={{ top: 64, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex gap-2 px-4 py-3 overflow-x-auto max-w-2xl mx-auto" style={{ scrollbarWidth: 'none' }}>
          {categoryNames.map((name) => (
            <button
              key={name}
              onClick={() => scrollToCategory(name)}
              className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={
                activeCategory === name
                  ? { background: '#1e1b4b', color: 'white' }
                  : { background: '#F3F4F6', color: '#6B7280' }
              }
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu items ── */}
      <div className="px-5 py-5 max-w-2xl mx-auto pb-28">
        {categories.map(([category, items], catIndex) => (
          <section key={category} id={`cat-${category}`} className="mb-8">
            {/* Category header */}
            <div className="flex items-center gap-3 mb-1 mt-2">
              <h2 className="text-base font-bold text-gray-900 shrink-0">{category}</h2>
              <div className="flex-1 h-px" style={{ background: `${restaurant.headerColor}22` }} />
              <span className="text-xs shrink-0" style={{ color: 'rgba(0,0,0,0.3)' }}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {items.map((item, index) => (
              <MenuItem
                key={item.id}
                item={item}
                restaurant={restaurant}
                index={catIndex * 10 + index}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
