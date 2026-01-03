"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Sidebar({ role }: { role: string }) {
  return (
    <aside className="w-64 border-r p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

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

      {/* TODO: Enable after Leave APIs */}
      <Button variant="ghost" className="w-full justify-start" disabled>
        Leave (Coming Soon)
      </Button>
    </aside>
  )
}
