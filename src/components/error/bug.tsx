import { FC } from "react"
import Link from "next/link"

interface BugProps {}

const Bug: FC<BugProps> = ({}) => {
  return (
    <div className="min-w-[280px] flex flex-col items-center justify-center gap-8 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-light">
          {`You found a Bug in our system 🐞`}
        </h1>
        <h2 className="text-xl">{`Please refresh the page and try again`}</h2>
      </div>
      <div>
        <p>
          {`If problems persist, please report this issue to our GitHub page:`}
        </p>
        <Link
          href="https://github.com/Alexjoshua14/Vibe/issues/new"
          className="text-blue-500 hover:text-blue-700 transition-colors underline underline-offset-2"
        >
          {`Vibe Github Page`}
        </Link>
      </div>
    </div>
  )
}

export default Bug
