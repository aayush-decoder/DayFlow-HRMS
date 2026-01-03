import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD
=======
import { getUserFromRequest } from "@/lib/roleGuard";
>>>>>>> 200691e8a41196ab4225f69c3d9aab78e237a9b1
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

<<<<<<< HEAD
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
=======
// GET - Fetch leave balance for current user
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
>>>>>>> 200691e8a41196ab4225f69c3d9aab78e237a9b1
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: user.id },
      include: {
        leaveBalance: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // If no leave balance exists, create default one
    if (!employee.leaveBalance) {
      const currentYear = new Date().getFullYear();
      const leaveBalance = await prisma.leaveBalance.create({
        data: {
          employeeId: employee.id,
          paidLeave: 24, // Default 24 days
          sickLeave: 7,  // Default 7 days
          year: currentYear,
        },
      });

      return NextResponse.json({ leaveBalance }, { status: 200 });
    }

    return NextResponse.json({ leaveBalance: employee.leaveBalance }, { status: 200 });
  } catch (error) {
    console.error("Get leave balance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}