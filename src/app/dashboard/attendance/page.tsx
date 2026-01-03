import { getServerAuth } from "@/lib/server-auth"
import { EmployeeAttendance } from "@/components/attendance/employee-attendance"
import { AdminAttendance } from "@/components/attendance/admin-attendance"

export default function AttendancePage() {
  const auth = getServerAuth()

  if (auth?.role === "ADMIN") {
    return <AdminAttendance />
  }

  return <EmployeeAttendance />
}
