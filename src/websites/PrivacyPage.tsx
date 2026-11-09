import { COMPANY } from './config'
import { BtbsLogo } from './sections/Chrome'
import { WEBSITES_PAGES } from '~/lib/target'

/**
 * Intake privacy notice. DRAFT wording: the owner must confirm retention and
 * the final lead destination before launch (docs/websites/INTAKE.md).
 */
const SECTIONS: [string, string[]][] = [
  ['What we collect', ['The answers you choose to give in the project intake: your name, organization, email address, optional phone number, website address and the details of your project.', 'We never ask for passwords or login details. Please do not include them.']],
  ['Why we collect it', ['To understand your project, reply to you by your preferred contact method and prepare for a discovery conversation. We do not use it for anything else.']],
  ['Where it goes', [`Your submission is sent securely to ${COMPANY.legalName}'s own business systems (email and client-management tools) and is read by our team. It is never sold, rented or shared for anyone else’s marketing.`]],
  ['While you are filling it in', ['Your answers are saved only in this browser tab so you don’t lose them if you reload. They are cleared when you submit, choose “Start over”, or close the tab.']],
  ['Analytics', ['We may measure which steps of the intake are used, so we can improve it. Those measurements never include your name, contact details or written answers.']],
  ['How long we keep it', ['We keep inquiry details for as long as needed to respond and, if we work together, for the life of the engagement and our legal record-keeping obligations. You can ask us to delete them at any time.']],
  ['Your choices', [`Email ${COMPANY.email} to see, correct or delete the information you sent us, or to stop hearing from us.`]],
]

export function PrivacyPage() {
  return (
    <div className="btbs min-h-screen bg-navy text-ivory">
      <header className="border-b border-line">
        <div className="mx-auto flex h-[4.5rem] max-w-3xl items-center px-5 sm:px-8">
          <a href={WEBSITES_PAGES.home} className="-m-2 p-2">
            <BtbsLogo size={40} sub={COMPANY.service} />
          </a>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-mist">Privacy</p>
        <h1 className="btbs-head mt-5 text-[clamp(2.2rem,5vw,3.4rem)] leading-tight">Project intake privacy notice</h1>
        <p className="mt-6 leading-relaxed text-ivory/80">This notice explains how {COMPANY.legalName} handles the information you send through the project intake on our Web Design & Digital Experiences page.</p>
        <div className="mt-12 space-y-10">
          {SECTIONS.map(([h, ps]) => (
            <section key={h}>
              <h2 className="text-xl font-semibold text-ivory">{h}</h2>
              {ps.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-ivory/75">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-14 border-t border-line pt-8 text-sm text-mist">
          Questions:{' '}
          <a className="text-champagne underline underline-offset-4" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
        </p>
        <a href={`${WEBSITES_PAGES.home}#intake`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 text-[0.85rem] font-semibold text-navy">
          <span aria-hidden="true">←</span> Back to the project intake
        </a>
      </main>
    </div>
  )
}
