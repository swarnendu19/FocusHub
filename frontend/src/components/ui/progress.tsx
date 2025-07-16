import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    animated?: boolean
    color?: 'primary' | 'secondary' | 'accent' | 'xp' | 'streak'
    showLabel?: boolean
    duration?: number
    onComplete?: () => void
    size?: 'sm' | 'md' | 'lg'
}

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressBarProps
>(({
    className,
    value = 0,
    animated = true,
    color = 'primary',
    showLabel = false,
    duration = 800,
    onComplete,
    size = 'md',
    ...props
}, ref) => {
    const [displayValue, setDisplayValue] = React.useState(0)

    React.useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => {
                setDisplayValue(value)
                if (value === 100 && onComplete) {
                    setTimeout(onComplete, duration)
                }
            }, 100)
            return () => clearTimeout(timer)
        } else {
            setDisplayValue(value)
        }
    }, [value, animated, duration, onComplete])

    const sizeClasses = {
        sm: 'h-2',
        md: 'h-4',
        lg: 'h-6'
    }

    const colorClasses = {
        primary: 'bg-gradient-to-r from-primary to-primary-light',
        secondary: 'bg-gradient-to-r from-secondary to-secondary-light',
        accent: 'bg-gradient-to-r from-accent to-warning',
        xp: 'bg-gradient-to-r from-xp to-warning',
        streak: 'bg-gradient-to-r from-streak to-accent'
    }

    return (
        <div className="relative w-full">
            <ProgressPrimitive.Root
                ref={ref}
                className={cn(
                    "relative w-full overflow-hidden rounded-full bg-gray-200 shadow-inner",
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                <motion.div
                    className={cn(
                        "h-full rounded-full shadow-sm",
                        colorClasses[color]
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${displayValue}%` }}
                    transition={{
                        duration: animated ? duration / 1000 : 0,
                        ease: "easeOut"
                    }}
                />
                {animated && displayValue > 0 && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-white/20"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ width: '30%' }}
                    />
                )}
            </ProgressPrimitive.Root>
            {showLabel && (
                <motion.div
                    className="absolute right-0 top-0 -translate-y-6 text-xs font-medium text-gray-600"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {Math.round(displayValue)}%
                </motion.div>
            )}
        </div>
    )
})
Progress.displayName = "ProgressBar"

export { Progress as ProgressBar }