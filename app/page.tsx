import Link from "next/link";
import {
  Search,
  Rss,
  PackagePlus,
  ShoppingCart,
  Building2,
  MapPin,
  FlaskConical,
  ArrowRight,
  Leaf,
} from "lucide-react";
import LandingNav from "@/app/components/LandingNav";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-blue-100/60 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/60">
              <Leaf className="h-3.5 w-3.5 text-blue-600" />
              Now live for manufacturing companies
            </div>

            <h1 className="font-heading mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-black sm:text-5xl">
              Source and sell industrial chemicals, without the cold calls.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-black/60">
              ReCarbon is a B2B marketplace where manufacturers list what they
              can supply and find what they need — matched by chemistry, not
              just keywords.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-black/15 px-5 py-3 text-sm font-medium text-black/70 transition-colors hover:bg-black/5"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-6 text-xs text-black/40">
              Free to list. No middlemen — you deal with the company directly.
            </p>
          </div>

          {/* Product preview mock */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-50 to-transparent" />
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <div className="w-full rounded-lg border border-black/15 bg-white py-2.5 pl-9 pr-3 text-sm text-black/70">
                  Hydrochloric acid CAS 7647-01-0, 99% purity
                </div>
              </div>

              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-black/40">
                Sellers matched
              </p>

              <div className="mt-3 space-y-2.5">
                {[
                  { name: "Gujarat Alkalies Ltd", loc: "Ahmedabad, Gujarat", match: 92 },
                  { name: "Raj Chemicals", loc: "Vadodara, Gujarat", match: 87 },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white p-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <FlaskConical className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{item.name}</p>
                        <p className="flex items-center gap-1 text-xs text-black/50">
                          <MapPin className="h-3 w-3" />
                          {item.loc}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {item.match}% match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bento grid */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-black">
            Everything a sourcing team actually needs
          </h2>
          <p className="mt-3 text-black/60">
            No RFQ back-and-forth, no directory of stale contacts — just the
            listings relevant to your business.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-6 sm:col-span-2 lg:row-span-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-heading mt-4 text-lg font-semibold text-black">
              AI-powered search
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-black/60">
              Type what you need in plain language. We extract the CAS number,
              embed the query, and rank sellers by semantic relevance — not
              just a text match on the chemical name.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Rss className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-heading mt-4 text-lg font-semibold text-black">
              Personalized feed
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Recommendations built from what your company already buys and
              sells, ranked by relevance and listing freshness.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <PackagePlus className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-heading mt-4 text-lg font-semibold text-black">
              List what you supply
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Publish a listing with purity, quantity, and any custom
              attributes buyers care about. Delete it whenever it&apos;s gone.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-heading mt-4 text-lg font-semibold text-black">
              Request what you need
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Post a buy request and show up in the feed of sellers who can
              fulfill it.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-heading mt-4 text-lg font-semibold text-black">
              One company profile
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Every listing you publish or request lives in one place, with
              your contact details ready for buyers to reach you.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-black/5 bg-black/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-black">
            How it works
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
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
            ].map((item) => (
              <div key={item.step}>
                <span className="font-heading text-sm font-semibold text-blue-600">
                  {item.step}
                </span>
                <h3 className="font-heading mt-2 text-lg font-semibold text-black">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-black sm:text-4xl">
          Start sourcing smarter
        </h2>
        <p className="mx-auto mt-3 max-w-md text-black/60">
          Register your company and publish your first listing in a couple of
          minutes.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-sm font-semibold tracking-tight text-black">
              ReCarbon
            </span>
          </div>
          <p className="text-xs text-black/40">
            © {new Date().getFullYear()} ReCarbon. B2B chemical marketplace.
          </p>
        </div>
      </footer>
    </div>
  );
}
