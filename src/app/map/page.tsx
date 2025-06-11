'use client'

import { useState, useEffect } from 'react'
import { Map } from '@/components/Map'
import styles from './page.module.css'

interface Point {
  lat: number
  lng: number
  nome: string
  celular: string
  endereco: string
}

export default function MapPage() {
  const [points, setPoints] = useState<Point[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then((data: Point[]) => setPoints(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // O <AuthGuard> foi removido daqui pois o layout já protege a página.
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mapa de Usuários</h1>
      <div className={styles.mapWrapper}>
        <Map points={points} />
        {loading && (
          <div className={styles.loadingOverlay}>
            Carregando localizações...
          </div>
        )}
      </div>
    </div>
  )
}