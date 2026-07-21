"use client";

import Link from "next/link";
import { Brain } from "lucide-react";

import { GITHUB_URL } from "@/constants/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { GithubIcon } from "@/components/icons/github";

const NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/about", label: "About" },
];

/** Sticky marketing nav: brand, section links, GitHub, and the app CTA. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Brain className="size-5" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-gradient">Rewire</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
            className="hidden size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
          >
            <GithubIcon className="size-5" aria-hidden />
          </a>
          <ThemeToggle />
          <Link
            href="/app"
            className={cn(
              buttonVariants(),
              "bg-gradient-to-r from-primary to-emerald-500 font-semibold shadow-sm shadow-primary/20 transition-shadow hover:shadow-primary/40",
            )}
          >
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}
