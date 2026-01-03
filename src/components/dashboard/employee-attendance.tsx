"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, CalendarCheck, CalendarX, Timer } from "lucide-react"
import { AttendanceHeatmap } from "./attendance-heatmap"

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
    return <div className="text-center py-10 animate-pulse">Loading attendance history...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold tracking-tight">My Attendance History</h2>

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

      {/* Heatmap Section */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Activity</CardTitle>
          <p className="text-sm text-muted-foreground">Yearly contribution view</p>
        </CardHeader>
        <CardContent>
          <AttendanceHeatmap />
        </CardContent>
      </Card>

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
                    No attendance records found for this month used default logic.
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
    </div>
  )
}
