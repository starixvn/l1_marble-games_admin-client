import { IconDotsVertical, IconLogout, IconLock } from '@tabler/icons-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/auth.context'
import { ChangePassword } from './change-password-dropdown'

export function NavUser({
  user,
}: Readonly<{
  user: {
    name: string
  }
}>) {
  const { isMobile } = useSidebar()
  const { handleLogout } = useContext(AuthContext)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
              <IconLock />
              Change Password
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <ChangePassword open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
    </SidebarMenu>
  )
}
