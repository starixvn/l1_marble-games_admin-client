import { LoginForm } from '@/components/login-form'
import { MinimalLayout } from '@/components/layouts/minimal.layout'
import { useCallback, useContext, useEffect } from 'react'
import type { UserCredential } from '../hooks/useAuth'
import { toast } from 'sonner'
import { AuthContext } from '../contexts/auth.context'
import { useNavigate, useSearchParams } from 'react-router'

function LoginPage() {
  const { handleLogin: handleLoginAuth, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') ?? '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  const handleLogin = useCallback(
    async (credential: UserCredential) => {
      try {
        await handleLoginAuth(credential)
      } catch (error) {
        toast.error((error as Error).message)
      }
    },
    [handleLoginAuth],
  )

  return (
    <MinimalLayout>
      <LoginForm handleLogin={handleLogin} />
    </MinimalLayout>
  )
}

export default LoginPage
