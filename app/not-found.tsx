import { Button, Container, Display, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[80svh] items-center pt-24">
      <Container>
        <Eyebrow>404</Eyebrow>
        <Display as="h1" className="mt-5 text-[clamp(3.2rem,11vw,9rem)]">
          Lost at sea
        </Display>
        <p className="mt-5 max-w-lg text-lg text-tide">That page has moved or no longer exists. Let&rsquo;s get you back on board.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/">Home</Button>
          <Button href="/im-new" variant="outline">Plan a visit</Button>
        </div>
      </Container>
    </main>
  );
}
