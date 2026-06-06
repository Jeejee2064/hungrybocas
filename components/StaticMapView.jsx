'use client'
import { useEffect, useRef } from 'react'

export default function StaticMapView({ lat, lng, height = 180 }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    if (mapRef.current || containerRef.current?._leaflet_id) return

    import('leaflet').then((mod) => {
      if (cancelled || !containerRef.current || containerRef.current._leaflet_id) return

      const L = mod.default

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)

      const pinIcon = L.divIcon({
        html: `<div style="position:relative;width:28px;height:38px">
          <div style="
            width:28px;height:28px;
            background:#fa5d66;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid white;
            box-shadow:0 4px 12px rgba(250,93,102,0.5);
          "></div>
          <div style="
            position:absolute;bottom:0;left:50%;
            transform:translateX(-50%);
            width:6px;height:3px;
            background:rgba(0,0,0,0.15);
            border-radius:50%;
            filter:blur(1px);
          "></div>
        </div>`,
        className: '',
        iconSize: [28, 38],
        iconAnchor: [14, 38],
      })

      L.marker([lat, lng], { icon: pinIcon }).addTo(map)

      mapRef.current = map
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng])

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden"
      style={{ height, border: '1px solid #F3F4F6' }}
    />
  )
}
