// src/app/api/locations/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import pLimit from 'p-limit'

type Location = {
  lat: number
  lng: number
  nome: string
  celular: string
  endereco: string
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // busca todos os Pais e Cuidadores, sem exigir campos de endereço
  const { data: users, error } = await supabase
    .from('usuarios')
    .select('nome, celular, rua, numero, bairro, cidade, estado')
    .in('usuario', ['Pais', 'Cuidador'])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // cria um limitador para no máximo 10 requisições simultâneas
  const limit = pLimit(5)

  const locationPromises = users.map(u =>
    limit(async (): Promise<Location | null> => {
      // monta o endereço dinâmico
      const parts = [
        u.rua,
        u.numero,
        u.bairro,
        u.cidade,
        u.estado
      ].filter(field => field && field.trim() !== '')

      if (parts.length === 0) {
        return null
      }

      const endereco = parts.join(', ')

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            endereco
          )}`,
          { headers: { 'User-Agent': 'meu-app/1.0' } }
        )
        if (!res.ok) return null

        const results = await res.json()
        if (!Array.isArray(results) || results.length === 0) return null

        const { lat, lon } = results[0]
        return {
          lat:  parseFloat(lat),
          lng:  parseFloat(lon),
          nome: u.nome!,
          celular: u.celular!,
          endereco,
        }
      } catch {
        return null
      }
    })
  )

  // executa até 10 geocodings em paralelo
  const all = await Promise.all(locationPromises)
  const locations = all.filter((loc): loc is Location => loc !== null)

  return NextResponse.json(locations)
}
