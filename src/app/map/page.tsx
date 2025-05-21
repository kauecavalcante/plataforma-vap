'use client'

import { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
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

  return (
    <AuthGuard>
      <div className={styles.container}>
        <h1 className={styles.title}>Mapa de Usuários</h1>
        <div className={styles.mapWrapper}>
          {/* Renderiza o mapa sempre */}
          <Map points={points} />
          {/* Exibe o overlay até a fetch terminar */}
          {loading && (
            <div className={styles.loadingOverlay}>
              Carregando localizações...
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
