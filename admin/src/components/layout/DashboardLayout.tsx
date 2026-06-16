import { Menu } from "lucide-react"
import { Outlet, Link, useLocation } from "react-router-dom"

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { navigationConfig } from "@/config/navigation"

function MobileBottomNav() {
  const { toggleSidebar } = useSidebar()
  const location = useLocation()
  
  // Get first 3 items from navigationConfig
  const visibleItems = navigationConfig.navMain.slice(0, 3)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 md:hidden">
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.url || (item.items && item.items.some(sub => location.pathname.startsWith(sub.url)))
        const Icon = item.icon
        return (
          <Link
            key={item.title}
            to={item.url}
            className={`flex flex-col items-center justify-center gap-1 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        )
      })}
      
      <button
        onClick={toggleSidebar}
        className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
      >
        <Menu className="h-5 w-5" />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
        <MobileBottomNav />
      </SidebarProvider>
    </TooltipProvider>
  )
}
