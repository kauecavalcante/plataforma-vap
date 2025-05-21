'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'

interface LayoutContentProps {
  children: ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()

  // página de login (e outras públicas) ficam livres
  if (pathname === '/login' || pathname === '/signup') {
    return <>{children}</>
  }

  // todas as outras ficam protegidas
  return <AuthGuard>{children}</AuthGuard>
}
