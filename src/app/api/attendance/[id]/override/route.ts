import { prisma } from "@/lib/prisma"
import { getAuth } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuth(req)
    console.log('Auth object:', auth)

    if (auth.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    console.log('Request body:', body)

    const { status, reason } = body

    if (!status || !reason) {
      return Response.json(
        { error: "status and reason required" },
        { status: 400 }
      )
    }

    const { id } = await params
    const before = await prisma.attendance.findUnique({
      where: { id }
    })

    if (!before) {
      return Response.json(
        { error: "Attendance not found" },
        { status: 404 }
      )
    }

    console.log('About to update attendance with:', { status, reason })

    const updated = await prisma.attendance.update({
      where: { id },
      data: {
        status,
        statusReason: reason
      }
    })

    return Response.json({ status: "UPDATED", updated })
  } catch (error) {
    console.error("Override attendance error:", error)

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
