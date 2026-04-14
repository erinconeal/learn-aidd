"use client";


import { useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { QuizModule, QuizQuestion } from "@/lib/quiz-data";

function ExplainerContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="mb-3 ml-4 list-disc space-y-1">
          {listItems.map((item, i) => (
            <li key={i}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const formatInline = (s: string) => {
    const parts: React.ReactNode[] = [];
    let rest = s;
    let i = 0;
    while (rest.length > 0) {
      const match = rest.match(/\*\*(.+?)\*\*/);
      if (match) {
        const idx = rest.indexOf(match[0]);
        if (idx > 0) parts.push(rest.slice(0, idx));
        parts.push(<strong key={i++} className="font-semibold">{match[1]}</strong>);
        rest = rest.slice(idx + match[0].length);
      } else {
        parts.push(rest);
        break;
      }
    }
    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  for (const line of lines) {
    if (line.startsWith("- ")) {
      flushList();
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
      elements.push(<br key={key++} />);
    } else {
      flushList();
      elements.push(
        <p key={key++} className="mb-2">
          {formatInline(line)}
        </p>
      );
    }
  }
  flushList();

  return <>{elements}</>;
}

interface ModuleQuizProps {
  module: QuizModule;
  questions: QuizQuestion[];
}

export function ModuleQuiz({ module, questions }: ModuleQuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const baseId = useId();

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;
  const totalCount = questions.length;
  const answeredCount = Object.keys(answers).length;

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNewRandom = () => {
    // Preserve other search params, just update seed
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("seed", Date.now().toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-8 py-12">
      {/* Explainer */}
      <section aria-labelledby="module-title" className="mb-12">
        <h1 id="module-title" className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {module.title}
        </h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <div className="rounded-lg border border-zinc-200 bg-zinc-100/80 p-5 text-sm leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200">
            <ExplainerContent text={module.explainer} />
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section aria-labelledby="quiz-heading">
        <h2 id="quiz-heading" className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Quiz ({questions.length} questions)
        </h2>
        <ul className="space-y-8">
          {questions.map((q, qIndex) => (
            <QuestionItem
              key={q.id}
              question={q}
              questionNumber={qIndex + 1}
              selectedIndex={answers[q.id]}
              onSelect={(idx) => handleSelect(q.id, idx)}
              submitted={submitted}
              baseId={baseId}
            />
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitted || answeredCount < totalCount}
            title={
              answeredCount < totalCount
                ? `Answer all ${totalCount} questions to submit`
                : undefined
            }
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-900"
          >
            {submitted ? "Submitted" : "Submit Answers"}
          </button>
          <button
            type="button"
            onClick={handleNewRandom}
            className="text-sm text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:text-zinc-900 hover:decoration-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-zinc-300 dark:decoration-zinc-500 dark:hover:text-zinc-50 dark:hover:decoration-zinc-300 dark:focus-visible:ring-offset-zinc-900"
          >
            New random questions
          </button>
          {submitted && (
            <p
              aria-live="polite"
              className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Score: {correctCount} / {totalCount} (
              {Math.round((correctCount / totalCount) * 100)}%)
            </p>
          )}
          {!submitted && answeredCount < totalCount && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Answer all {totalCount} questions to submit
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

interface QuestionItemProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedIndex: number | undefined;
  onSelect: (index: number) => void;
  submitted: boolean;
  baseId: string;
}

function QuestionItem({
  question,
  questionNumber,
  selectedIndex,
  onSelect,
  submitted,
  baseId,
}: QuestionItemProps) {
  const name = `${baseId}-${question.id}`;
  const isCorrect = selectedIndex === question.correctIndex;
  const showCorrect = submitted && !isCorrect;

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p id={`${name}-label`} className="mb-3 font-medium text-zinc-900 dark:text-zinc-50">
        {questionNumber}. {question.question}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${name}-label`}
        className="space-y-2"
      >
        {question.options.map((opt, idx) => {
          const id = `${name}-${idx}`;
          const isSelected = selectedIndex === idx;
          const isCorrectOption = idx === question.correctIndex;
          let stateClass = "";
          if (submitted) {
            if (isCorrectOption)
              stateClass =
                "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-950/50";
            else if (isSelected && !isCorrect)
              stateClass =
                "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/50";
          } else if (isSelected) {
            stateClass =
              "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/50";
          }
          return (
            <label
              key={idx}
              htmlFor={id}
              className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md border-2 px-3 py-2.5 transition-colors ${
                submitted
                  ? "cursor-default"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
              } ${stateClass} ${!stateClass ? "border-transparent" : ""}`}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={String(idx)}
                checked={isSelected}
                onChange={() => onSelect(idx)}
                disabled={submitted}
                aria-describedby={
                  submitted && isCorrectOption ? `${name}-${idx}-correct` : undefined
                }
                className="h-4 w-4 shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              />
              <span className="flex-1 text-sm text-zinc-800 dark:text-zinc-200">
                {opt}
              </span>
              {submitted && isCorrectOption && (
                <span
                  id={`${name}-${idx}-correct`}
                  className="ml-auto shrink-0 text-xs font-semibold text-green-700 dark:text-green-300"
                >
                  ✓ Correct
                </span>
              )}
            </label>
          );
        })}
      </div>
      {showCorrect && (
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          Correct answer: {question.options[question.correctIndex]}
        </p>
      )}
    </li>
  );
}
