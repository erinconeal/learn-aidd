import { notFound } from "next/navigation";

import { ModuleQuiz } from "@/app/components/ModuleQuiz";
import { ModuleNav } from "@/app/components/ModuleNav";
import {
  getModuleBySlug,
  getRandomQuestions,
} from "@/lib/quiz-data";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ seed?: string }>;
}

export default async function ModulePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { seed } = await searchParams;

  const moduleData = getModuleBySlug(slug);
  if (!moduleData) notFound();

  const seedNum = seed ? parseInt(seed, 10) : undefined;
  const questions = getRandomQuestions(
    moduleData.questions,
    10,
    Number.isNaN(seedNum) ? undefined : seedNum
  );

  return (
    <div className="flex min-h-screen">
      <ModuleNav />
      <main
        id="main-content"
        className="flex-1 overflow-auto pt-16 md:pt-0"
        tabIndex={-1}
      >
        <ModuleQuiz
          module={moduleData}
          questions={questions}
        />
      </main>
    </div>
  );
}
