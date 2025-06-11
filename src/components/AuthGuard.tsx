'use client'

import { ReactNode, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    // A verificação é feita aqui dentro do useEffect.
    // Se, após o carregamento inicial, a sessão for nula, redireciona.
    if (session === null) {
      router.replace('/login')
    }
  }, [session, router])

  // Se a sessão for 'undefined', significa que o Supabase ainda está checando.
  // Neste caso, exibimos a tela de carregamento.
  if (session === undefined) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#ffffff', zIndex: 9999
      }}>
        <Image src="/loading.svg" alt="Carregando..." width={80} height={80} priority />
      </div>
    )
  }

  // Se a sessão existir (não for undefined e nem null), renderiza o conteúdo da página.
  if (session) {
    return <>{children}</>
  }
  
  // Se a sessão for nula, o useEffect vai redirecionar.
  // Retornamos null para não mostrar nada enquanto o redirecionamento ocorre.
  return null
}