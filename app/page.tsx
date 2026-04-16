import Link from "next/link";

import { ModuleNav } from "./components/ModuleNav";
import { modules } from "@/lib/quiz-data";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <ModuleNav />
      <main
        id="main-content"
        className="flex-1 overflow-auto pt-16 md:pt-0"
        tabIndex={-1}
      >
        <div className="mx-auto max-w-2xl px-8 py-12">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Learn AIDD
          </h1>
          <p className="mb-10 text-zinc-600 dark:text-zinc-400">
            Test your knowledge across project rules, frameworks, and tools.
            Each module includes an explainer and 10 random quiz questions.
          </p>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Modules
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {modules.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/modules/${m.slug}`}
                  className="group block rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:focus-visible:ring-offset-zinc-950 h-full"
                >
                  <span className="font-medium text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    {m.title}
                  </span>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {m.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
