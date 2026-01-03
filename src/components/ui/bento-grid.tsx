import { cn } from "@/lib/utils"

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string
    children?: React.ReactNode
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[minmax(180px,auto)]",
                className
            )}
        >
            {children}
        </div>
    )
}

export const BentoGridItem = ({
    className,
    children,
    colSpan = 1,
    rowSpan = 1,
}: {
    className?: string
    children: React.ReactNode
    colSpan?: number
    rowSpan?: number
}) => {
    // Map span numbers to Tailwind classes safely
    const colSpanClass = {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
        4: "md:col-span-4",
    }[colSpan] || "md:col-span-1"

    const rowSpanClass = {
        1: "row-span-1",
        2: "row-span-2",
    }[rowSpan] || "row-span-1"

    return (
        <div
            className={cn(
                colSpanClass,
                rowSpanClass,
                "group/bento transition duration-200 h-full w-full",
                className
            )}
        >
            {children}
        </div>
    )
}
