import * as React from "react"
import { motion } from "framer-motion"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimeoutButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => void
  timeout?: number // in milliseconds
  onTimeoutStart?: () => void
  onTimeoutCancel?: () => void
  onTimeoutComplete?: () => void
  noExpansion?: boolean
}

const TimeoutButton = React.forwardRef<HTMLButtonElement, TimeoutButtonProps>(
  (
    {
      children,
      onClick,
      timeout = 3000,
      onTimeoutStart,
      onTimeoutCancel,
      onTimeoutComplete,
      noExpansion = false,
      className,
      disabled,
      variant = "default",
      size = "default",
      ...props
    },
    ref,
  ) => {
    const [isActive, setIsActive] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const [isRunning, setIsRunning] = React.useState(false)

    React.useEffect(() => {
      if (!isRunning) return

      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min((elapsed / timeout) * 100, 100)

        setProgress(newProgress)

        if (newProgress >= 100) {
          setIsActive(true)
          setIsRunning(false)
          onTimeoutComplete?.()
          clearInterval(interval)
        }
      }, 16) // ~60fps

      return () => clearInterval(interval)
    }, [isRunning, timeout, onTimeoutComplete])

    const handleMouseEnter = () => {
      if (!isRunning && !disabled && !isActive) {
        setIsRunning(true)
        setProgress(0)
        onTimeoutStart?.()
      }
    }

    const handleMouseLeave = () => {
      if (isRunning && !isActive) {
        setIsRunning(false)
        setProgress(0)
        onTimeoutCancel?.()
      }
    }

    const handleClick = () => {
      if (isActive && !disabled) {
        onClick()
        // Reset after click
        setIsActive(false)
        setProgress(0)
        setIsRunning(false)
      }
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        className={cn(
          "relative overflow-hidden transition-all duration-200 cursor-pointer",
          isActive && !noExpansion && "shadow-lg scale-105",
          isActive && noExpansion && "shadow-lg",
          isRunning && "cursor-wait",
          className,
        )}
        {...props}
      >
        {/* Progress overlay */}
        <motion.div
          className="absolute inset-0 bg-white/20 dark:bg-white/10"
          initial={{ x: "-100%" }}
          animate={{ x: isRunning ? `${progress - 100}%` : "-100%" }}
          transition={{ duration: 0, ease: "linear" }}
        />

        {/* Button content */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Button>
    )
  },
)

TimeoutButton.displayName = "TimeoutButton"

export { TimeoutButton, type TimeoutButtonProps }
