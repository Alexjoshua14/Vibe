"use client"

import { FC, MutableRefObject, useState } from "react"
import { motion } from "framer-motion"

interface CarouselIndicatorProps {
  // items should be any mapable object
  items: any[]
  keybase?: string
  indexInFocus: MutableRefObject<number>
  setIndexInFocus: (index: number) => void
}

// TODO: Doesn't reflect when the carousel is manually scrolled.. Migrate to using motion useScroll hook
const CarouselIndicator: FC<CarouselIndicatorProps> = ({
  items,
  keybase,
  indexInFocus,
  setIndexInFocus,
}) => {
  const [optimisticIndex, setOptimisticIndex] = useState(indexInFocus.current)

  const goTo = (index: number) => {
    if (index === indexInFocus.current) return

    if (index >= 0 && index < items.length) {
      setOptimisticIndex(index)
      setIndexInFocus(index)
      if (indexInFocus.current !== index)
        setOptimisticIndex(indexInFocus.current)
    } else console.warn(`Index ${index} is out of range`)
  }

  return (
    <div className="h-4 py-2 flex items-center justify-center gap-[10px]">
      {items.map((_, index) => (
        <motion.button
          key={`${keybase}-${index}`}
          onClick={() => goTo(index)}
          className={`bg-teal-700 glassmorphism rounded-full h-4`}
          initial={{ width: 16 }}
          animate={{ width: optimisticIndex === index ? 32 : 16 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

export default CarouselIndicator
