import { getServerAuth } from "@/lib/server-auth"
import { EmployeeAttendance } from "@/components/dashboard/employee-attendance"
import { AdminAttendance } from "@/components/dashboard/admin-atendance"

export default async function AttendancePage() {
  const auth = await getServerAuth()

  if (auth?.role === "ADMIN") {
    return <AdminAttendance />
  }

  return <EmployeeAttendance />
}
