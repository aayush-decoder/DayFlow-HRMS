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

    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: auth.employeeId,
          date: today
        }
      }
    })

    if (existing) {
      return Response.json(
        { error: "Already checked in for today" },
        { status: 400 }
      )
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: auth.employeeId,
        date: today,
        checkIn: new Date(),
        status: "PRESENT"
      }
    })

    return Response.json({
      date: attendance.date,
      checkIn: attendance.checkIn,
      status: attendance.status
    })
  } catch (error) {
    console.error("Check-in error:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
      }
    }
    
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
