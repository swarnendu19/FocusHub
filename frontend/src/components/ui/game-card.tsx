import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { ProgressBar } from "./progress"
import { Badge } from "./badge"

interface GameCardProps {
    title: string
    description?: string
    progress?: number
    xpReward?: number
    isCompleted?: boolean
    isLocked?: boolean
    onClick?: () => void
    hoverAnimation?: boolean
    className?: string
    children?: React.ReactNode
    icon?: React.ReactNode
    color?: 'primary' | 'secondary' | 'accent' | 'xp' | 'streak'
}

const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(({
    title,
    description,
    progress,
    xpReward,
    isCompleted = false,
    isLocked = false,
    onClick,
    hoverAnimation = true,
    className,
    children,
    icon,
    color = 'primary',
    ...props
}, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const cardVariants = {
        initial: {
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            z: 0
        },
        hover: {
            scale: hoverAnimation ? 1.02 : 1,
            rotateX: hoverAnimation ? -2 : 0,
            rotateY: hoverAnimation ? 2 : 0,
            z: hoverAnimation ? 20 : 0,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.98,
            transition: {
                duration: 0.1
            }
        }
    }

    const shadowVariants = {
        initial: {
            opacity: 0.2,
            scale: 1,
            y: 4
        },
        hover: {
            opacity: 0.4,
            scale: 1.05,
            y: 8,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    }

    const getCardStyles = () => {
        if (isLocked) {
            return "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
        }
        if (isCompleted) {
            return "bg-gradient-to-br from-primary/10 to-primary-light/10 border-primary/30 shadow-lg"
        }
        return "bg-white border-gray-200 hover:border-primary/30 shadow-md hover:shadow-lg"
    }

    const colorClasses = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        xp: 'text-xp',
        streak: 'text-streak'
    }

    return (
        <div className="relative perspective-1000" style={{ perspective: '1000px' }}>
            {/* Shadow */}
            <motion.div
                className="absolute inset-0 bg-black/10 rounded-xl blur-sm"
                variants={shadowVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
            />

            {/* Card */}
            <motion.div
                ref={ref}
                className={cn(
                    "relative cursor-pointer transform-gpu",
                    onClick && !isLocked && "cursor-pointer",
                    isLocked && "cursor-not-allowed"
                )}
                variants={cardVariants}
                initial="initial"
                whileHover={!isLocked ? "hover" : "initial"}
                whileTap={!isLocked ? "tap" : "initial"}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={!isLocked ? onClick : undefined}
                {...props}
            >
                <Card className={cn(
                    "transition-all duration-200 border-2 transform-gpu",
                    getCardStyles(),
                    className
                )}>
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                {icon && (
                                    <motion.div
                                        className={cn(
                                            "flex-shrink-0",
                                            colorClasses[color],
                                            isLocked && "text-gray-400"
                                        )}
                                        animate={isHovered && !isLocked ? {
                                            rotate: [0, -5, 5, 0],
                                            scale: [1, 1.1, 1]
                                        } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {icon}
                                    </motion.div>
                                )}
                                <div>
                                    <CardTitle className={cn(
                                        "text-lg font-bold",
                                        isLocked && "text-gray-500"
                                    )}>
                                        {title}
                                    </CardTitle>
                                    {description && (
                                        <CardDescription className={cn(
                                            "mt-1",
                                            isLocked && "text-gray-400"
                                        )}>
                                            {description}
                                        </CardDescription>
                                    )}
                                </div>
                            </div>

                            {/* Status badges */}
                            <div className="flex flex-col gap-1">
                                {isCompleted && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 15
                                        }}
                                    >
                                        <Badge variant="default" className="bg-primary text-white">
                                            ✓ Complete
                                        </Badge>
                                    </motion.div>
                                )}
                                {isLocked && (
                                    <Badge variant="secondary" className="bg-gray-300 text-gray-600">
                                        🔒 Locked
                                    </Badge>
                                )}
                                {xpReward && !isLocked && (
                                    <Badge variant="outline" className="border-xp text-xp">
                                        +{xpReward} XP
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                        {/* Progress bar */}
                        {progress !== undefined && !isLocked && (
                            <div className="mb-4">
                                <ProgressBar
                                    value={progress}
                                    color={color}
                                    animated={true}
                                    showLabel={true}
                                    size="sm"
                                />
                            </div>
                        )}

                        {/* Custom content */}
                        {children}

                        {/* Completion celebration effect */}
                        {isCompleted && (
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 2, delay: 0.5 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse" />
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
})

GameCard.displayName = "GameCard"

export { GameCard }