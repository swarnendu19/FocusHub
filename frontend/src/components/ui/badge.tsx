import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-white hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-white hover:bg-secondary/80",
                destructive: "border-transparent bg-danger text-white hover:bg-danger/80",
                outline: "text-foreground",
                xp: "border-transparent bg-xp text-black hover:bg-xp/80 animate-glow",
                achievement: "border-transparent bg-achievement text-white hover:bg-achievement/80",
                streak: "border-transparent bg-streak text-white hover:bg-streak/80 animate-pulse",
                common: "border-transparent bg-gray-500 text-white",
                rare: "border-transparent bg-blue-500 text-white",
                epic: "border-transparent bg-purple-500 text-white animate-glow",
                legendary: "border-transparent bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-glow",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }