"use client"

import { useEffect, useState } from "react"

export function AdminAttendance() {
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/attendance?date=2025-10-22")
      .then(res => res.json())
      .then(setRecords)
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Attendance (Day-wise)
      </h2>

      {/* TODO:
        - Date picker
        - Filters
      */}

      <pre className="bg-muted p-4 rounded">
        {JSON.stringify(records, null, 2)}
      </pre>
    </div>
  )
}
