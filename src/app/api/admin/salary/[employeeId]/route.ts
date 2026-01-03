import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/roleGuard";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ employeeId: string }> }
) {
    // Await params for Next.js 16
    const { employeeId } = await params;

    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            monthlyWage,
            basicPercent,
            hraPercent,
            performanceBonusPercent,
            pfEmployeePercent,
            professionalTax,
            fixedAllowance
        } = body;

        // Validate totals or logic here if necessary

        const salary = await prisma.salary.upsert({
            where: { employeeId: employeeId },
            update: {
                monthlyWage,
                yearlyWage: monthlyWage * 12,
                basicPercent,
                hraPercent,
                performanceBonusPercent,
                pfEmployeePercent,
                professionalTax,
                fixedAllowance
            },
            create: {
                employeeId,
                monthlyWage,
                yearlyWage: monthlyWage * 12,
                basicPercent,
                hraPercent,
                performanceBonusPercent,
                pfEmployeePercent,
                pfEmployerPercent: 12, // Default
                professionalTax,
                fixedAllowance,
                standardAllowance: 0 // Default
            }
        });

        return NextResponse.json(salary);
    } catch (error) {
        console.error("Salary update failed", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
