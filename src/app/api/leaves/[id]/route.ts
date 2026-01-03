import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/roleGuard";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json(); // APPROVED | REJECTED

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const leave = await prisma.leave.findUnique({
      where: { id },
    });

    if (!leave) {
      return NextResponse.json(
        { error: "Leave not found" },
        { status: 404 }
      );
    }

    if (leave.status !== "PENDING") {
      return NextResponse.json(
        { error: "Leave already processed" },
        { status: 400 }
      );
    }

    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: { status },
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

    return NextResponse.json({ 
      message: "Leave status updated successfully", 
      leave: updatedLeave 
    });
  } catch (error) {
    console.error("Update leave error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leave = await prisma.leave.findUnique({
      where: { id },
      include: {
        employee: {
          select: { userId: true }
        }
      }
    });

    if (!leave) {
      return NextResponse.json(
        { error: "Leave not found" },
        { status: 404 }
      );
    }

    if (leave.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending leaves can be deleted" },
        { status: 400 }
      );
    }

    // Only owner or admin can delete
    if (user.role !== "ADMIN" && leave.employee.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.leave.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Leave deleted successfully" });
  } catch (error) {
    console.error("Delete leave error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
