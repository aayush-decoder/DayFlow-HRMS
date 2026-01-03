import { prisma } from "@/lib/prisma"
import { getAuth } from "@/lib/auth"
import { getTodayDate } from "@/lib/date"

export async function POST(req: Request) {
  try {
    const auth = getAuth(req)
    if (auth.role !== "EMPLOYEE") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!auth.employeeId) {
      return Response.json({ error: "Employee ID not found" }, { status: 400 })
    }

    const today = getTodayDate()

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: auth.employeeId,
          date: today
        }
      }
    })

    if (!attendance) {
      return Response.json(
        { error: "No check-in found for today" },
        { status: 400 }
      )
    }

    if (attendance.checkOut) {
      return Response.json(
        { error: "Already checked out" },
        { status: 400 }
      )
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: new Date() }
    })

    const workMs =
      updated.checkOut!.getTime() - updated.checkIn!.getTime()

    const workHours = Math.max(workMs / (1000 * 60 * 60), 0)

    return Response.json({
      checkOut: updated.checkOut,
      workHours: Number(workHours.toFixed(2))
    })
  } catch (error) {
    console.error("Check-out error:", error)
    
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
