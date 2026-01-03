import { redirect } from "next/navigation"
import { getServerAuth } from "@/lib/server-auth"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = getServerAuth()
  if (!auth) redirect("/login")

  return (
    <div className="flex min-h-screen">
      <Sidebar role={auth.role} />
      <main className="flex-1 p-6 bg-muted/40">
        {children}
      </main>
    </div>
  )
}
