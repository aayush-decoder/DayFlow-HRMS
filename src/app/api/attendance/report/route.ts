import { prisma } from "@/lib/prisma"
import { mailer } from "@/lib/mailer"
import { generateAttendancePDF } from "@/lib/pdf/attendance-report"

export async function POST(req: Request) {
  const body = await req.json()
  const { employeeId, email } = body

  if (!employeeId || !email) {
    return Response.json(
      { error: "employeeId and email required" },
      { status: 400 }
    )
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  })

  if (!employee) {
    return Response.json({ error: "Employee not found" }, { status: 404 })
  }

  const attendance = await prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: "asc" },
  })

  const pdfBuffer = await generateAttendancePDF(employee, attendance)

  await mailer.sendMail({
    from: `"HRMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Attendance Report",
    text: "Attached is your attendance report.",
    attachments: [
      {
        filename: "attendance-report.pdf",
        content: pdfBuffer,
      },
    ],
  })

  return Response.json({ success: true })
}
