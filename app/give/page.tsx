import type { Metadata } from "next";
import { ArrowUpRight, Lock } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { Button, Container, Display, Eyebrow, PageHero } from "@/components/ui";
import { church, giving } from "@/content/site";

export const metadata: Metadata = {
  title: "Give",
  description: "Give to Fellowship Chicago securely through ShelbyGiving, or by Cash App, Zelle, text, PayPal or mail.",
};

const ask = <span className="text-tide">Details from the church office: {church.phone}</span>;

export default function Give() {
  const others = [
    {
      name: "Cash App",
      body: (
        <>
          <p className="font-display text-3xl font-black">{giving.cashApp.handle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton value={giving.cashApp.handle} label="Copy $Cashtag" />
            <a
              href={giving.cashApp.url}
              className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line px-4 text-sm font-semibold hover:border-foam"
            >
              Open Cash App <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </>
      ),
    },
    { name: "Zelle", body: giving.zelle.recipient ? <p className="text-xl">{giving.zelle.recipient}</p> : ask },
    {
      name: "Text to give",
      body: giving.textToGive.number ? (
        <p className="text-xl">
          Text {giving.textToGive.keyword} to {giving.textToGive.number}
        </p>
      ) : (
        ask
      ),
    },
    {
      name: "PayPal",
      body: giving.paypal.url ? (
        <a href={giving.paypal.url} className="font-semibold underline">
          Give with PayPal
        </a>
      ) : (
        ask
      ),
    },
    {
      name: "By mail",
      body: (
        <address className="not-italic text-lg">
          Payable to {giving.mail.payableTo}
          <br />
          {giving.mail.address}
        </address>
      ),
    },
  ];

  return (
    <main id="main">
      <PageHero
        eyebrow="Give"
        title={
          <>
            Generosity
            <br />
            is the Gospel
            <br />
            in motion
          </>
        }
        intro="Our vision is to share the Gospel through acts of love and generosity. Thank you for fueling it."
      />

      <section aria-labelledby="online" className="py-14 sm:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand p-8 sm:p-14">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_0%,rgba(255,255,255,0.2),transparent_60%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foam/80">Recommended</p>
                <Display id="online" className="mt-4 text-[clamp(2.8rem,8vw,6rem)]">
                  Give online
                </Display>
                <p className="mt-4 max-w-lg text-lg text-foam/90">
                  One-time or recurring gifts, tithes and offerings, by card or bank, through our secure ShelbyGiving page.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <Button href={giving.primary.url} className="min-h-16 w-full px-10 text-xl lg:w-auto">
                  {giving.primary.label}
                </Button>
                <p className="flex items-center gap-2 text-sm text-foam/80">
                  <Lock size={14} aria-hidden="true" /> Opens shelbygiving.com in this tab
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="other" className="pb-20 sm:pb-28">
        <Container>
          <Eyebrow>More ways</Eyebrow>
          <h2 id="other" className="mt-4 font-display text-5xl font-black uppercase">
            Other ways to give
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.name} className="rounded-3xl border border-line bg-hull p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">{o.name}</h3>
                <div className="mt-4">{o.body}</div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}
