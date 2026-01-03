import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/roleGuard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const employee = await prisma.employee.findUnique({
            where: { userId: user.id },
            include: {
                salary: true,
                leaveBalance: true,
                documents: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        timezone: true,
                    },
                },
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Employee profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: employee.id,
            name: employee.name,
            department: employee.department,
            designation: employee.designation,
            phone: employee.phone,
            address: employee.address,
            profilePicture: employee.profilePicture,
            joinDate: employee.joinDate,
            email: employee.user.email,
            role: employee.user.role,
            company: employee.company,
            documents: employee.documents,
            salary: employee.salary ? {
                monthlyWage: employee.salary.monthlyWage,
                yearlyWage: employee.salary.yearlyWage,
                basicPercent: employee.salary.basicPercent,
                hraPercent: employee.salary.hraPercent,
                performanceBonusPercent: employee.salary.performanceBonusPercent,
                standardAllowance: employee.salary.standardAllowance,
                fixedAllowance: employee.salary.fixedAllowance,
            } : null,
            leaveBalance: employee.leaveBalance ? {
                paidLeave: employee.leaveBalance.paidLeave,
                sickLeave: employee.leaveBalance.sickLeave,
                year: employee.leaveBalance.year,
            } : null,
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get current employee record to check permissions/existence
        const employee = await prisma.employee.findUnique({
            where: { userId: user.id },
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Employee profile not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const { phone, address, profilePicture, department, designation } = body;

        const isAdmin = user.role === "ADMIN";
        let targetEmployeeId = employee.id;

        // Admin Update Logic
        if (isAdmin) {
            // In a real app, Admin might pass 'employeeId' to update OTHERS.
            // For this phase, we assume Admin edits their own profile keys OR we can check body.employeeId if we implemented that.
            // Keeping it simple as per plan: Admin enables editing Dept/Designation on THIS profile endpoint.

            const updateData: any = {};
            if (phone !== undefined) updateData.phone = phone;
            if (address !== undefined) updateData.address = address;
            if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
            if (department !== undefined) updateData.department = department;
            if (designation !== undefined) updateData.designation = designation;

            const updated = await prisma.employee.update({
                where: { id: targetEmployeeId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    address: true,
                    profilePicture: true,
                    department: true,
                    designation: true,
                }
            });
            return NextResponse.json({ message: "Profile updated successfully", employee: updated });
        }

        // Employee Update Logic (Restricted)
        const updated = await prisma.employee.update({
            where: { id: employee.id },
            data: {
                phone: phone !== undefined ? phone : employee.phone,
                address: address !== undefined ? address : employee.address,
                profilePicture: profilePicture !== undefined ? profilePicture : employee.profilePicture,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                address: true,
                profilePicture: true
            },
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            employee: updated,
        });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
