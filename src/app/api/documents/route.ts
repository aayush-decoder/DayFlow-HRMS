import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, requireRole } from "@/lib/roleGuard";
import { prisma } from "@/lib/prisma";

// POST /api/documents - Create a document record
export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, url, type, employeeId } = body;

        if (!name || !url || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Determine target employee ID
        // If not provided, assume self
        let targetId = employeeId;

        if (!targetId) {
            // Find self employeeId
            const self = await prisma.employee.findUnique({ where: { userId: user.id } });
            if (!self) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
            targetId = self.id;
        } else {
            // If targetId is provided, check if user is allowed to add doc for others (Admin)
            // OR if it's actually their own ID
            const self = await prisma.employee.findUnique({ where: { userId: user.id } });
            if (self?.id !== targetId) {
                if (user.role !== "ADMIN") {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
            }
        }

        const doc = await prisma.document.create({
            data: {
                employeeId: targetId,
                name,
                url,
                type,
            },
        });

        return NextResponse.json(doc);

    } catch (error) {
        console.error("Document creation error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
