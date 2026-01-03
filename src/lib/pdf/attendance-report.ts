import PDFDocument from "pdfkit"

export function generateAttendancePDF(
  employee: any,
  attendance: any[]
): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 })
    const buffers: Buffer[] = []

    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => resolve(Buffer.concat(buffers)))

    doc.fontSize(18).text("Attendance Report", { align: "center" })
    doc.moveDown()

    doc.fontSize(12)
    doc.text(`Employee: ${employee.name}`)
    doc.text(`Department: ${employee.department}`)
    doc.text(`Generated on: ${new Date().toDateString()}`)
    doc.moveDown()

    doc.text("Date        Check-In     Check-Out     Status")
    doc.text("----------------------------------------------")

    attendance.forEach(a => {
      doc.text(
        `${a.date.toISOString().slice(0,10)}   ${
          a.checkIn ? a.checkIn.toTimeString().slice(0,5) : "-"
        }   ${
          a.checkOut ? a.checkOut.toTimeString().slice(0,5) : "-"
        }   ${a.status}`
      )
    })

    doc.end()
  })
}
