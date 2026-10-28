import { LogoMark } from './Logo'

export function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-midnight px-6 text-center">
      <LogoMark className="h-10 w-10" />
      <p className="eyebrow text-champagne/70">404</p>
      <h1 className="display text-5xl text-ivory">
        This threshold <em className="text-champagne">leads nowhere.</em>
      </h1>
      <a href="/" className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-champagne underline-offset-4 hover:underline">
        Return to Bridge Web
      </a>
    </main>
  )
}
