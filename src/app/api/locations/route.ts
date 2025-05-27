import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  // Busca todos os Pais e Cuidadores, incluindo latitude, longitude, nome, celular e os campos de endereço
  const { data: users, error } = await supabase
    .from('usuarios')
    .select('nome, celular, rua, numero, bairro, cidade, estado, latitude, longitude')
    .in('usuario', ['Pais', 'Cuidador'])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const locations: Location[] = users
    .map(u => {
      // Tenta converter latitude e longitude para números
      const lat = parseFloat(u.latitude as string)
      const lng = parseFloat(u.longitude as string)

      // Verifica se a conversão resultou em números válidos (não NaN)
      if (!isNaN(lat) && !isNaN(lng)) {
        const parts = [
          u.rua,
          u.numero,
          u.bairro,
          u.cidade,
          u.estado
        ].filter(field => field && String(field).trim() !== '') // Garante que é string para trim

        const endereco = parts.join(', ')

        return {
          lat: lat,
          lng: lng,
          nome: u.nome!,
          celular: u.celular!,
          endereco: endereco,
        }
      }
      return null // Retorna null para usuários sem lat/lng válidas ou com erro de conversão
    })
    .filter((loc): loc is Location => loc !== null) // Filtra os nulos

  return NextResponse.json(locations)
}