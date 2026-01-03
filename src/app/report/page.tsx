"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AttendanceReportPage() {
  const [employeeId, setEmployeeId] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function sendReport() {
    setLoading(true)
    await fetch("/api/attendance/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, email }),
    })
    setLoading(false)
    alert("Attendance report emailed!")
  }

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Send Attendance Report</h2>

      <Input
        placeholder="Employee ID"
        value={employeeId}
        onChange={e => setEmployeeId(e.target.value)}
      />

      <Input
        placeholder="Employee Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <Button onClick={sendReport} disabled={loading}>
        {loading ? "Sending..." : "Send PDF"}
      </Button>
    </div>
  )
}
