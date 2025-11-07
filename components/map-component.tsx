"use client"

import { MapPin } from "lucide-react"

interface MapComponentProps {
  latitude: number
  longitude: number
  soldierName: string
}

export function MapComponent({ latitude, longitude, soldierName }: MapComponentProps) {
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=13&output=embed`

  return (
    <div>
      <h2 className="text-xl font-black text-accent mb-4">GPS Position</h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden h-96">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        ></iframe>
      </div>
      <div className="mt-4 bg-card border border-border rounded-xl p-4 flex items-start gap-3">
        <MapPin className="text-accent flex-shrink-0 mt-1" size={20} />
        <div>
          <p className="font-bold text-foreground">{soldierName}</p>
          <p className="text-sm text-muted-foreground">Latitude: {latitude.toFixed(4)}°</p>
          <p className="text-sm text-muted-foreground">Longitude: {longitude.toFixed(4)}°</p>
        </div>
      </div>
    </div>
  )
}
