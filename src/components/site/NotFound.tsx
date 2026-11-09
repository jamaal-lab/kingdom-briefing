import { LogoMark } from './Logo'
import { BASE } from '~/lib/target'
import { BtbsLogo } from '~/websites/sections/Chrome'

export function NotFound() {
  if (import.meta.env.VITE_SITE_TARGET === 'websites')
    return (
      <main className="btbs flex min-h-svh flex-col items-center justify-center gap-6 bg-navy px-6 text-center">
        <BtbsLogo size={72} withName={false} />
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-champagne">404</p>
        <h1 className="btbs-head text-4xl text-ivory sm:text-5xl">This page doesn’t exist.</h1>
        <a href={BASE} className="text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-champagne underline-offset-4 hover:underline">
          Back to Web Design & Digital Experiences
        </a>
      </main>
    )
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
