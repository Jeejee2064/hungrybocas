'use client'
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl animate-pulse w-full" style={{ minHeight: 240, backgroundColor: '#F3F4F6' }} />
  ),
})

export default function LocationPicker({ onLocationChange, error }) {
  const [mode, setMode] = useState(null) // null | 'gps' | 'map'
  const [gpsLoc, setGpsLoc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [gpsError, setGpsError] = useState(null)

  const handleGPS = () => {
    if (!('geolocation' in navigator)) {
      setGpsError('GPS not available — please pin your location.')
      setMode('map')
      return
    }
    setLoading(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setGpsLoc(loc)
        setMode('gps')
        setLoading(false)
        onLocationChange(loc)
      },
      () => {
        setLoading(false)
        setGpsError('Location access denied — please pin your spot on the map.')
        setMode('map')
      },
      { timeout: 12000, enableHighAccuracy: true }
    )
  }

  const handleMapChange = useCallback((loc) => onLocationChange(loc), [onLocationChange])

  const resetToChoice = () => {
    setMode(null)
    setGpsLoc(null)
    setGpsError(null)
    onLocationChange(null)
  }

  // ── GPS confirmed ──
  if (mode === 'gps' && gpsLoc) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl text-center h-full"
        style={{ backgroundColor: '#F0FDF4', border: '1.5px solid #86EFAC', minHeight: 160 }}
      >
        <span className="text-4xl">📍</span>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#166534' }}>Location detected!</p>
          <p className="text-xs text-gray-400 mt-1">
            {gpsLoc.lat.toFixed(5)}, {gpsLoc.lng.toFixed(5)}
          </p>
        </div>
        <button
          onClick={resetToChoice}
          className="text-xs underline mt-1"
          style={{ color: '#9CA3AF' }}
        >
          Change location
        </button>
      </motion.div>
    )
  }

  // ── Map mode ──
  if (mode === 'map') {
    return (
      <div className="flex flex-col gap-2 h-full">
        {gpsError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs flex items-center gap-1" style={{ color: '#F97316' }}>
            <span>⚠</span> {gpsError}
          </motion.p>
        )}
        <div className="flex-1" style={{ minHeight: 240 }}>
          <MapPicker onLocationChange={handleMapChange} />
        </div>
        <button onClick={resetToChoice} className="text-xs text-center underline" style={{ color: '#9CA3AF' }}>
          ← Back
        </button>
      </div>
    )
  }

  // ── Choice screen (default) ──
  return (
    <div className="flex flex-col gap-3 justify-center h-full" style={{ minHeight: 160 }}>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </motion.p>
      )}

      <ChoiceButton
        emoji={loading ? '⌛' : '📡'}
        title={loading ? 'Detecting your location…' : 'Use my current location'}
        sub="Fastest — uses your GPS"
        disabled={loading}
        onClick={handleGPS}
      />
      <ChoiceButton
        emoji="🗺"
        title="Pin on map"
        sub="Drag the pin to your exact spot"
        onClick={() => setMode('map')}
      />
    </div>
  )
}

function ChoiceButton({ emoji, title, sub, onClick, disabled }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-3 w-full p-4 rounded-xl text-left"
      style={{
        backgroundColor: '#F9FAFB',
        border: '1.5px solid #E5E7EB',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = '#fa5d66' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB' }}
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
      <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </motion.button>
  )
}
