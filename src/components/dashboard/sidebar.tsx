"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Sidebar({ role }: { role: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if API call fails
      router.push('/login')
    }
  }

  return (
    <aside className="w-64 border-r p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">
        {role === "ADMIN" ? "Admin Dashboard" : "Dashboard"}
      </h2>

      <Link href="/dashboard">
        <Button variant="ghost" className="w-full justify-start">
          Home
        </Button>
      </Link>

      <Link href="/dashboard/attendance">
        <Button variant="ghost" className="w-full justify-start">
          Attendance
        </Button>
      </Link>

      {role === "ADMIN" && (
        <Link href="/dashboard/report">
          <Button variant="ghost" className="w-full justify-start">
            Reports
          </Button>
        </Link>
      )}

      <Button variant="ghost" className="w-full justify-start" disabled>
        Leave Management
      </Button>

      <div className="pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  )
}
