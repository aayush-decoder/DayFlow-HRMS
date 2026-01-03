"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, CalendarCheck, CalendarX, Timer } from "lucide-react"

interface AttendanceRecord {
  date: string
  checkIn: string | null
  checkOut: string | null
  workHours: number
  status: string
}

interface AttendanceSummary {
  totalWorkingHours: number
  daysPresent: number
  daysAbsent: number
  averageHours: number
}

export function EmployeeAttendance() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch("/api/attendance/me?month=1&year=2026", {
          method: 'GET',
          credentials: 'include', // This ensures cookies are sent
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          setError(result.error || 'Failed to fetch attendance')
          return
        }
        
        setData(result)
      } catch (err) {
        setError('Network error occurred')
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">My Attendance</h2>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">My Attendance</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold tracking-tight">My Attendance History</h2>

      {data && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold">Summary</h3>
            <p>Total Working Hours: {data.summary?.totalWorkingHours || 0} hours</p>
          </div>
          
          <div className="bg-white border rounded p-4">
            <h3 className="font-semibold mb-2">Attendance Records</h3>
            {data.records && data.records.length > 0 ? (
              <div className="space-y-2">
                {data.records.map((record: any, index: number) => (
                  <div key={index} className="border-b pb-2">
                    <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                    <p><strong>Check In:</strong> {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'Not checked in'}</p>
                    <p><strong>Check Out:</strong> {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'Not checked out'}</p>
                    <p><strong>Work Hours:</strong> {record.workHours} hours</p>
                    <p><strong>Status:</strong> {record.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No attendance records found for this month.</p>
            )}
          </div>
        </div>
      )}

      {/* Debug info - remove in production */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600">Debug Info</summary>
        <pre className="bg-muted p-4 rounded text-xs mt-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  )
}
