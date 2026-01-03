"use client"

import { Button } from "@/components/ui/button"

export function EmployeeHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>

      <div className="flex gap-2">
        <Button onClick={() => fetch("/api/attendance/check-in", { method: "POST" })}>
          Check In
        </Button>
        <Button
          variant="outline"
          onClick={() => fetch("/api/attendance/check-out", { method: "POST" })}
        >
          Check Out
        </Button>
      </div>

      {/* TODO:
        - Show today’s status
        - Show worked hours
        - Show leave status
      */}
    </div>
  )
}
