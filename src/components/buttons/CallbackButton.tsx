import { FC, HTMLAttributes } from "react"

import { cn } from "@/lib/utils"


interface CallbackButtonProps extends Partial<HTMLAttributes<HTMLButtonElement>> {
  callback: () => void
  text: string
}

export const CallbackButton: FC<CallbackButtonProps> = ({
  callback,
  text,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        `px-4 py-2 bg-teal-900 text-slate-50 text-lg rounded`,
        className,
      )}
      onClick={() => callback()}
      {...props}
    >
      {text}
    </button>
  )
}