"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

export function AdminAttendance() {
  const [records, setRecords] = useState<any[]>([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // YYYY-MM-DD
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [date])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/attendance?date=${date}`)
      if (res.ok) {
        const data = await res.json()
        setRecords(data)
      }
    } catch (error) {
      console.error("Fetch failed", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!records.length) return
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Employee,Department,CheckIn,CheckOut,Status\n"
      + records.map(r => `${r.employee.name},${r.employee.department},${r.checkIn || ""},${r.checkOut || ""},${r.status}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `attendance_${date}.csv`)
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Daily Attendance Overview</h2>
          <p className="text-muted-foreground">Manage and monitor employee attendance</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-auto"
          />
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Loading...</TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No attendance records found for {date}.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium">{record.employee.name}</div>
                      <div className="text-xs text-muted-foreground">{record.employee.designation}</div>
                    </TableCell>
                    <TableCell>{record.employee.department}</TableCell>
                    <TableCell>
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                    </TableCell>
                    <TableCell>
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                    </TableCell>
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
