"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface UserData {
    id: string;
    email: string;
    role: string;
    company?: {
        id: string;
        name: string;
        timezone: string;
    };
    employee?: {
        id: string;
        name: string;
        department: string;
        designation: string;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                router.push("/login");
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">DayFlow HRMS</h1>
                        <p className="text-sm text-muted-foreground">Every workday, perfectly aligned.</p>
                    </div>
                    <Button onClick={handleLogout} variant="destructive">
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome back, {user?.email}!</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                            <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"}>
                                {user?.role}
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Quick Access Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Profile Card */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => router.push("/profile")}
                    >
                        <CardHeader>
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            <CardTitle>My Profile</CardTitle>
                            <CardDescription>View and edit your profile information</CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Attendance Card */}
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <CardTitle>Attendance</CardTitle>
                            <CardDescription>Track your daily check-ins and check-outs</CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Leave Card */}
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <CardTitle>Leave Requests</CardTitle>
                            <CardDescription>Apply for leave and check your balance</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* Employee Info Section */}
                {user?.employee && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Employee Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{user.employee.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Department</p>
                                    <p className="font-medium">{user.employee.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Designation</p>
                                    <p className="font-medium">{user.employee.designation}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Admin Only Section */}
                {user?.role === "ADMIN" && (
                    <Card className="border-primary/50 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-primary">Admin Functions</CardTitle>
                            <CardDescription>
                                You have administrative access to manage employees, approve leave requests, and view reports.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <Button>Manage Employees</Button>
                                <Button variant="outline">Approve Leaves</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
