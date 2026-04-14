import { describe, test, expect } from "vitest";

import {
  getRandomQuestions,
  getModuleBySlug,
  modules,
  type QuizQuestion,
} from "./quiz-data";

const createQuestion = (id: string, correctIndex: number): QuizQuestion => ({
  id,
  question: `Question ${id}`,
  options: ["A", "B", "C", "D"],
  correctIndex,
});

describe("getRandomQuestions", () => {
  test("given pool smaller than count, should return entire pool", () => {
    const pool = [
      createQuestion("1", 0),
      createQuestion("2", 1),
    ];
    const actual = getRandomQuestions(pool, 10);
    expect(actual).toHaveLength(2);
    expect(actual).toEqual(pool);
  });

  test("given pool equal to count, should return entire pool", () => {
    const pool = Array.from({ length: 10 }, (_, i) =>
      createQuestion(`q-${i}`, i % 4)
    );
    const actual = getRandomQuestions(pool, 10);
    expect(actual).toHaveLength(10);
    expect(actual).toEqual(pool);
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
    getRandomQuestions(pool, 5);
    expect(pool.map((q) => q.id)).toEqual(originalIds);
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
