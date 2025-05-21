// src/components/AuthGuard.tsx
'use client'

import { ReactNode, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const session = useSession()   // undefined = checando, null = sem sessão, objeto = autenticado
  const router = useRouter()

  useEffect(() => {
    if (session === null) {
      router.replace('/login')
    }
  }, [session, router])

  // Enquanto checa ou se não estiver autenticado, exibe loading.svg full-screen
  if (!session) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        zIndex: 9999
      }}>
        <Image
          src="/loading.svg"
          alt="Carregando..."
          width={80}
          height={80}
          priority
        />
      </div>
    )
  }

  // Quando tiver sessão válida, renderiza os filhos
  return <>{children}</>
}
