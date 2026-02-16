import Link from "next/link"

export function GoldButton({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-full bg-(--color-brand-100) px-5 py-3 text-sm font-semibold text-black/90 shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-auto"
    >
      {text}
    </Link>
  )
}

export function BlackButton({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
    >
      {text}
    </Link>
  )
}

export function FooterButton({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href  ={href}
      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
>
  {text}
</Link>
  )
}

export function HeroButton({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href  ={href}
      className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-auto"
>
  {text}
</Link>
  )
}
// Usage example:
// <BlackButton href="/prendre-rdv" text="Prendre RDV" />
// <GoldButton href="/contact" text="Contactez-nous" />
// <FooterButton href="/mentions-legales" text="Mentions légales" />