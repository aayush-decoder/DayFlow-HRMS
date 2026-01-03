import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/roleGuard";

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalEmployees, presentToday, pendingLeaves, approvedLeaves] = await prisma.$transaction([
            prisma.employee.count(),
            prisma.attendance.count({
                where: {
                    date: { gte: today },
                    status: "PRESENT"
                }
            }),
            prisma.leave.count({
                where: { status: "PENDING" }
            }),
            prisma.leave.count({
                where: {
                    status: "APPROVED",
                    fromDate: { lte: today },
                    toDate: { gte: today }
                }
            })
        ]);

        return NextResponse.json({
            totalEmployees,
            presentToday,
            pendingLeaves,
            onLeave: approvedLeaves
        });

    } catch (error) {
        return NextResponse.json({ error: "Stats error" }, { status: 500 });
    }
}
