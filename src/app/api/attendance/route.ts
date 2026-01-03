import { prisma } from "@/lib/prisma"
import { getAuth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const auth = getAuth(req)
    if (auth.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get("date")

    if (!dateParam) {
      return Response.json(
        { error: "date is required" },
        { status: 400 }
      )
    }

    const date = new Date(dateParam)

    const records = await prisma.attendance.findMany({
      where: {
        date,
        employee: { companyId: auth.companyId }
      },
      include: {
        employee: { select: { name: true } }
      }
    })

    return Response.json(
      records.map(a => {
        let hours = 0
        if (a.checkIn && a.checkOut) {
          hours =
            (a.checkOut.getTime() - a.checkIn.getTime()) /
            (1000 * 60 * 60)
        }

        return {
          employeeName: a.employee.name,
          checkIn: a.checkIn,
          checkOut: a.checkOut,
          workHours: Number(hours.toFixed(2)),
          status: a.status,
          statusReason: a.statusReason
        }
      })
    )
  } catch (error) {
    console.error("Get all attendance error:", error)
    
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
