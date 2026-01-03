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
    where: { id: userToken.id },
    select: {
      id: true,
      email: true,
      role: true,
      companyId: true,
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
    role: user.role, // enum value: ADMIN | EMPLOYEE
  });
}
