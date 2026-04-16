import { describe, test, expect } from "vitest";

import {
  getRandomQuestions,
  getModuleBySlug,
  modules,
  shuffleQuestionOptions,
  type QuizQuestion,
} from "./quiz-data";

const createQuestion = (id: string, correctIndex: number): QuizQuestion => ({
  id,
  question: `Question ${id}`,
  options: ["A", "B", "C", "D"],
  correctIndex,
});

describe("getRandomQuestions", () => {
  test("given pool smaller than count, should return entire pool with shuffled options", () => {
    const pool = [
      createQuestion("1", 0),
      createQuestion("2", 1),
    ];
    const actual = getRandomQuestions(pool, 10);
    expect(actual).toHaveLength(2);
    expect(actual.map((q) => q.id)).toEqual(pool.map((q) => q.id));
    for (const aq of actual) {
      const orig = pool.find((p) => p.id === aq.id)!;
      expect([...aq.options].sort()).toEqual([...orig.options].sort());
      expect(aq.options[aq.correctIndex]).toBe(orig.options[orig.correctIndex]);
    }
  });

  test("given pool equal to count, should return all questions with shuffled options", () => {
    const pool = Array.from({ length: 10 }, (_, i) =>
      createQuestion(`q-${i}`, i % 4)
    );
    const actual = getRandomQuestions(pool, 10);
    expect(actual).toHaveLength(10);
    expect(actual.map((q) => q.id)).toEqual(pool.map((q) => q.id));
    for (const aq of actual) {
      const orig = pool.find((p) => p.id === aq.id)!;
      expect([...aq.options].sort()).toEqual([...orig.options].sort());
      expect(aq.options[aq.correctIndex]).toBe(orig.options[orig.correctIndex]);
    }
  });

  test("given pool larger than count, should return count items", () => {
    const pool = Array.from({ length: 20 }, (_, i) =>
      createQuestion(`q-${i}`, i % 4)
    );
    const actual = getRandomQuestions(pool, 5);
    expect(actual).toHaveLength(5);
  });

  test("given seed, should return same selection on repeated calls", () => {
    const pool = Array.from({ length: 15 }, (_, i) =>
      createQuestion(`q-${i}`, i % 4)
    );
    const first = getRandomQuestions(pool, 10, 42);
    const second = getRandomQuestions(pool, 10, 42);
    expect(first.map((q) => q.id)).toEqual(second.map((q) => q.id));
  });

  test("given different seeds, should return different selections", () => {
    const pool = Array.from({ length: 15 }, (_, i) =>
      createQuestion(`q-${i}`, i % 4)
    );
    const first = getRandomQuestions(pool, 10, 1);
    const second = getRandomQuestions(pool, 10, 999);
    expect(first.map((q) => q.id)).not.toEqual(second.map((q) => q.id));
  });

  test("given no count, should default to 10", () => {
    const pool = Array.from({ length: 15 }, (_, i) =>
      createQuestion(`q-${i}`, i % 4)
    );
    const actual = getRandomQuestions(pool);
    expect(actual).toHaveLength(10);
  });

  test("given count, should not mutate original pool", () => {
    const pool = Array.from({ length: 20 }, (_, i) =>
      createQuestion(`q-${i}`, i % 4)
    );
    const originalIds = pool.map((q) => q.id);
    const originalOptions = pool.map((q) => [...q.options]);
    getRandomQuestions(pool, 5);
    expect(pool.map((q) => q.id)).toEqual(originalIds);
    pool.forEach((q, i) => {
      expect(q.options).toEqual(originalOptions[i]);
    });
  });

  test("given seed, full quiz output including option order is deterministic", () => {
    const pool = Array.from({ length: 12 }, (_, i) =>
      createQuestion(`q-${i}`, i % 4)
    );
    const first = getRandomQuestions(pool, 10, 42);
    const second = getRandomQuestions(pool, 10, 42);
    expect(first).toEqual(second);
  });
});

describe("shuffleQuestionOptions", () => {
  test("given question, should preserve correct answer text", () => {
    const q = createQuestion("x", 2);
    const shuffled = shuffleQuestionOptions(q, 12345);
    expect(shuffled.options[shuffled.correctIndex]).toBe("C");
    expect([...shuffled.options].sort()).toEqual([...q.options].sort());
  });
});

describe("getModuleBySlug", () => {
  test("given valid slug, should return module", () => {
    const actual = getModuleBySlug("rules-javascript");
    expect(actual).toBeDefined();
    expect(actual?.slug).toBe("rules-javascript");
    expect(actual?.title).toBe("rules/javascript");
  });

  test("given invalid slug, should return undefined", () => {
    const actual = getModuleBySlug("nonexistent-module");
    expect(actual).toBeUndefined();
  });

  test("given each module slug from modules, should return matching module", () => {
    for (const m of modules) {
      const actual = getModuleBySlug(m.slug);
      expect(actual).toBeDefined();
      expect(actual?.slug).toBe(m.slug);
    }
  });
});
