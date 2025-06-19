import { type Icon } from "@tabler/icons-react"
import { useLocation,Link } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: Readonly<{
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}>) {
  const location = useLocation()
  
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.url === '/' 
              ? location.pathname === '/'
              : location.pathname === item.url || location.pathname.startsWith(item.url)
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  asChild
                  className={isActive ? "bg-accent text-accent-foreground" : ""}
                >
                  <Link to={item.url} replace>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
