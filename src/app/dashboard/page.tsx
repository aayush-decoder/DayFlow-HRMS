import { getServerAuth } from "@/lib/server-auth"
import { EmployeeHome } from "@/components/dashboard/employee-home"
import { AdminHome } from "@/components/dashboard/admin-home"

export default async function DashboardPage() {
<<<<<<< HEAD
    const auth = await getServerAuth()
=======
  const auth = await getServerAuth()
>>>>>>> 200691e8a41196ab4225f69c3d9aab78e237a9b1

    if (auth?.role === "ADMIN") {
        return <AdminHome />
    }

    // Default to Employee Home for employees and others
    return <EmployeeHome />
}
