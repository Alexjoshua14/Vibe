import { FC, HTMLAttributes } from 'react'
import { IconType } from 'react-icons'

import { cn } from '@/lib/utils'

interface SongCardButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text?: string
  icon?: {
    icon: IconType
    size: number
  }
  callback: () => void
}

const SongCardButton: FC<SongCardButtonProps> = ({
  text,
  icon,
  className,
  callback,
}) => {
  if (text)
    return (
      <button
        className={cn(
          "p-2 rounded-full glassmorphism-tertiary-interactive hover:scale-110 transition-all",
          className,
        )}
        onClick={callback}
      >
        <p>{text}</p>
      </button>
    )
  else if (icon)
    return (
      <button
        className={cn(
          "p-2 rounded-full glassmorphism-tertiary-interactive hover:scale-110 transition-all",
          className,
        )}
        onClick={callback}
      >
        <icon.icon size={icon.size} />
      </button>
    )
}

export default SongCardButton