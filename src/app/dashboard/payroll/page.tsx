"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Download, DollarSign, TrendingUp, CreditCard, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

export default function PayrollPage() {
    const [salary, setSalary] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSalary() {
            try {
                const res = await fetch("/api/profile", { credentials: "include" })
                if (res.ok) {
                    const data = await res.json()
                    setSalary(data.salary || null)
                }
            } catch (error) {
                console.error("Failed to fetch salary", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSalary()
    }, [])

    // Hardcoded test data
    const testSalary = {
        monthlyWage: 50000,
        yearlyWage: 600000,
        basicPercent: 40,
        hraPercent: 20,
        performanceBonusPercent: 10,
        fixedAllowance: 5000,
        pfEmployeePercent: 12,
        pfEmployerPercent: 12,
        professionalTax: 2500
    }

    if (loading) return <div className="p-8 text-center animate-pulse">Loading Payroll Data...</div>

    // Use fetched salary or fallback to test data
    const activeSalary = salary || testSalary

    // Calculations
    const earnings = [
        { label: "Basic Salary", amount: activeSalary.monthlyWage * (activeSalary.basicPercent / 100) },
        { label: "HRA", amount: activeSalary.monthlyWage * (activeSalary.hraPercent / 100) },
        { label: "Fixed Allowance", amount: activeSalary.fixedAllowance },
        { label: "Performance Bonus", amount: activeSalary.monthlyWage * (activeSalary.performanceBonusPercent / 100) },
    ]

    const deductions = [
        { label: "Provident Fund (Employee)", amount: activeSalary.monthlyWage * (activeSalary.pfEmployeePercent / 100) },
        { label: "Professional Tax", amount: activeSalary.professionalTax },
    ]

    const totalEarnings = earnings.reduce((acc, curr) => acc + curr.amount, 0)
    const totalDeductions = deductions.reduce((acc, curr) => acc + curr.amount, 0)
    const netPay = totalEarnings - totalDeductions

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Payroll</h1>
                    <p className="text-muted-foreground">Manage your salary and payslips</p>
                </div>
                <Button onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" /> Download Slip
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Net Pay Card */}
                <GlassCard gradient className="md:col-span-2 p-6 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10">
                        <DollarSign className="w-64 h-64 -mr-10 -mt-10" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-white/80">Estimated Net Pay (Monthly)</p>
                        <h2 className="text-5xl font-bold text-white mt-2">${(netPay || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                        <div className="flex gap-2 mt-4">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                                <TrendingUp className="w-3 h-3 mr-1" /> On Track
                            </Badge>
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                                <Building className="w-3 h-3 mr-1" /> Direct Deposit
                            </Badge>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Annual CTC</h3>
                    <div className="text-3xl font-bold">${(activeSalary.yearlyWage || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-2">Includes all bonuses and benefits</p>
                </GlassCard>
            </div>

            {/* Salary Structure Breakup */}
            <GlassCard className="p-0 overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/20">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Salary Structure Breakdown
                    </h3>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-border/50">
                    {/* Earnings */}
                    <div className="p-6 space-y-4">
                        <h4 className="text-sm font-medium text-emerald-500 uppercase tracking-wider">Earnings</h4>
                        <div className="space-y-3">
                            {earnings.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <span className="font-mono font-medium">${(item.amount || 0).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-border/50 flex justify-between font-bold">
                                <span>Gross Earnings</span>
                                <span>${(totalEarnings || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="p-6 space-y-4">
                        <h4 className="text-sm font-medium text-red-500 uppercase tracking-wider">Deductions</h4>
                        <div className="space-y-3">
                            {deductions.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <span className="font-mono font-medium text-red-500">-${(item.amount || 0).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-border/50 flex justify-between font-bold">
                                <span>Total Deductions</span>
                                <span className="text-red-500">-${(totalDeductions || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-muted/30 border-t border-border/50 text-center text-xs text-muted-foreground">
                    * This is an estimated breakdown based on your salary structure. Actual tax may vary.
                </div>
            </GlassCard>
        </div>
    )
}
