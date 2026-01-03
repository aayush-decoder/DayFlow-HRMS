"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Clock, Calendar, CheckCircle2, LogOut,
  TrendingUp, Wallet, Star, ArrowRight, User
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts"

export function EmployeeHome() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [attendance, setAttendance] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [elapsedTime, setElapsedTime] = useState("00:00:00")

  // Timer effect - updates every second when checked in
  useEffect(() => {
    if (!attendance) return
    
    const isCurrentlyCheckedIn = attendance.checkIn && !attendance.checkOut
    
    if (isCurrentlyCheckedIn) {
      // Update immediately
      const updateTimer = () => {
        const checkInTime = new Date(attendance.checkIn).getTime()
        const now = Date.now()
        const diff = now - checkInTime
        
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )
      }
      
      updateTimer() // Call immediately
      const timer = setInterval(updateTimer, 1000)
      
      return () => clearInterval(timer)
    } else {
      setElapsedTime("00:00:00")
    }
  }, [attendance])

  // Fetch Logic
  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, attRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/attendance/me")
        ])

        if (profileRes.ok) setProfile(await profileRes.json())
        if (attRes.ok) {
          const attData = await attRes.json()
          // attData.records is history, find today's record
          const todayStr = new Date().toISOString().split('T')[0]
          const todayRecord = attData.records?.find((r: any) => r.date.startsWith(todayStr))

          setAttendance(todayRecord || null)
          setRecords(attData.records?.slice(0, 7) || []) // Last 7 days for chart
        }
      } catch (error) {
        console.error("Dashboard Error", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAttendance = async (type: "check-in" | "check-out") => {
    try {
      await fetch(`/api/attendance/${type}`, { method: "POST" })
      window.location.reload()
    } catch (e) {
      console.error(e)
    }
  }

  // Derived Data
  const isCheckedIn = attendance?.checkIn && !attendance?.checkOut
  const isCheckedOut = attendance?.checkOut

  const TOTAL_LEAVES = 24
  const remainingLeaves = profile?.leaveBalance?.paidLeave || 0
  const takenLeaves = Math.max(0, TOTAL_LEAVES - remainingLeaves)

  const leaveData = [
    { name: 'Remaining', value: remainingLeaves },
    { name: 'Taken', value: takenLeaves }
  ]
  const LEAVE_COLORS = ['#10b981', '#f43f5e']

  // Chart Data format
  const chartData = records.map(r => ({
    day: new Date(r.date).toLocaleDateString(undefined, { weekday: 'short' }),
    hours: r.workHours || 0
  })).reverse()

  if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground animate-pulse">Loading Workspace...</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Good Morning, {profile?.name?.split(" ")[0] || "Team"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile?.designation || "Employee"} • {profile?.department || "General"}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="text-xs text-muted-foreground">Make today count!</p>
        </div>
      </div>

      <BentoGrid>

        {/* TILE 1: Smart Attendance (Large) */}
        <BentoGridItem colSpan={2} rowSpan={2} className="relative">
          <GlassCard gradient className="h-full p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="mb-2 bg-white/20 backdrop-blur">
                  {isCheckedIn ? "Checked In" : isCheckedOut ? "Shift Ended" : "Not Started"}
                </Badge>
                <h2 className="text-2xl font-bold">Time Tracker</h2>
              </div>
              <div className="p-3 bg-white/10 rounded-full animate-pulse">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="py-8 text-center">
              {isCheckedIn ? (
                <>
                  <div className="text-5xl font-mono font-bold tracking-tighter text-green-500">
                    {elapsedTime}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Working since {new Date(attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl font-mono font-bold tracking-tighter">
                    {attendance?.checkIn
                      ? new Date(attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : "--:--"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isCheckedOut ? "Day completed" : "Ready to start?"}
                  </p>
                </>
              )}
            </div>

            <div className="grid gap-3">
              {!isCheckedIn && !isCheckedOut && (
                <Button size="lg" className="w-full text-lg h-12 shadow-lg hover:shadow-primary/25 transition-all" onClick={() => handleAttendance("check-in")}>
                  <TrendingUp className="mr-2 h-5 w-5" /> Check In Now
                </Button>
              )}
              {isCheckedIn && (
                <Button size="lg" variant="destructive" className="w-full text-lg h-12 shadow-lg" onClick={() => handleAttendance("check-out")}>
                  <LogOut className="mr-2 h-5 w-5" /> Clock Out
                </Button>
              )}
              {isCheckedOut && (
                <Button variant="outline" className="w-full opacity-50 cursor-not-allowed">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Day Complete
                </Button>
              )}
            </div>
          </GlassCard>
        </BentoGridItem>

        {/* TILE 2: Leave Balance (Medium) */}
        <BentoGridItem colSpan={1} className="min-h-[200px]">
          <GlassCard className="h-full p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-sm">Leave Balance</span>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold">{profile?.leaveBalance?.paidLeave || 0}</span>
                <span className="text-[10px] uppercase text-muted-foreground">Days Left</span>
              </div>
              <div className="w-full h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveData}
                      innerRadius={35}
                      outerRadius={45}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {leaveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={LEAVE_COLORS[index]} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full text-xs mt-2" onClick={() => router.push('/dashboard/timeoff')}>
              Request Leave <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </GlassCard>
        </BentoGridItem>

        {/* TILE 3: Payroll Preview (Medium) */}
        <BentoGridItem colSpan={1}>
          <GlassCard className="h-full p-4 flex flex-col justify-between bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-sm">Next Payout</span>
            </div>
            <div className="py-4">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {profile?.salary?.monthlyWage ? `$${profile.salary.monthlyWage.toLocaleString()}` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Est. for this month</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-[10px] w-auto justify-center bg-indigo-100/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                <Star className="w-3 h-3 mr-1" /> Bonus Eligible
              </Badge>
            </div>
          </GlassCard>
        </BentoGridItem>

        {/* TILE 4: Weekly Activity Chart (Wide) */}
        <BentoGridItem colSpan={2}>
          <GlassCard className="h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm">Weekly Activity</span>
              </div>
              <span className="text-xs text-muted-foreground">Last 7 Days</span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ r: 3, fill: 'var(--background)', strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </BentoGridItem>

        {/* TILE 5: Quick Profile Action */}
        <BentoGridItem colSpan={2}>
          <GlassCard className="h-full p-4 flex items-center gap-4 cursor-pointer hover:bg-white/60 dark:hover:bg-white/5 transition" onClick={() => router.push('/profile')}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-background overflow-hidden relative">
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-2 text-muted-foreground" />
                )}
              </div>
            </div>
            <div>
              <h3 className="font-bold">Complete your Profile</h3>
              <p className="text-xs text-muted-foreground">Update documents & personal info</p>
            </div>
            <ArrowRight className="ml-auto w-5 h-5 text-muted-foreground" />
          </GlassCard>
        </BentoGridItem>

      </BentoGrid>
    </motion.div>
  )
}
