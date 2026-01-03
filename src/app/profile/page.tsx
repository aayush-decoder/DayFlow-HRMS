"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Document {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
}

interface EmployeeProfile {
    id: string;
    name: string;
    department: string;
    designation: string;
    phone: string | null;
    address: string | null;
    profilePicture: string | null;
    joinDate: string;
    email: string;
    role: string;
    company: {
        id: string;
        name: string;
        timezone: string;
    };
    salary: {
        monthlyWage: number;
        yearlyWage: number;
        basicPercent: number;
        hraPercent: number;
        performanceBonusPercent: number;
        standardAllowance: number;
        fixedAllowance: number;
    } | null;
    leaveBalance: {
        paidLeave: number;
        sickLeave: number;
        year: number;
    } | null;
    documents: Document[];
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<EmployeeProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        // Admin fields
        department: "",
        designation: "",
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFormData({
                    phone: data.phone || "",
                    address: data.address || "",
                    department: data.department || "",
                    designation: data.designation || "",
                });
            } else if (res.status === 401) {
                router.push("/login");
            } else {
                // Handle 404 or other errors without redirecting
                console.error("Profile not found or other error");
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage("✅ Profile updated successfully");
                setEditMode(false);
                fetchProfile();
            } else {
                setMessage("❌ Failed to update profile");
            }
        } catch (error) {
            setMessage("❌ Network error");
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "doc") => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const form = new FormData();
            form.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: form,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const { url, name } = await uploadRes.json();

            if (type === "avatar") {
                // Update profile picture
                await fetch("/api/profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profilePicture: url }),
                });
                fetchProfile();
            } else {
                // Create document record
                await fetch("/api/documents", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name,
                        url: url,
                        type: file.type.includes("pdf") ? "PDF" : "IMAGE",
                    }),
                });
                fetchProfile();
            }

        } catch (error) {
            console.error("Upload error:", error);
            setMessage("❌ Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <p className="text-destructive mb-4">Profile not found</p>
                    <Button onClick={() => router.push("/dashboard")}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const isAdmin = profile.role === "ADMIN";

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Employee Profile</h1>
                    </div>
                    <Button onClick={() => router.push("/dashboard")} variant="outline">
                        Back to Dashboard
                    </Button>
                </div>
            </header>

            <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Message */}
                {message && (
                    <div
                        className={`mb-4 p-3 rounded-md ${message.startsWith("✅")
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Personal Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Personal Information</CardTitle>
                            {!editMode ? (
                                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} disabled={saving}>
                                        {saving ? "Saving..." : "Save"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                phone: profile.phone || "",
                                                address: profile.address || "",
                                                department: profile.department || "",
                                                designation: profile.designation || "",
                                            });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-6 flex-col md:flex-row">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0 text-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-2 mx-auto relative group text-muted-foreground flex items-center justify-center">
                                    {profile.profilePicture ? (
                                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl text-gray-400">👤</span>
                                    )}
                                    {/* Overlay for upload */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                        <label className="text-white text-xs cursor-pointer p-2">
                                            Change
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, "avatar")}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <p className="font-medium">{profile.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <p className="font-medium">{profile.email}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    {editMode ? (
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91-9876543210"
                                        />
                                    ) : (
                                        <p className="font-medium">{profile.phone || "Not provided"}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Join Date</Label>
                                    <p className="font-medium">
                                        {new Date(profile.joinDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    {editMode ? (
                                        <Textarea
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            placeholder="Enter your address"
                                        />
                                    ) : (
                                        <p className="font-medium">{profile.address || "Not provided"}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Job Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Job Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                {editMode && isAdmin ? (
                                    <Input
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    />
                                ) : (
                                    <p className="font-medium">{profile.department}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Designation</Label>
                                {editMode && isAdmin ? (
                                    <Input
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    />
                                ) : (
                                    <p className="font-medium">{profile.designation}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Badge variant={profile.role === "ADMIN" ? "default" : "secondary"}>
                                    {profile.role}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <p className="font-medium">{profile.company.name}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Documents Section */}
                <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Documents</CardTitle>
                        <label className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                            {uploading ? "Uploading..." : "Upload Document"}
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "doc")}
                                disabled={uploading}
                            />
                        </label>
                    </CardHeader>
                    <CardContent>
                        {profile.documents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No documents uploaded</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-2">
                                {profile.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded">
                                                📄
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{doc.name}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            View
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Salary Information */}
                {profile.salary && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Salary Structure</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Monthly Wage</Label>
                                    <p className="font-medium text-lg">₹{profile.salary.monthlyWage.toLocaleString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Yearly Wage</Label>
                                    <p className="font-medium text-lg">₹{profile.salary.yearlyWage.toLocaleString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Basic Pay</Label>
                                    <p className="font-medium">{profile.salary.basicPercent}%</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>HRA</Label>
                                    <p className="font-medium">{profile.salary.hraPercent}%</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Performance Bonus</Label>
                                    <p className="font-medium">{profile.salary.performanceBonusPercent}%</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Allowances</Label>
                                    <p className="font-medium">₹{(profile.salary.standardAllowance + profile.salary.fixedAllowance).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Leave Balance */}
                {profile.leaveBalance && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Leave Balance ({profile.leaveBalance.year})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                    <CardHeader>
                                        <CardDescription className="text-green-700 dark:text-green-400">Paid Leave</CardDescription>
                                        <CardTitle className="text-green-900 dark:text-green-300 text-2xl">
                                            {profile.leaveBalance.paidLeave} days
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                    <CardHeader>
                                        <CardDescription className="text-blue-700 dark:text-blue-400">Sick Leave</CardDescription>
                                        <CardTitle className="text-blue-900 dark:text-blue-300 text-2xl">
                                            {profile.leaveBalance.sickLeave} days
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
