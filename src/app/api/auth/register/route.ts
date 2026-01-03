import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RegisterPayload {
  email: string;
  password: string;
  role?: Role;
  companyId: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterPayload = await req.json();
    const { email, password, role = Role.EMPLOYEE, companyId } = body;

    // 1️⃣ validate input
    if (!email || !password || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2️⃣ check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 3️⃣ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        companyId,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
