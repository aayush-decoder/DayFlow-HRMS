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
<<<<<<< HEAD
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState<AttendanceSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      // API now defaults to current month/year
      const res = await fetch("/api/attendance/me")
      if (res.ok) {
        const data = await res.json()
        setRecords(data.records || [])

        // Calculate basic stats client-side since API only gives total hours
        const recs = data.records || []
        const present = recs.filter((r: any) => r.status === "PRESENT").length
        const totalHours = data.summary?.totalWorkingHours || 0

        setSummary({
          totalWorkingHours: totalHours,
          daysPresent: present,
          daysAbsent: recs.filter((r: any) => r.status === "ABSENT").length,
          averageHours: present > 0 ? Number((totalHours / present).toFixed(1)) : 0
        })
      }
    } catch (error) {
      console.error("Failed to fetch attendance", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading attendance history...</div>
=======
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
>>>>>>> 200691e8a41196ab4225f69c3d9aab78e237a9b1
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold tracking-tight">My Attendance History</h2>

<<<<<<< HEAD
      {/* Stats Components */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Present</CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.daysPresent || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalWorkingHours || 0}</div>
            <p className="text-xs text-muted-foreground">Hours logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Hours</CardTitle>
            <Timer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.averageHours || 0}</div>
            <p className="text-xs text-muted-foreground">Per working day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent/Leave</CardTitle>
            <CalendarX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.daysAbsent || 0}</div>
            <p className="text-xs text-muted-foreground">Days missed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No attendance records found for this month based on updated logic.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                    </TableCell>
                    <TableCell>
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                    </TableCell>
                    <TableCell>{record.workHours > 0 ? `${record.workHours}h` : "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "PRESENT" ? "default" :
                            record.status === "ABSENT" ? "destructive" :
                              "secondary"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
=======
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
>>>>>>> 200691e8a41196ab4225f69c3d9aab78e237a9b1
    </div>
  )
}
