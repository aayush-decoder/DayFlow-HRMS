import { redirect } from "next/navigation"
import { getServerAuth } from "@/lib/server-auth"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getServerAuth()
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
