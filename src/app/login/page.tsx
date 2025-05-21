// src/app/login/page.tsx
'use client'

import Image from 'next/image'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react'

const ALLOWED_ROLES = [
  'Cirurgião',
  'Anestesista',
  'Otorrinolaringologista',
  'Pediatra',
] as const

type Role = typeof ALLOWED_ROLES[number]

export default function LoginPage() {
  const session = useSession()             // undefined = checando; null = não está logado; objeto = logado
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // redireciona quem já estiver autenticado
  useEffect(() => {
    if (session) {
      router.replace('/map')
    }
  }, [session, router])

  // 1) Enquanto checa a sessão, só mostra o loading
  if (session === undefined) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        zIndex: 9999,
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

  // 2) Se não está logado, renderiza o formulário
  if (session === null) {
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setErrorMsg(null)

      // autenticação
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password })
      if (authError || !authData.session) {
        setErrorMsg(authError?.message ?? 'Falha na autenticação')
        return
      }

      // checa cargo
      const { data: userRow, error: rowError } = await supabase
        .from('usuarios')
        .select('usuario')
        .eq('user_ref', authData.user.id)
        .single<{ usuario: Role }>()

      if (rowError || !userRow) {
        setErrorMsg('Erro ao verificar permissões')
        await supabase.auth.signOut()
        return
      }

      if (!ALLOWED_ROLES.includes(userRow.usuario)) {
        setErrorMsg('Acesso não autorizado para seu tipo de usuário')
        await supabase.auth.signOut()
        return
      }

      // ao fim, o useEffect acima faz o replace para /map
    }

    return (
      <div className="container">
        <div className="logoWrapper">
          <Image
            src="/logo.png"
            alt="Logo vap app"
            fill
            style={{ objectFit: 'contain' }}
            quality={100}
            priority
          />
        </div>

        <div className="card">
          <h1>Login</h1>
          {errorMsg && <p className="error">{errorMsg}</p>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>
        </div>

        <style jsx>{`
          .container {
            background: #fff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }

          .logoWrapper {
            position: relative;
            width: 200px;
            height: 100px;
            margin-bottom: 2rem;
          }

          .card {
            background: #fff;
            color: #171717;
            padding: 2rem;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            width: 100%;
            max-width: 400px;
          }

          h1 {
            text-align: center;
            margin-bottom: 1rem;
            color: #171717;
          }

          .error {
            color: #c00;
            margin-bottom: 1rem;
            text-align: center;
          }

          .field {
            margin-bottom: 1rem;
          }

          label {
            display: block;
            margin-bottom: 0.25rem;
            font-weight: 500;
            color: #171717;
          }

          input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
            background: #fff;
            color: #171717;
          }

          input::placeholder {
            color: #999;
          }

          input:focus {
            outline: none;
            border-color: #4ecbc0;
            box-shadow: 0 0 0 2px rgba(78,203,192, 0.25);
          }

          .login-button {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 4px;
            background: #2a7d76;
            color: #fff;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .login-button:hover {
            background: #4ecbc0;
          }

          .login-button:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(78,203,192, 0.5);
          }
        `}</style>
      </div>
    )
  }

  // 3) Não cai aqui, pois session ou undefined ou null
  return null
}
