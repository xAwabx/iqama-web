import Image from "next/image";
import { Mail } from "lucide-react";
import { SiInstagram } from "react-icons/si";

import { WaitlistForm } from "@/components/waitlist-form";

export default function WaitlistPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-[clamp(1rem,5vw,3rem)] py-[clamp(2rem,8vw,6rem)]">
      <div className="w-full max-w-(--container-narrow)">
        <header className="mb-[clamp(2rem,6vw,4rem)] text-center">
          <Image
            src="/logos/iqama-qaf-me-k1-bare.svg"
            alt=""
            width={200}
            height={200}
            priority
            className="mx-auto mb-2xl bg-accent/10 rounded-lg h-[clamp(2.5rem,7vw,4.5rem)] w-auto"
          />
          <p className="mb-2xl flex flex-wrap items-center justify-center gap-x-[clamp(0.5rem,3vw,1.5rem)] gap-y-xs font-sans text-xs uppercase tracking-[clamp(0.18em,0.6vw,0.28em)] text-ink">
            <span>Prayer</span>
            <span aria-hidden className="text-ink-muted/50">
              ·
            </span>
            <span>Partners</span>
            <span aria-hidden className="text-ink-muted/50">
              ·
            </span>
            <span>Streaks</span>
          </p>
          <h1 className="flex flex-col items-center gap-md">
            <span className="font-sans text-lg uppercase tracking-[0.22em] text-ink-muted">
              Join the waitlist for
            </span>
            <span className="flex w-full items-center justify-center gap-[clamp(0.25rem,1vw,1rem)]">
              <span className="font-display font-semibold text-[clamp(3rem,14vw,8rem)] leading-[0.9] tracking-[-0.03em] text-accent">
                IQAMA
              </span>
            </span>
          </h1>
        </header>

        <WaitlistForm />

        <div className=" my-6 h-px bg-hairline" />

        <footer className="grid grid-cols-1 gap-md sm:grid-cols-2">
          <a
            href="https://www.instagram.com/iqama_app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-md rounded-lg  hover:bg-card p-md transition-colors hover:border-ink-muted/40"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-paper text-ink transition-colors group-hover:text-accent">
              <SiInstagram aria-hidden className="h-5 w-5" />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-caption font-medium text-ink">
                Instagram
              </span>
              <span className="truncate text-caption text-ink-muted">
                @iqama_app
              </span>
            </span>
          </a>
          <a
            href="mailto:iqamaapp@gmail.com"
            className="group flex items-center gap-md rounded-lg  hover:bg-card p-md transition-colors hover:border-ink-muted/40"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-paper text-ink transition-colors group-hover:text-accent">
              <Mail aria-hidden className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-caption font-medium text-ink">Email</span>
              <span className="truncate text-caption text-ink-muted">
                iqamaapp@gmail.com
              </span>
            </span>
          </a>
        </footer>
      </div>
    </main>
  );
}
