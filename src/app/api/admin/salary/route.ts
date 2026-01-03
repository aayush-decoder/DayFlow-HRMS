import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/roleGuard";

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const employees = await prisma.employee.findMany({
            select: {
                id: true,
                name: true,
                designation: true,
                department: true,
                salary: true
            }
        });

        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ error: "Fetch error" }, { status: 500 });
    }
}
