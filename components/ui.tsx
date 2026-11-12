import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-tide sm:text-[0.8rem] ${className}`}
    >
      <span aria-hidden="true" className="h-px w-8 bg-brass" />
      {children}
    </p>
  );
}

export function Display({
  as: Tag = "h2",
  children,
  className = "",
  id,
}: {
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={`font-display font-black uppercase leading-[0.88] tracking-[-0.005em] text-foam ${className}`}
    >
      {children}
    </Tag>
  );
}

type BtnProps = { variant?: "light" | "outline" | "brand"; children: ReactNode; className?: string } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

const styles = {
  light: "bg-foam text-ink hover:bg-white hover:shadow-[0_0_40px_rgba(244,247,252,0.3)]",
  outline: "border border-foam/30 text-foam hover:border-foam hover:bg-foam/10",
  brand: "bg-brand text-foam hover:bg-brand-bright",
};

export function Button({ variant = "light", className = "", children, ...rest }: BtnProps) {
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition disabled:opacity-60 ${styles[variant]} ${className}`;
  if (rest.href !== undefined) {
    const { href, ...p } = rest as { href: string };
    const external = /^https?:|^tel:|^mailto:/.test(href);
    return external ? (
      <a href={href} className={cls} {...(p as ComponentProps<"a">)}>
        {children}
      </a>
    ) : (
      <Link href={href} className={cls} {...p}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}

/**
 * Clearly marked placeholder for content the church still needs to supply.
 * Intentionally visible in the demo so reviewers can see what's missing.
 */
export function Placeholder({ label, children, className = "" }: { label: string; children?: ReactNode; className?: string }) {
  return (
    <div
      role="note"
      className={`rounded-2xl border border-dashed border-brass/50 bg-brass/[0.06] p-5 text-sm text-tide ${className}`}
    >
      <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brass">Placeholder · {label}</p>
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative isolate overflow-hidden border-b border-line pb-14 pt-32 sm:pb-20 sm:pt-44">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_85%_0%,rgba(31,86,184,0.55),transparent_60%)]"
      />
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Display as="h1" className="mt-5 text-[clamp(3.2rem,11vw,9rem)]">
          {title}
        </Display>
        {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-foam/85 sm:text-xl">{intro}</div>}
        {children}
      </Container>
    </section>
  );
}
