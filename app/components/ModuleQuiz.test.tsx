import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { ModuleQuiz } from "./ModuleQuiz";
import type { QuizModule, QuizQuestion } from "@/lib/quiz-data";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

const createQuestion = (
  id: string,
  question: string,
  correctIndex: number
): QuizQuestion => ({
  id,
  question,
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctIndex,
});

const createModule = (
  overrides: Partial<QuizModule> = {}
): QuizModule => ({
  slug: "test-module",
  title: "Test Module",
  description: "A test module",
  explainer: "**Bold text** and normal text.\n\n- List item one\n- List item two",
  questions: [
    createQuestion("q1", "First question?", 0),
    createQuestion("q2", "Second question?", 2),
  ],
  ...overrides,
});

describe("ModuleQuiz", () => {
  test("given module and questions, should render module title and explainer", () => {
    const module = createModule();
    render(<ModuleQuiz module={module} questions={module.questions} />);

    expect(screen.getByRole("heading", { name: "Test Module" })).toBeInTheDocument();
    expect(screen.getByText("Bold text")).toBeInTheDocument();
    expect(screen.getByText("List item one")).toBeInTheDocument();
    expect(screen.getByText("List item two")).toBeInTheDocument();
  });

  test("given questions, should render each question and options", () => {
    const module = createModule();
    render(<ModuleQuiz module={module} questions={module.questions} />);

    expect(screen.getByText(/First question\?/)).toBeInTheDocument();
    expect(screen.getByText(/Second question\?/)).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(8);
  });

  test("given no answers, submit button should be disabled", () => {
    const module = createModule();
    render(<ModuleQuiz module={module} questions={module.questions} />);

    const submit = screen.getByRole("button", { name: "Submit Answers" });
    expect(submit).toBeDisabled();
  });

  test("given all answers selected, submit button should be enabled", () => {
    const module = createModule();
    render(<ModuleQuiz module={module} questions={module.questions} />);

    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => fireEvent.click(r));

    const submit = screen.getByRole("button", { name: "Submit Answers" });
    expect(submit).toBeEnabled();
  });

  test("given submitted quiz, should show score", () => {
    const module = createModule();
    const questions = module.questions;
    render(<ModuleQuiz module={module} questions={questions} />);

    fireEvent.click(screen.getAllByLabelText("Option A")[0]);
    fireEvent.click(screen.getAllByLabelText("Option C")[1]);

    fireEvent.click(screen.getByRole("button", { name: "Submit Answers" }));

    expect(screen.getByText(/Score: 2 \/ 2/)).toBeInTheDocument();
  });

  test("given one correct and one wrong answer, should show correct score", () => {
    const module = createModule();
    render(<ModuleQuiz module={module} questions={module.questions} />);

    fireEvent.click(screen.getAllByLabelText("Option A")[0]);
    fireEvent.click(screen.getAllByLabelText("Option A")[1]);

    fireEvent.click(screen.getByRole("button", { name: "Submit Answers" }));

    expect(screen.getByText(/Score: 1 \/ 2/)).toBeInTheDocument();
  });

  test("given submitted quiz with wrong answer, should show correct answer hint", () => {
    const module = createModule();
    render(<ModuleQuiz module={module} questions={module.questions} />);

    fireEvent.click(screen.getAllByLabelText("Option B")[0]);
    fireEvent.click(screen.getAllByLabelText("Option C")[1]);

    fireEvent.click(screen.getByRole("button", { name: "Submit Answers" }));

    expect(screen.getByText(/Correct answer: Option A/)).toBeInTheDocument();
  });

  test("given submitted quiz, should not allow changing answers", () => {
    const module = createModule();
    render(<ModuleQuiz module={module} questions={module.questions} />);

    fireEvent.click(screen.getAllByLabelText("Option A")[0]);
    fireEvent.click(screen.getAllByLabelText("Option C")[1]);
    fireEvent.click(screen.getByRole("button", { name: "Submit Answers" }));

    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r).toBeDisabled());
  });
});
