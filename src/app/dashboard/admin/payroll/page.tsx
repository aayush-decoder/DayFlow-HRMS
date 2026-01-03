"use client"

import { useEffect, useState } from "react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, DollarSign, Save } from "lucide-react"

export default function AdminPayrollPage() {
    const [employees, setEmployees] = useState<any[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<any>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        try {
            const res = await fetch("/api/admin/salary")
            if (res.ok) setEmployees(await res.json())
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (emp: any) => {
        setEditingId(emp.id)
        setFormData({
            monthlyWage: emp.salary?.monthlyWage || 5000,
            basicPercent: emp.salary?.basicPercent || 40,
            hraPercent: emp.salary?.hraPercent || 20,
            performanceBonusPercent: emp.salary?.performanceBonusPercent || 10,
            pfEmployeePercent: emp.salary?.pfEmployeePercent || 12,
            professionalTax: emp.salary?.professionalTax || 200,
            fixedAllowance: emp.salary?.fixedAllowance || 1000
        })
    }

    const handleSave = async (employeeId: string) => {
        try {
            const res = await fetch(`/api/admin/salary/${employeeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setEditingId(null)
                fetchEmployees() // Refresh
            }
        } catch (e) {
            alert("Failed to save")
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
                <p className="text-muted-foreground">Manage salary structures and compensation details.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Monthly Wage</TableHead>
                            <TableHead>Yearly CTC</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell colSpan={6} className="text-center h-24">Loading...</TableCell></TableRow>
                            : employees.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">{emp.name}</TableCell>
                                    <TableCell>{emp.designation}</TableCell>
                                    <TableCell>${emp.salary?.monthlyWage?.toLocaleString() || "Not Set"}</TableCell>
                                    <TableCell>${emp.salary?.yearlyWage?.toLocaleString() || "Not Set"}</TableCell>
                                    <TableCell>
                                        {emp.salary ? <Badge variant="outline" className="text-emerald-500 border-emerald-500">Configured</Badge>
                                            : <Badge variant="outline" className="text-orange-500 border-orange-500">Pending</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog open={editingId === emp.id} onOpenChange={(open: boolean) => !open && setEditingId(null)}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(emp)}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Salary: {emp.name}</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="col-span-2">
                                                            <Label>Gross Monthly Wage ($)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.monthlyWage}
                                                                onChange={(e) => setFormData({ ...formData, monthlyWage: parseInt(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Basic (%)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.basicPercent}
                                                                onChange={(e) => setFormData({ ...formData, basicPercent: parseFloat(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>HRA (%)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.hraPercent}
                                                                onChange={(e) => setFormData({ ...formData, hraPercent: parseFloat(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>PF (%)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.pfEmployeePercent}
                                                                onChange={(e) => setFormData({ ...formData, pfEmployeePercent: parseFloat(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Bonus (%)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.performanceBonusPercent}
                                                                onChange={(e) => setFormData({ ...formData, performanceBonusPercent: parseFloat(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Fixed Allow ($)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.fixedAllowance}
                                                                onChange={(e) => setFormData({ ...formData, fixedAllowance: parseInt(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Prof. Tax ($)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.professionalTax}
                                                                onChange={(e) => setFormData({ ...formData, professionalTax: parseInt(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button onClick={() => handleSave(emp.id)} className="w-full mt-4">
                                                        <Save className="w-4 h-4 mr-2" /> Save Structure
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
