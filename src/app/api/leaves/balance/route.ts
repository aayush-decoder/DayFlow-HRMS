// app/api/leaves/balance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/roleGuard";
import { prisma } from "@/lib/prisma";

// GET - Fetch leave balance for current user
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: user.userId },
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