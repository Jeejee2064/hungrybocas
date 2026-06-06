'use client'
import { useEffect, useRef, useState } from 'react'

const BOCAS_CENTER = [9.3397, -82.2512]

function GPSIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <path d="M21 12a9 9 0 11-3-6.7" />
    </svg>
  )
}

export default function MapPicker({ onLocationChange }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const callbackRef = useRef(onLocationChange)
  callbackRef.current = onLocationChange

  const [loadingGPS, setLoadingGPS] = useState(false)
  const [gpsError, setGpsError] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Guard: container already has a Leaflet instance (StrictMode double-invoke)
    if (mapRef.current || containerRef.current?._leaflet_id) return

    import('leaflet').then((mod) => {
      if (cancelled || !containerRef.current || containerRef.current._leaflet_id) return

      const L = mod.default

      const pinIcon = L.divIcon({
        html: `<div style="position:relative;width:32px;height:44px">
          <div style="
            width:32px;height:32px;
            background:#fa5d66;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid white;
            box-shadow:0 4px 14px rgba(250,93,102,0.5);
          "></div>
          <div style="
            position:absolute;bottom:0;left:50%;
            transform:translateX(-50%);
            width:8px;height:4px;
            background:rgba(0,0,0,0.15);
            border-radius:50%;
            filter:blur(2px);
          "></div>
        </div>`,
        className: '',
        iconSize: [32, 44],
        iconAnchor: [16, 44],
      })

      const map = L.map(containerRef.current, {
        center: BOCAS_CENTER,
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      L.control.attribution({ position: 'bottomleft', prefix: '© OpenStreetMap' }).addTo(map)

      const marker = L.marker(BOCAS_CENTER, { icon: pinIcon, draggable: true }).addTo(map)

      const emit = (lat, lng) => callbackRef.current({ lat, lng })

      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng()
        emit(lat, lng)
      })

      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        emit(lat, lng)
      })

      mapRef.current = map
      markerRef.current = marker
      emit(BOCAS_CENTER[0], BOCAS_CENTER[1])
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  const handleGPS = () => {
    if (!navigator.geolocation) return
    setLoadingGPS(true)
    setGpsError(false)

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([lat, lng], 17)
          markerRef.current.setLatLng([lat, lng])
          callbackRef.current({ lat, lng })
        }
        setLoadingGPS(false)
      },
      () => {
        setGpsError(true)
        setLoadingGPS(false)
        setTimeout(() => setGpsError(false), 3000)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ height: 240, border: '1.5px solid rgba(0,0,0,0.08)' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div ref={containerRef} className="w-full h-full" />

      {/* GPS button */}
      <button
        onClick={handleGPS}
        disabled={loadingGPS}
        className="absolute top-3 right-3 z-[999] bg-white rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs font-semibold shadow-md"
        style={{
          color: gpsError ? '#EF4444' : '#fa5d66',
          border: '1.5px solid rgba(250,93,102,0.25)',
        }}
        aria-label="Use GPS location"
      >
        {loadingGPS ? <Spinner /> : <GPSIcon />}
        {gpsError ? 'GPS unavailable' : loadingGPS ? 'Locating…' : 'My location'}
      </button>

      {/* Hint bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[999] text-xs text-center py-2 px-4 font-medium"
        style={{
          background: 'linear-gradient(to top, rgba(10,15,30,0.75), transparent)',
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        Tap map or drag pin to set delivery location
      </div>
    </div>
  )
}
