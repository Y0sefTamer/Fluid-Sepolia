export function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[42rem] grid-overlay opacity-70" />
      <div className="absolute -left-40 top-10 h-[26rem] w-[26rem] animate-float rounded-full bg-accent/10 blur-[110px]" />
      <div
        className="absolute -right-32 top-40 h-[22rem] w-[22rem] animate-float rounded-full bg-accent/10 blur-[100px]"
        style={{ animationDelay: '-6s' }}
      />
      <div className="absolute left-1/2 top-[30rem] h-[18rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />
    </div>
  )
}
