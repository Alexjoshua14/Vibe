"use client"

import { FC, useEffect, useState } from "react"
import { HTMLMotionProps, motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface scrollingTextProps extends HTMLMotionProps<"p"> {
  text: string
  containerRef: React.RefObject<HTMLDivElement>
}

/**
 * Displays text in confined to it's container
 * and scrolls it if it overflows
 *
 * @param text string to be displayed
 * @param containerRef reference to the container element
 */
const ScrollingText: FC<scrollingTextProps> = ({
  text,
  containerRef,
  className,
  ...props
}) => {
  const [translation, setTranslation] = useState<number>(0)
  const [duration, setDuration] = useState<number>(1)

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = containerRef.current?.offsetWidth
      const textWidth = containerRef.current?.scrollWidth
      if (containerWidth && textWidth) {
        const overflow = textWidth > containerWidth

        if (overflow) {
          let distance = textWidth - containerWidth + 20
          if (distance < 0) {
            distance *= -1
          } //Ensure distance is always positive
          let duration = distance * 0.03
          if (duration < 1.5) duration = 1.5

          setDuration(duration)
          setTranslation(-distance)
        } else {
          setTranslation(0)
        }
      }
    }
    handleResize()
    // window.addEventListener('resize', handleResize);
  }, [text, containerRef])

  return (
    <motion.p
      whileInView={{ x: [0, translation, 0] }}
      viewport={{ once: true }}
      transition={{
        ease: "linear",
        delay: 2,
        duration: duration,
        times: [0, 0.7, 1],
        repeat: Infinity,
        repeatDelay: 4,
      }}
      className={cn("max-w-full whitespace-nowrap", className)}
      {...props}
    >
      {text}
    </motion.p>
  )
}

export default ScrollingText
