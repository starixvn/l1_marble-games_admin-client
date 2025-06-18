import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserCredential } from "../hooks/useAuth"
import { useCallback } from "react"

export interface LoginFormProps extends React.ComponentProps<"div"> {
  handleLogin: (credential: UserCredential) => Promise<void>;
}

export function LoginForm({
  className,
  handleLogin,
  ...props
}: Readonly<LoginFormProps>) {

  const handleLoginFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    await handleLogin({ username, password });
  }, [handleLogin]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Login with username and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginFormSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    name="username"
                    id="username"
                    type="username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    name="password"
                    id="password"
                    type="password"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
