import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RegisterPayload {
  email: string;
  password: string;
  role?: Role;
  companyId: string;
  name?: string;
  department?: string;
  designation?: string;
  phone?: string;
  address?: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterPayload = await req.json();
    const { 
      email, 
      password, 
      role = Role.EMPLOYEE, 
      companyId,
      name,
      department,
      designation,
      phone,
      address
    } = body;

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

    // 4️⃣ create user and employee profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          companyId,
        },
      });

      // Only create employee profile for EMPLOYEE role
      if (role === Role.EMPLOYEE) {
        // Create employee profile with default values
        const employee = await tx.employee.create({
          data: {
            userId: user.id,
            companyId: companyId,
            name: name || email.split('@')[0], // Use email prefix if name not provided
            department: department || 'General',
            designation: designation || 'Employee',
            phone: phone || null,
            address: address || null,
            joinDate: new Date(),
          },
        });

        // Create default leave balance for the current year
        await tx.leaveBalance.create({
          data: {
            employeeId: employee.id,
            paidLeave: 24, // Default 24 days paid leave
            sickLeave: 7,  // Default 7 days sick leave
            year: new Date().getFullYear(),
          },
        });

        return { user, employee };
      }

      return { user, employee: null };
    });

    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        }
      },
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
