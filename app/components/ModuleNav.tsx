"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { modules } from "@/lib/quiz-data";

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ModuleNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="relative w-0 shrink-0 overflow-visible md:flex md:w-56 md:flex-col md:self-stretch">
      <button
        type="button"
        className={[
          "fixed top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 shadow-sm transition-[left,transform] duration-200 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-950",
          /* Closed: hamburger top-left. Open: close aligned to top-right inside w-56 drawer (no overlap with title). */
          open
            ? "left-[calc(14rem-2.75rem-1rem)]"
            : "left-4",
        ].join(" ")}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="module-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-y-0 right-0 left-56 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <nav
        id="module-nav-panel"
        aria-label="Quiz modules"
        className={[
          "shrink-0 border-zinc-200",
          /* Opaque on mobile so the dimmer never shows through; subtle tint on md+ */
          "max-md:bg-zinc-50 max-md:dark:bg-zinc-900 md:bg-zinc-50/50 md:dark:bg-zinc-900/50",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-56 max-md:border-r max-md:shadow-xl max-md:transition-transform max-md:duration-200 max-md:ease-out",
          open ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          "md:static md:z-auto md:h-full md:w-full md:translate-x-0 md:border-r md:shadow-none",
          "flex min-h-0 flex-1 flex-col",
        ].join(" ")}
      >
        <div className="sticky top-0 flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
          <Link
            href="/"
            className="mb-4 block text-sm font-semibold text-zinc-900 dark:text-zinc-50"
            onClick={() => setOpen(false)}
          >
            Learn AIDD Quiz
          </Link>
          <ul className="space-y-1">
            {modules.map((m) => {
              const href = `/modules/${m.slug}`;
              const isActive =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={m.slug}>
                  <Link
                    href={href}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${
                      isActive
                        ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {m.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
