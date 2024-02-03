import { FC, HTMLAttributes } from "react"
import Link, { LinkProps } from "next/link"

interface NavigationButtonProps extends Partial<LinkProps & HTMLAttributes<HTMLAnchorElement>> { }

/**
 * Next.js page navigation buttons
 *
 */
export const HomeButton: FC<NavigationButtonProps> = ({ href, ...props }) => {
  return <Link href="/" {...props}>Home</Link>
}

export const FeedButton: FC<NavigationButtonProps> = ({ href, ...props }) => {
  return <Link href="/feed" {...props}>Feed</Link>
}

export const PlayerButton: FC<NavigationButtonProps> = ({ href, ...props }) => {
  return <Link href="/player" className={props.className} {...props}>Player</Link>
}

export const ProfileButton: FC<NavigationButtonProps> = ({ href, ...props }) => {
  return <Link href="/profile" {...props}>Profile</Link>
}