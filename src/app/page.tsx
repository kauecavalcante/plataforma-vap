// src/app/page.tsx
import { redirect } from 'next/navigation'

export default function HomePage() {
  // redireciona quem chegar na raiz para /login
  redirect('/login')
}
