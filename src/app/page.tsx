import { WaitlistForm } from "@/components/waitlist-form";

export default function WaitlistPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-lg py-3xl sm:px-xl">
      <div className="w-full max-w-(--container-narrow)">
        <header className="mb-2xl">
          <p className="text-caption uppercase tracking-[0.18em] text-ink-muted">
            Iqama
          </p>
          <h1 className="mt-md font-display text-display leading-[1.05] tracking-[-0.02em] text-ink">
            A quiet way to keep your Salah.
          </h1>
          <p className="mt-lg text-body leading-relaxed text-ink-muted">
            Iqama is a focused prayer companion for Muslims who want to stay
            consistent with the five daily prayers. Log Fajr through Isha,
            share pair streaks with a friend who's keeping you accountable,
            and get a gentle reminder before each prayer — all on your phone,
            fully offline.
          </p>
          <p className="mt-md text-body leading-relaxed text-ink-muted">
            We're finishing it now. Leave your email and we'll let you know
            when it's on the App Store and Google Play.
          </p>
        </header>

        <WaitlistForm />

        <footer className="mt-3xl border-t border-hairline pt-lg">
          <p className="text-caption text-ink-muted">
            iOS and Android. Anonymous email-only signup — no tracking, no
            marketing.
          </p>
        </footer>
      </div>
    </main>
  );
}
