import Link from "next/link";
import { Brain } from "lucide-react";

import { GITHUB_URL, SITE_NAME } from "@/constants/site";
import { GithubIcon } from "@/components/icons/github";

/** Marketing footer: brand, section links, and source link. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <Brain className="size-4" aria-hidden />
            </span>
            <span className="font-bold tracking-tight">{SITE_NAME}</span>
          </Link>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            An AI habit &amp; addiction recovery coach. Built to help you change
            for good — free and private.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/#how" className="text-muted-foreground hover:text-foreground">
            How it works
          </Link>
          <Link href="/#features" className="text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/app" className="text-muted-foreground hover:text-foreground">
            Open app
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <GithubIcon className="size-4" aria-hidden />
            GitHub
          </a>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          Rewire is a supportive tool, not a substitute for professional care.
          If you&apos;re struggling with addiction, please reach out to a
          qualified professional.
        </div>
      </div>
    </footer>
  );
}
