import { prisma } from "@/lib/prisma"
import { getAuth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const auth = await getAuth(req)
    if (auth.role !== "EMPLOYEE") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!auth.employeeId) {
      return Response.json({ error: "Employee ID not found" }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const now = new Date()

    // Default to current month/year if not provided
    const month = Number(searchParams.get("month")) || (now.getMonth() + 1)
    const year = Number(searchParams.get("year")) || now.getFullYear()

    if (!month || !year) {
      // Should not be reached with defaults, but keeping safe
      return Response.json(
        { error: "month and year required" },
        { status: 400 }
      )
    }

    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0)

    const records = await prisma.attendance.findMany({
      where: {
        employeeId: auth.employeeId,
        date: { gte: start, lte: end }
      },
      orderBy: { date: "asc" }
    })

    let totalHours = 0

    const formatted = records.map(a => {
      let hours = 0
      if (a.checkIn && a.checkOut) {
        hours =
          (a.checkOut.getTime() - a.checkIn.getTime()) /
          (1000 * 60 * 60)
        totalHours += hours
      }

      return {
        date: a.date,
        checkIn: a.checkIn,
        checkOut: a.checkOut,
        workHours: Number(hours.toFixed(2)),
        status: a.status
      }
    })

    return Response.json({
      summary: {
        totalWorkingHours: Number(totalHours.toFixed(2))
      },
      records: formatted
    })
  } catch (error) {
    console.error("Get attendance error:", error)

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
