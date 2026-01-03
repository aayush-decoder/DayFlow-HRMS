"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AttendanceOverridePage() {
  const { id } = useParams()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Override Attendance
      </h2>

      {/* TODO:
        - Fetch attendance details
        - Status dropdown
        - Reason input
      */}

      <Button>Save Override</Button>
    </div>
  )
}
