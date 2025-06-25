import * as React from 'react'
import { IconUser, IconSettings, IconHome } from '@tabler/icons-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'admin',
  },
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: IconHome,
    },
    {
      title: 'Operators',
      url: '/operators',
      icon: IconUser,
    },
    {
      title: 'Game Configs',
      url: '/game-configs',
      icon: IconSettings,
    },
    {
      title: 'Game Integrations',
      url: '/game-integrations',
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <span className="text-base font-semibold">Admin Site</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
