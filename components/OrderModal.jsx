'use client'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import LocationPicker from './LocationPicker'

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1 flex items-center gap-1"
        >
          <span>⚠</span> {error}
        </motion.p>
      )}
    </div>
  )
}

function inputStyle(hasError) {
  return {
    backgroundColor: '#F9FAFB',
    border: `1.5px solid ${hasError ? '#EF4444' : 'transparent'}`,
    outline: 'none',
    transition: 'border-color 0.15s ease',
  }
}

export default function OrderModal({ restaurantName, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [location, setLocation] = useState(null)
  const [errors, setErrors] = useState({})

  const nameRef = useRef(null)
  const phoneContainerRef = useRef(null)
  const locationSectionRef = useRef(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const focusBorder = (e) => { e.target.style.borderColor = '#fa5d66' }
  const blurBorder = (hasError) => (e) => { e.target.style.borderColor = hasError ? '#EF4444' : 'transparent' }

  const handleLocationChange = (loc) => {
    setLocation(loc)
    if (loc) setErrors((e) => ({ ...e, map: undefined }))
  }

  const handleSubmit = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name'
    if (!form.phone || form.phone.length < 5) e.phone = 'Please enter your phone number'
    if (!location) e.map = 'Please choose or pin your delivery location'
    setErrors(e)

    if (Object.keys(e).length === 0) {
      onSuccess({ ...form, location })
      return
    }

    setTimeout(() => {
      if (e.name && nameRef.current) {
        nameRef.current.focus()
        nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (e.phone && phoneContainerRef.current) {
        phoneContainerRef.current.querySelector('input')?.focus()
        phoneContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (e.map && locationSectionRef.current) {
        locationSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 50)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Sheet / Dialog */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full bg-white md:rounded-2xl md:max-w-3xl md:mx-4"
        style={{
          maxHeight: '92vh',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-0 shrink-0 md:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#E5E7EB' }} />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-3 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
              Place Order
            </h2>
            {restaurantName && <p className="text-xs text-gray-400 mt-0.5">{restaurantName}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          <div className="flex flex-col md:flex-row md:gap-6">

            {/* ── Left: form fields ── */}
            <div className="flex flex-col gap-4 md:w-72 md:shrink-0">
              <Field label="Full Name" error={errors.name}>
                <input
                  ref={nameRef}
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Your name"
                  className="w-full px-4 py-3.5 rounded-xl text-sm text-gray-900"
                  style={inputStyle(errors.name)}
                  onFocus={focusBorder}
                  onBlur={blurBorder(errors.name)}
                />
              </Field>

              <Field label="Phone Number" error={errors.phone}>
                <div ref={phoneContainerRef}>
                  <PhoneInput
                    country="pa"
                    value={form.phone}
                    onChange={(phone) => setForm((f) => ({ ...f, phone }))}
                    containerClass="phone-input-container"
                    inputClass={`phone-input-field${errors.phone ? ' phone-input-error' : ''}`}
                    buttonClass="phone-input-flag"
                    dropdownClass="phone-input-dropdown"
                    enableSearch
                    searchPlaceholder="Search country…"
                    searchStyle={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: 8,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                    disableSearchIcon
                  />
                </div>
              </Field>

              <Field label="Address details (optional)">
                <textarea
                  value={form.address}
                  onChange={set('address')}
                  placeholder="Apt, building, color of door, landmark…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 resize-none"
                  style={{ ...inputStyle(false), lineHeight: 1.5 }}
                  onFocus={focusBorder}
                  onBlur={blurBorder(false)}
                />
              </Field>

              {/* Submit — desktop */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="hidden md:block w-full py-4 rounded-xl text-white font-semibold text-base mt-auto"
                style={{ backgroundColor: '#fa5d66' }}
              >
                Confirm Order
              </motion.button>
            </div>

            {/* ── Right: location picker ── */}
            <div ref={locationSectionRef} className="flex-1 flex flex-col gap-1.5 mt-4 md:mt-0">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Delivery Location
              </label>
              <div className="flex-1">
                <LocationPicker
                  onLocationChange={handleLocationChange}
                  error={errors.map}
                />
              </div>
            </div>
          </div>

          {/* Submit — mobile */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="md:hidden mt-5 w-full py-4 rounded-xl text-white font-semibold text-base"
            style={{ backgroundColor: '#fa5d66' }}
          >
            Confirm Order
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
