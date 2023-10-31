export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <div className="h-20">HEADER BAR</div>
      <div className="min-h-full">{children}</div>
    </div>
  )
}
