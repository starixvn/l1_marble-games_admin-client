import { LoginForm } from "@/components/login-form"
import { MinimalLayout } from "@/components/layouts/minimal-layout"
import { useCallback, useContext } from "react"
import type { UseAuthReturn, UserCredential } from "../hooks/useAuth"
import { toast } from "sonner"
import { AuthContext } from "../contexts/auth.context"
import { useNavigate, useSearchParams } from "react-router"

function LoginPage() {
  const { handleLogin: handleLoginAuth } = useContext(AuthContext) as UseAuthReturn
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') ?? '/';

  const handleLogin = useCallback(async (credential: UserCredential) => {
    try {
      await handleLoginAuth(credential)
      navigate(redirectPath)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [redirectPath]);

  return (
    <MinimalLayout>
      <LoginForm handleLogin={handleLogin}/>
    </MinimalLayout>
  )
}

export default LoginPage