import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    gradient?: boolean
}

export function GlassCard({ className, children, gradient = false, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/20 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-black/40",
                "shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.2)]",
                gradient && "bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-transparent",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
