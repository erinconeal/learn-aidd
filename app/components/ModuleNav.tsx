"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { modules } from "@/lib/quiz-data";

export function ModuleNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Quiz modules" className="w-56 shrink-0 border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="sticky top-0 p-4">
        <Link
          href="/"
          className="mb-4 block text-sm font-semibold text-zinc-900 dark:text-zinc-50"
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
                >
                  {m.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
