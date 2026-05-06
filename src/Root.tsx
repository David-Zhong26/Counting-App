import { AuthProvider } from './auth/AuthProvider.tsx'
import App from './App.tsx'
import { MissingEnvScreen } from './MissingEnvScreen.tsx'

function supabaseEnvReady() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  return Boolean(url && key)
}

export function Root() {
  if (!supabaseEnvReady()) {
    return <MissingEnvScreen />
  }

  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
