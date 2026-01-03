import { getUserFromRequest } from "@/lib/roleGuard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userToken = await getUserFromRequest(req);

  if (!userToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userToken.userId },
    select: {
      id: true,
      email: true,
      role: true,
      companyId: true,
      employee: {
        select: {
          id: true,
          name: true,
          department: true,
          designation: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          timezone: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    employee: user.employee,
    company: user.company,
  });
}
