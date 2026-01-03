import { getServerAuth } from "@/lib/server-auth"
import { EmployeeHome } from "@/components/dashboard/employee-home"
import { AdminHome } from "@/components/dashboard/admin-home"

export default async function DashboardPage() {
    const auth = await getServerAuth()

    if (auth?.role === "ADMIN") {
        return <AdminHome />
    }

    // Default to Employee Home for employees and others
    return <EmployeeHome />
}
