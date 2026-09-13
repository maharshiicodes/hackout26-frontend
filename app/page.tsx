"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import LandingNav from "@/app/components/LandingNav";

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Fades a block up into place the first time it enters the viewport. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A hairline that draws itself left-to-right once in view - the page's one recurring motif. */
function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: easeOut }}
      style={{ originX: 0 }}
      className={`h-px bg-black/15 ${className ?? ""}`}
    />
  );
}

/** Reveals one line of text by sliding it up out from behind a mask. */
function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: easeOut }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

const capabilities = [
  {
    title: "AI-powered search",
    body: "Describe what you need in plain language. We extract the CAS number, embed the query, and rank sellers by semantic relevance — not a text match on the chemical name.",
  },
  {
    title: "Personalized feed",
    body: "Recommendations built from what your company already buys and sells, ranked by relevance and listing freshness.",
  },
  {
    title: "List what you supply",
    body: "Publish a listing with purity, quantity, and any custom attributes buyers care about. Delete it whenever it's gone.",
  },
  {
    title: "Request what you need",
    body: "Post a buy request and show up in the feed of sellers who can fulfill it.",
  },
  {
    title: "One company profile",
    body: "Every listing you publish or request lives in one place, with your contact details ready for buyers to reach you.",
  },
];

const steps = [
  {
    step: "01",
    title: "List or search",
    body: "Publish what your company supplies, or describe what you need in your own words.",
  },
  {
    step: "02",
    title: "Get matched",
    body: "We resolve the chemical by CAS number and rank results by relevance and freshness.",
  },
  {
    step: "03",
    title: "Connect directly",
    body: "Reach out by phone or email straight from the listing — no middleman in between.",
  },
];

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const watermarkY = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 90]);
  const scrollCueOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-white">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/10 px-6 pb-28 pt-20 sm:pt-28">
        <motion.p
          aria-hidden
          style={{ y: watermarkY }}
          className="font-display pointer-events-none absolute -right-10 top-16 select-none text-[26vw] italic leading-none text-black/[0.035] sm:top-8"
        >
          CO₂
        </motion.p>

        <div className="relative mx-auto max-w-4xl">
          <Reveal className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-black/40">
              B2B chemical marketplace
            </span>
            <DrawLine className="w-12" delay={0.2} />
          </Reveal>

          <h1 className="font-display mt-8 text-5xl leading-[1.05] tracking-tight text-black sm:text-6xl lg:text-7xl">
            <MaskLine delay={0.1}>Source and sell</MaskLine>
            <MaskLine delay={0.22}>industrial chemicals.</MaskLine>
            <MaskLine delay={0.34} className="italic text-blue-600">
              Skip the cold calls.
            </MaskLine>
          </h1>

          <Reveal delay={0.5} className="mt-8 max-w-lg text-lg leading-relaxed text-black/60">
            <p>
              ReCarbon is a marketplace where manufacturers list what they can
              supply and find what they need — matched by chemistry, not just
              keywords.
            </p>
          </Reveal>

          <Reveal delay={0.6} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-black/70 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black/50"
            >
              Sign in
            </Link>
          </Reveal>

          <Reveal delay={0.7} className="mt-14 text-xs text-black/40">
            Free to list. No middlemen — you deal with the company directly.
          </Reveal>
        </div>

        {!shouldReduceMotion && (
          <motion.div
            aria-hidden
            style={{ opacity: scrollCueOpacity }}
            className="pointer-events-none absolute bottom-8 left-6 flex items-center gap-2 sm:left-10"
          >
            <motion.span
              animate={{ height: [8, 20, 8] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-px bg-black/25"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/30">
              Scroll
            </span>
          </motion.div>
        )}
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="mx-auto max-w-4xl px-6 py-24">
        <Reveal className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl">
            Everything a sourcing
            <br />
            team actually needs.
          </h2>
          <p className="hidden max-w-[14rem] text-sm leading-relaxed text-black/50 sm:block">
            No RFQ back-and-forth, no directory of stale contacts.
          </p>
        </Reveal>

        <DrawLine className="mt-10 w-full" />

        <div>
          {capabilities.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="group grid grid-cols-1 gap-2 py-8 transition-colors sm:grid-cols-[3rem_1fr_1.4fr] sm:gap-8">
                <span className="font-mono text-sm text-black/30 transition-colors group-hover:text-blue-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl text-black sm:text-2xl">{item.title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-black/55 sm:text-base">
                  {item.body}
                </p>
              </div>
              <div className="h-px bg-black/10" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-black/10 bg-black/[0.015]">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl">
              How it works
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3">
            {steps.map((item, i) => (
              <Reveal
                key={item.step}
                delay={i * 0.12}
                className={`py-8 sm:py-0 sm:pl-8 sm:pr-6 ${
                  i > 0 ? "border-t border-black/10 sm:border-l sm:border-t-0" : ""
                }`}
              >
                <span className="font-display block text-5xl italic text-black/15">
                  {item.step}
                </span>
                <h3 className="font-display mt-5 text-xl text-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/55">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - the one deliberate color inversion on the page */}
      <section className="bg-black px-6 py-28 text-center">
        <Reveal className="mx-auto max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-400">
            Get started
          </span>
          <h2 className="font-display mt-5 text-4xl italic leading-tight tracking-tight text-white sm:text-5xl">
            Start sourcing smarter.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-white/50">
            Register your company and publish your first listing in a couple
            of minutes.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              href="/register"
              className="rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
            >
              Sign in
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Link href="/" className="font-display text-base tracking-tight text-black">
            Re<span className="text-blue-600">Carbon</span>
          </Link>
          <p className="text-xs text-black/40">
            © {new Date().getFullYear()} ReCarbon. B2B chemical marketplace.
          </p>
        </div>
        <div className="border-t border-black/10 px-6 py-4 text-center text-xs text-black/50">
          Run a logistics company?{" "}
          <Link href="/logistics/login" className="font-medium text-blue-600 hover:text-blue-700">
            Sign in
          </Link>{" "}
          or{" "}
          <Link href="/logistics/register" className="font-medium text-blue-600 hover:text-blue-700">
            register as a logistics partner
          </Link>
          .
        </div>
      </footer>
    </div>
  );
}
