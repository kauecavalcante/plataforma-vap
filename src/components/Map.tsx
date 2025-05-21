'use client'

import { useEffect, useRef } from 'react'
import maplibre from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { createRoot } from 'react-dom/client'
import { UserCard } from './UserCard'

interface Point {
  lat: number
  lng: number
  nome: string
  celular: string
  endereco: string
}

interface Props {
  points: Point[]
}

export function Map({ points }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibre.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: points.length ? [points[0].lng, points[0].lat] : [0, 0],
      zoom: points.length ? 8 : 2,
    })

    map.addControl(new maplibre.NavigationControl(), 'top-right')

    points.forEach(({ lat, lng, nome, celular, endereco }) => {
      // cria um container DOM para o React renderizar o card
      const popupNode = document.createElement('div')
      createRoot(popupNode).render(
        <UserCard nome={nome} celular={celular} endereco={endereco} />
      )

      const popup = new maplibre.Popup({ offset: 25 }).setDOMContent(popupNode)

      new maplibre.Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map)
    })

    return () => {
      map.remove()
    }
  }, [points])

  return <div ref={mapContainer} style={{ width: '100%', height: '600px' }} />
}
