"use client"

import { useEffect, useState } from "react"

export function EmployeeAttendance() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/attendance/me?month=10&year=2025")
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Attendance</h2>

      {/* TODO:
        - Month selector
        - Summary cards
      */}

      <pre className="bg-muted p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
