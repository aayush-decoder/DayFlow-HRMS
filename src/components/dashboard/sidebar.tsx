"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Calendar, FileText, User, Settings, LogOut, Clock, Banknote } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.clear()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }

  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Attendance",
      icon: Clock,
      href: "/dashboard/attendance",
      color: "text-violet-500",
    },
    {
      label: "Time Off",
      icon: Calendar,
      href: "/dashboard/timeoff",
      color: "text-pink-500",
    },
    {
      label: "Payroll",
      icon: Banknote,
      href: "/dashboard/payroll",
      color: "text-emerald-500",
    },
    {
      label: "My Profile",
      icon: User,
      href: "/profile",
      color: "text-orange-500",
    },
  ]

  // Admin only routes
  if (role === 'ADMIN') {
    routes.push({
      label: "Approvals",
      icon: Settings,
      href: "/admin/timeoff",
      color: "text-gray-500",
    })
    routes.push({
      label: "Manage Payroll",
      icon: Banknote,
      href: "/dashboard/admin/payroll",
      color: "text-emerald-600",
    })
  }

  return (
    <div className="hidden md:flex flex-col h-screen p-4 bg-background">
      <div className="flex flex-col flex-1 w-64 bg-sidebar/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
        {/* Brand */}
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <Clock className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">DayFlow</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 space-y-2 overflow-y-auto">
          {routes.map((route) => {
            const isActive = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md translate-x-1"
                    : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/10 hover:text-foreground"
                )}
              >
                <route.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : route.color)} />
                {route.label}
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>

        {/* User Footer */}
        <div className="p-4 mt-auto">
          <div className="p-3 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent rounded-2xl border border-white/20 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                {role[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate capitalize">{role.toLowerCase()}</p>
                <p className="text-[10px] text-muted-foreground">Pro Plan</p>
              </div>
            </div>
            <div className="flex gap-1">
              <ModeToggle />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full" onClick={handleLogout} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
