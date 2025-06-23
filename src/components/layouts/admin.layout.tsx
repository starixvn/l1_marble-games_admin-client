import { Toaster } from '@/components/ui/sonner'
import { AppSidebar } from '../app-sidebar'
import { SiteHeader } from '../site-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return (
    <>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  )
}
