"use client"

export function AdminHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* TODO:
        - Show today’s attendance stats
        - Show present / half-day / absent counts
      */}

      <p className="text-muted-foreground">
        Attendance overview for today
      </p>
    </div>
  )
}
