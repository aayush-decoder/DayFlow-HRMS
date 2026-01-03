// app/api/leaves/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/roleGuard";
import { prisma } from "@/lib/prisma";
import { LeaveType, LeaveDuration, LeaveStatus } from "@prisma/client";

// GET - Fetch leave requests
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let leaves;

    // If ADMIN, fetch all leaves for the company
    if (user.role === "ADMIN") {
      leaves = await prisma.leave.findMany({
        where: {
          employee: {
            companyId: user.companyId,
          },
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              department: true,
              designation: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // If EMPLOYEE, fetch only their leaves
      const employee = await prisma.employee.findUnique({
        where: { userId: user.userId },
      });

      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }

      leaves = await prisma.leave.findMany({
        where: {
          employeeId: employee.id,
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              department: true,
              designation: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json({ leaves }, { status: 200 });
  } catch (error) {
    console.error("Get leaves error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create leave request
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, duration, fromDate, toDate, reason } = body;

    // Validate input
    if (!type || !duration || !fromDate || !toDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get employee
    const employee = await prisma.employee.findUnique({
      where: { userId: user.userId },
      include: { leaveBalance: true },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Calculate days count
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    let daysCount = 0;
    if (duration === "HALF_DAY") {
      daysCount = 0.5;
    } else {
      // Calculate full days excluding weekends
      let currentDate = new Date(from);
      while (currentDate <= to) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
          daysCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Check leave balance
    if (employee.leaveBalance) {
      const balance = employee.leaveBalance;
      if (type === "PAID" && balance.paidLeave < daysCount) {
        return NextResponse.json(
          { error: `Insufficient paid leave balance. Available: ${balance.paidLeave} days` },
          { status: 400 }
        );
      }
      if (type === "SICK" && balance.sickLeave < daysCount) {
        return NextResponse.json(
          { error: `Insufficient sick leave balance. Available: ${balance.sickLeave} days` },
          { status: 400 }
        );
      }
    }

    // Create leave request
    const leave = await prisma.leave.create({
      data: {
        employeeId: employee.id,
        type: type as LeaveType,
        duration: duration as LeaveDuration,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        daysCount,
        reason: reason || null,
        status: LeaveStatus.PENDING,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            department: true,
            designation: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Leave request created successfully", leave },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create leave error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}