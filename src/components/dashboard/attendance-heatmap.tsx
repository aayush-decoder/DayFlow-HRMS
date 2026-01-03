"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface HeatmapProps {
    year?: number
}

interface ActivityDay {
    date: string
    hours: number
    level: 0 | 1 | 2 | 3 | 4
}

export function AttendanceHeatmap({ year = new Date().getFullYear() }: HeatmapProps) {
    const [data, setData] = useState<ActivityDay[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchYearlyData() {
            try {
                const res = await fetch(`/api/attendance/me?range=year&year=${year}`)
                if (res.ok) {
                    const json = await res.json()
                    const records = json.records || []

                    // Map records to a date dictionary for O(1) lookup
                    const hoursMap: Record<string, number> = {}
                    records.forEach((r: any) => {
                        const d = new Date(r.date).toISOString().split('T')[0]
                        hoursMap[d] = r.workHours
                    })

                    // Generate full year grid
                    const days = []
                    const startDate = new Date(year, 0, 1) // Jan 1
                    const endDate = new Date(year, 11, 31) // Dec 31

                    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                        const dateStr = d.toISOString().split('T')[0]
                        const hours = hoursMap[dateStr] || 0

                        // Determine intensity level (0-4) like GitHub
                        let level: 0 | 1 | 2 | 3 | 4 = 0
                        if (hours > 0) level = 1
                        if (hours >= 4) level = 2
                        if (hours >= 7) level = 3
                        if (hours >= 9) level = 4

                        days.push({ date: dateStr, hours, level })
                    }
                    setData(days)
                }
            } catch (e) {
                console.error("Heatmap Load Error", e)
            } finally {
                setLoading(false)
            }
        }
        fetchYearlyData()
    }, [year])

    // Helper to split data into weeks
    const weeks: (ActivityDay | null)[][] = []
    let currentWeek: (ActivityDay | null)[] = []

    // Note: GitHub graph starts on Sunday. 
    // We need to pad the first week if Jan 1 isn't Sunday.
    if (data.length > 0 && data[0]) {
        const firstDay = new Date(data[0].date).getDay() // 0 = Sun, 1 = Mon...
        for (let i = 0; i < firstDay; i++) {
            currentWeek.push(null) // Empty slots
        }

        data.forEach(day => {
            currentWeek.push(day)
            if (currentWeek.length === 7) {
                weeks.push(currentWeek)
                currentWeek = []
            }
        })
        if (currentWeek.length > 0) weeks.push(currentWeek) // Last partial week
    }

    // Color mapping similar to GitHub/Greens
    const getLevelColor = (level: number) => {
        switch (level) {
            case 1: return "bg-emerald-200 dark:bg-emerald-900/40"
            case 2: return "bg-emerald-400 dark:bg-emerald-700/60"
            case 3: return "bg-emerald-500 dark:bg-emerald-600"
            case 4: return "bg-emerald-700 dark:bg-emerald-400" // Brightest for dark mode
            default: return "bg-muted/30 dark:bg-muted/10"
        }
    }

    if (loading) return <div className="h-40 animate-pulse bg-muted/20 rounded-xl w-full" />

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex gap-1 min-w-max">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="grid grid-rows-7 gap-1">
                        {week.map((day, dIndex) => (
                            day ? (
                                <TooltipProvider key={day.date}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: wIndex * 0.01 + dIndex * 0.005 }}
                                                className={cn(
                                                    "w-3 h-3 rounded-[2px]",
                                                    getLevelColor(day.level)
                                                )}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="text-xs">
                                            {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {day.hours}h
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <div key={`empty-${wIndex}-${dIndex}`} className="w-3 h-3" />
                            )
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-2 justify-end">
                <span>Less</span>
                <div className="w-2 h-2 bg-muted/30 dark:bg-muted/10 rounded-[1px]" />
                <div className="w-2 h-2 bg-emerald-200 dark:bg-emerald-900/40 rounded-[1px]" />
                <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-700/60 rounded-[1px]" />
                <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-600 rounded-[1px]" />
                <div className="w-2 h-2 bg-emerald-700 dark:bg-emerald-400 rounded-[1px]" />
                <span>More</span>
            </div>
        </div>
    )
}
