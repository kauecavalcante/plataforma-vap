'use client'

import { ReactNode, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

interface SupabaseProviderProps {
  children: ReactNode
}

export default function SupabaseProvider({ children }: SupabaseProviderProps) {
  // Use 'createClientComponentClient' que é a função correta para o App Router.
  const [supabaseClient] = useState(() => createClientComponentClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}