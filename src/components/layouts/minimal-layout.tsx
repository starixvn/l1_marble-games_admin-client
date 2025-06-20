import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/ui/sonner'

interface MinimalLayoutProps {
  children: React.ReactNode
}

export function MinimalLayout({ children }: Readonly<MinimalLayoutProps>) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">{children}</div>
      <Toaster />
    </div>
  )
}
