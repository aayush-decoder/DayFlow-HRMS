import { getServerAuth } from "@/lib/server-auth"
import { EmployeeHome } from "@/components/dashboard/employee-home"
import { AdminHome } from "@/components/dashboard/admin-home"

export default function DashboardPage() {
  const auth = getServerAuth()

  if (auth?.role === "ADMIN") {
    return <AdminHome />
  }

  return <EmployeeHome />
}
