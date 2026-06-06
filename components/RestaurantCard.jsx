'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

function RestaurantImage({ restaurant }) {
  const [error, setError] = useState(false)

  if (!restaurant.image || error) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          background: `linear-gradient(145deg, ${restaurant.headerColor}88 0%, ${restaurant.headerColor} 100%)`,
        }}
      >
        <div style={{ position: 'absolute', width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', top: -60, right: -50 }} />
        <span className="relative z-10 text-8xl" style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.18))' }}>
          {restaurant.emoji}
        </span>
      </div>
    )
  }

  return (
    <>
      <Image
        src={restaurant.image}
        alt={restaurant.name}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Subtle dark overlay for text legibility */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 60%)' }} />
    </>
  )
}

export default function RestaurantCard({ restaurant, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.22 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/restaurant/${restaurant.slug}`} className="block">
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 4px 24px rgba(30,27,75,0.10), 0 1px 4px rgba(30,27,75,0.06)' }}
        >
          {/* ── Photo header ── */}
          <div className="relative h-52 overflow-hidden">
            <RestaurantImage restaurant={restaurant} />

            {/* Rating badge */}
            <div
              className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#FFD93D" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-xs font-bold text-gray-800">{restaurant.rating}</span>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="p-4 pt-3.5">
            <span
              className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
              style={{ background: `${restaurant.headerColor}18`, color: restaurant.headerColor }}
            >
              {restaurant.category}
            </span>

            <h3
              className="text-xl font-bold text-gray-900 leading-snug mb-1.5"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              {restaurant.name}
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed mb-4">{restaurant.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: '#F3F4F6', color: '#6B7280' }}
              >
                ⏱ {restaurant.deliveryTime}
              </span>
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={
                  restaurant.deliveryFee <= 1.5
                    ? { background: '#fde8e9', color: '#fa5d66' }
                    : { background: '#F3F4F6', color: '#6B7280' }
                }
              >
                🛵 ${restaurant.deliveryFee} delivery
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
