import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {prisma} from "@/lib/prisma";
import { JwtPayload } from "@/types/auth";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const user = payload as unknown as JwtPayload;

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json(); // APPROVED | REJECTED

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    const leave = await prisma.leave.findUnique({
      where: { id },
    });

    if (!leave) {
      return NextResponse.json(
        { message: "Leave not found" },
        { status: 404 }
      );
    }

    if (leave.status !== "PENDING") {
      return NextResponse.json(
        { message: "Leave already processed" },
        { status: 400 }
      );
    }

    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedLeave);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const user = payload as unknown as JwtPayload;

    const leave = await prisma.leave.findUnique({
      where: { id },
    });

    if (!leave) {
      return NextResponse.json(
        { message: "Leave not found" },
        { status: 404 }
      );
    }

    if (leave.status !== "PENDING") {
      return NextResponse.json(
        { message: "Only pending leaves can be deleted" },
        { status: 400 }
      );
    }

    // Only owner or admin can delete
    if (user.role !== "ADMIN" && leave.id !== user.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.leave.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Leave deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
