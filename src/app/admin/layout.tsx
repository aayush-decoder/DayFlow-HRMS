import { redirect } from "next/navigation"
import { getServerAuth } from "@/lib/server-auth"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getServerAuth()
  if (!auth) redirect("/login")
  
  // Only admins can access admin routes
  if (auth.role !== "ADMIN") redirect("/dashboard")

  return (
    <div className="flex min-h-screen">
      <Sidebar role={auth.role} />
      <main className="flex-1 p-6 bg-muted/40">
        {children}
      </main>
    </div>
  )
}
