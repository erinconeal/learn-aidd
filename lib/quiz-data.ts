export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizModule {
  slug: string;
  title: string;
  description: string;
  explainer: string;
  questions: QuizQuestion[];
}

/**
 * Fisher–Yates shuffle. When seed is provided, uses deterministic RNG for reproducibility.
 * Note: Not cryptographically secure. Suitable for quizzes, not for security-sensitive use.
 */
function shuffle<T>(array: T[], seed?: number): T[] {
  const arr = [...array];
  const rng =
    seed !== undefined
      ? (() => {
          let s = seed;
          return () => {
            const x = Math.sin(s++) * 10000;
            return x - Math.floor(x);
          };
        })()
      : () => Math.random();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
  }
  return h >>> 0;
}

/**
 * Returns a copy of the question with answer options in random order.
 * `correctIndex` is updated so it still points at the same answer text.
 * @param optionShuffleSeed - When set, shuffle is reproducible (pair with URL seed).
 */
export function shuffleQuestionOptions(
  question: QuizQuestion,
  optionShuffleSeed?: number
): QuizQuestion {
  const tagged = question.options.map((text, i) => ({
    text,
    isCorrect: i === question.correctIndex,
  }));
  const shuffled = shuffle(tagged, optionShuffleSeed);
  return {
    ...question,
    options: shuffled.map((t) => t.text),
    correctIndex: shuffled.findIndex((t) => t.isCorrect),
  };
}

/**
 * Returns a random subset of questions from the pool. Uses seed for reproducible selection.
 * Each question’s options are shuffled so the correct choice is not always the same slot.
 * @param questions - Full question pool
 * @param count - Number of questions to return (default 10)
 * @param seed - Optional seed for deterministic selection
 */
export function getRandomQuestions(
  questions: QuizQuestion[],
  count: number = 10,
  seed?: number
): QuizQuestion[] {
  const selected =
    questions.length <= count
      ? [...questions]
      : shuffle(questions, seed).slice(0, count);

  return selected.map((q) => {
    const optionSeed =
      seed === undefined || Number.isNaN(seed)
        ? undefined
        : (Number(seed) ^ hashString(q.id)) >>> 0;
    return shuffleQuestionOptions(q, optionSeed);
  });
}

export const modules: QuizModule[] = [
  {
    slug: "rules-javascript",
    title: "rules/javascript",
    description: "JavaScript/TypeScript best practices from the project rules",
    explainer: `The rules/javascript guide enforces top-tier JavaScript/TypeScript discipline. Key principles include DOT, YAGNI, KISS, DRY, and SDA (Self Describing APIs).

**Core constraints:**
- Favor functional programming: pure functions, immutability, map/filter/reduce over loops
- Prefer \`const\` over \`let\` and \`var\`
- Use options objects instead of null/undefined arguments
- Assign defaults in function signatures: \`({ id = createId(), name = '' } = {})\`
- Prefer \`createUser()\` over \`User.create()\` (standalone verbs)
- Booleans should read like yes/no: \`isActive\`, \`hasPermission\`
- Use strict equality (\`===\`) and async/await
- Modularize by feature; one concern per file; prefer named exports`,
    questions: [
      {
        id: "js-1",
        question: "What does SDA stand for in the JavaScript rules?",
        options: ["Strict Dynamic Allocation", "Self Describing APIs", "Structured Data Access", "Simple Declarative Approach"],
        correctIndex: 1,
      },
      {
        id: "js-2",
        question: "Which approach is preferred for handling optional parameters?",
        options: ["Null/undefined arguments", "Options objects with destructuring", "Rest parameters only", "Multiple overloaded signatures"],
        correctIndex: 1,
      },
      {
        id: "js-3",
        question: "How should predicate/boolean variables be named?",
        options: ["As nouns: active, permission", "Like yes/no questions: isActive, hasPermission", "With prefixes: boolActive", "As verbs: checkActive"],
        correctIndex: 1,
      },
      {
        id: "js-4",
        question: "Which is preferred for array operations?",
        options: ["Manual for loops", "map, filter, reduce", "forEach with side effects", "While loops"],
        correctIndex: 1,
      },
      {
        id: "js-5",
        question: "What naming pattern is preferred for functions?",
        options: ["Noun.method: User.create()", "Standalone verbs: createUser()", "doSomething style: doCreateUser()", "Class-based: new User()"],
        correctIndex: 1,
      },
      {
        id: "js-6",
        question: "How should defaults be supplied for optional parameters?",
        options: ["Using || operator: name || ''", "In parameter defaults: ({ name = '' } = {})", "In function body with if checks", "Using ternary operators"],
        correctIndex: 1,
      },
      {
        id: "js-7",
        question: "Which equality operator should be used?",
        options: ["== (loose)", "=== (strict)", "Object.is() only", "Either == or ==="],
        correctIndex: 1,
      },
      {
        id: "js-8",
        question: "What should be avoided in favor of composition?",
        options: ["Arrow functions", "class and extends", "Template literals", "Destructuring"],
        correctIndex: 1,
      },
      {
        id: "js-9",
        question: "How should lifecycle methods be named?",
        options: ["willX / didX", "beforeX / afterX", "preX / postX", "onX / offX"],
        correctIndex: 1,
      },
      {
        id: "js-10",
        question: "Which principle says 'obvious stuff gets hidden, meaningful stuff is passed in'?",
        options: ["DRY", "YAGNI", "Simplicity", "KISS"],
        correctIndex: 2,
      },
      {
        id: "js-11",
        question: "What should mixins and decorators be prefixed with?",
        options: ["decorate_", "mixin_", "with${Thing}", "extend_"],
        correctIndex: 2,
      },
      {
        id: "js-12",
        question: "For defaults, prefer: const a = obj.a or const { a } = obj?",
        options: ["const a = obj.a", "const { a } = obj (destructuring)", "Either is fine", "obj.a with optional chaining"],
        correctIndex: 1,
      },
      {
        id: "js-13",
        question: "Which is preferred: async/await or raw promise chains?",
        options: ["Raw .then() chains", "async/await or asyncPipe", "Callbacks", "Observables only"],
        correctIndex: 1,
      },
      {
        id: "js-14",
        question: "How should code be organized?",
        options: ["By technical type (all utils together)", "By feature", "Alphabetically", "By file size"],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "aidd",
    title: "AIDD",
    description: "AI Driven Development philosophy and manifesto",
    explainer: `AIDD (AI Driven Development) is a philosophy for building AI-native software. The AIDD Manifesto emphasizes treating AI as collaborators and investing in people and repeatable, evolving processes.

**We value:**
- Clean code over needless fluff
- Demos over deadlines
- Repeatable systems over one-off prompts
- Fast delivery in small iterative steps over long stealth builds
- Exploration and adaptability over rigid interfaces
- Accessible design over legal retainers
- Secure defaults over incident response
- Prototypes and user testing over wireframes and dreams

The manifesto embraces the art, craft, and imagination of intelligent machines to build a better future.`,
    questions: [
      {
        id: "aidd-1",
        question: "What does AIDD stand for?",
        options: ["Automated Integration Development Delivery", "AI Driven Development", "Artificial Intelligence Data Design", "Agile Iterative Design Development"],
        correctIndex: 1,
      },
      {
        id: "aidd-2",
        question: "What does AIDD prioritize over deadlines?",
        options: ["Documentation", "Demos", "Design specs", "Deployment"],
        correctIndex: 1,
      },
      {
        id: "aidd-3",
        question: "AIDD values repeatable systems over what?",
        options: ["Automation", "One-off prompts", "Manual processes", "Cloud services"],
        correctIndex: 1,
      },
      {
        id: "aidd-4",
        question: "How should AI be treated in AIDD?",
        options: ["As tools to automate tasks", "As collaborators", "As replacements for developers", "As optional assistants"],
        correctIndex: 1,
      },
      {
        id: "aidd-5",
        question: "What does AIDD prefer over wireframes and dreams?",
        options: ["Detailed specs", "Prototypes and user testing", "Code reviews", "Sprint planning"],
        correctIndex: 1,
      },
      {
        id: "aidd-6",
        question: "AIDD favors secure defaults over what?",
        options: ["Complex configurations", "Incident response", "Manual security audits", "Third-party auth"],
        correctIndex: 1,
      },
      {
        id: "aidd-7",
        question: "What delivery approach does AIDD prefer?",
        options: ["Big bang releases", "Fast delivery in small iterative steps", "Waterfall milestones", "Quarterly releases"],
        correctIndex: 1,
      },
      {
        id: "aidd-8",
        question: "AIDD values exploration and adaptability over what?",
        options: ["Documentation", "Rigid interfaces", "Test coverage", "Code reuse"],
        correctIndex: 1,
      },
      {
        id: "aidd-9",
        question: "What does AIDD prioritize over needless fluff?",
        options: ["Verbose documentation", "Clean code", "Feature completeness", "Comments"],
        correctIndex: 1,
      },
      {
        id: "aidd-10",
        question: "AIDD favors accessible design over what?",
        options: ["Mobile-first", "Legal retainers", "Dark mode", "Animations"],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "sudolang",
    title: "SudoLang",
    description: "Pseudocode programming language for LLMs",
    explainer: `SudoLang is a pseudocode programming language designed for prompting Large Language Models. Created by Eric Elliott, it combines natural language with programming constructs to instruct AI effectively.

**Key features:**
- Variables, conditionals, for-each loops, while loops, logical operators
- Function pipe operator for composition
- Constraints to enforce rules on data and logic
- Tunable function inference (AI infers undefined functions)
- Can be transpiled to JavaScript and other languages

**Use cases:**
- Express complex tasks in natural language-like syntax
- Specify rough designs for transpilation to traditional languages
- Create programs that leverage LLM capabilities
- Author Autodux dux objects (e.g., \`TodoDux |> transpile(JavaScript)\`)`,
    questions: [
      {
        id: "sudo-1",
        question: "Who created SudoLang?",
        options: ["Andrej Karpathy", "Eric Elliott", "Dan Abramov", "Guido van Rossum"],
        correctIndex: 1,
      },
      {
        id: "sudo-2",
        question: "SudoLang is designed primarily for what?",
        options: ["Web browsers", "Large Language Models", "Mobile apps", "Databases"],
        correctIndex: 1,
      },
      {
        id: "sudo-3",
        question: "What can SudoLang programs be transpiled to?",
        options: ["Only Python", "JavaScript and other languages", "Only assembly", "Binary only"],
        correctIndex: 1,
      },
      {
        id: "sudo-4",
        question: "What feature allows AI to infer functions not explicitly defined?",
        options: ["Type inference", "Tunable function inference", "JIT compilation", "Dynamic linking"],
        correctIndex: 1,
      },
      {
        id: "sudo-5",
        question: "SudoLang includes a function ___ operator for composition.",
        options: ["compose", "pipe", "chain", "bind"],
        correctIndex: 1,
      },
      {
        id: "sudo-6",
        question: "What do SudoLang constraints enforce?",
        options: ["Memory limits", "Rules and requirements on data and logic", "Syntax only", "Network timeouts"],
        correctIndex: 1,
      },
      {
        id: "sudo-7",
        question: "SudoLang combines natural language with what?",
        options: ["Machine code", "Programming constructs", "SQL queries", "Regex patterns"],
        correctIndex: 1,
      },
      {
        id: "sudo-8",
        question: "Autodux dux objects are often authored in what format?",
        options: ["JSON", "SudoLang", "YAML", "XML"],
        correctIndex: 1,
      },
      {
        id: "sudo-9",
        question: "SudoLang supports which loop type?",
        options: ["Only for loops", "For-each and while loops", "Only recursion", "No loops"],
        correctIndex: 1,
      },
      {
        id: "sudo-10",
        question: "The transpile command converts SudoLang to JavaScript. Example: TodoDux |> ___",
        options: ["compile(JS)", "transpile(JavaScript)", "convert(JS)", "export(JS)"],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "react",
    title: "React",
    description: "React patterns from the project stack",
    explainer: `The project uses React with strict architectural patterns from the stack rules:

**Container/Presentation Pattern:**
- Use when you need persisted state
- Containers never contain direct UI markup—they import and use presentation components
- Containers NEVER contain business logic
- Use react-redux connect to wire actions and selectors to presentation components

**Separation of concerns:**
- State management, UI, and side-effects live in different modules
- Redux-saga handles side effects
- Containers are thin wiring layers between Redux and presentational components`,
    questions: [
      {
        id: "react-1",
        question: "When should the container/presentation pattern be used?",
        options: ["For all components", "When you need persisted state", "Only for forms", "Never in this project"],
        correctIndex: 1,
      },
      {
        id: "react-2",
        question: "Where should business logic live?",
        options: ["In container components", "In presentation components", "Not in containers—use connect to wire logic", "In CSS files"],
        correctIndex: 2,
      },
      {
        id: "react-3",
        question: "What should containers never contain?",
        options: ["Import statements", "Direct UI markup", "Function components", "JSX syntax"],
        correctIndex: 1,
      },
      {
        id: "react-4",
        question: "How are actions and selectors connected to presentation components?",
        options: ["Via context", "react-redux connect", "Prop drilling", "useState only"],
        correctIndex: 1,
      },
      {
        id: "react-5",
        question: "Where should side effects be handled?",
        options: ["In presentation components", "redux-saga", "useEffect only", "In containers"],
        correctIndex: 1,
      },
      {
        id: "react-6",
        question: "What should containers import and use?",
        options: ["Business logic modules", "Presentation components", "CSS directly", "API clients only"],
        correctIndex: 1,
      },
      {
        id: "react-7",
        question: "State management, UI, and side-effects should be in ___ modules.",
        options: ["The same", "Different", "One shared", "Nested"],
        correctIndex: 1,
      },
      {
        id: "react-8",
        question: "Containers wire Redux to presentation components via ___.",
        options: ["Props only", "connect (mapStateToProps, mapDispatchToProps)", "useContext", "Custom hooks only"],
        correctIndex: 1,
      },
      {
        id: "react-9",
        question: "Presentation components receive data through ___.",
        options: ["Direct store access", "Props from containers", "Global variables", "LocalStorage"],
        correctIndex: 1,
      },
      {
        id: "react-10",
        question: "Redux Toolkit is ___ in this stack.",
        options: ["Required", "Avoided—use Autodux instead", "Optional", "Used with connect"],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "nextjs",
    title: "Next.js",
    description: "Next.js framework and deployment",
    explainer: `Next.js powers this project as the React framework. Key aspects:

**Stack:**
- Next.js with App Router
- Deployed on Vercel
- Uses next/font for optimized fonts (Geist, Geist Mono)
- Tailwind CSS for styling

**Conventions:**
- App directory structure (app/page.tsx, app/layout.tsx)
- Metadata export for SEO
- Built-in Image component for optimization
- Server and client components where appropriate`,
    questions: [
      {
        id: "next-1",
        question: "Where is this project typically deployed?",
        options: ["AWS", "Vercel", "Netlify", "Heroku"],
        correctIndex: 1,
      },
      {
        id: "next-2",
        question: "Which directory structure does Next.js App Router use?",
        options: ["pages/", "app/", "src/pages/", "routes/"],
        correctIndex: 1,
      },
      {
        id: "next-3",
        question: "Next.js provides an optimized ___ component for images.",
        options: ["img", "Image", "Picture", "Photo"],
        correctIndex: 1,
      },
      {
        id: "next-4",
        question: "next/font is used for what?",
        options: ["Animations", "Optimizing and loading fonts", "Dark mode", "Icons"],
        correctIndex: 1,
      },
      {
        id: "next-5",
        question: "Root layout and page live in which files?",
        options: ["index.tsx and App.tsx", "app/layout.tsx and app/page.tsx", "pages/_app and index", "src/App and Main"],
        correctIndex: 1,
      },
      {
        id: "next-6",
        question: "Metadata for SEO is exported from where?",
        options: ["config.js", "The layout or page component", "next.config only", "env files"],
        correctIndex: 1,
      },
      {
        id: "next-7",
        question: "Next.js supports both server and ___ components.",
        options: ["Static", "Client", "API", "Middleware"],
        correctIndex: 1,
      },
      {
        id: "next-8",
        question: "Dynamic routes use the [___] folder convention.",
        options: ["param", "slug", "id", "dynamic"],
        correctIndex: 1,
      },
      {
        id: "next-9",
        question: "Which styling approach does this project use?",
        options: ["CSS Modules only", "Tailwind CSS", "Styled-components", "Emotion"],
        correctIndex: 1,
      },
      {
        id: "next-10",
        question: "The root layout wraps all pages and provides ___.",
        options: ["API routes", "HTML structure and fonts", "Database connection", "Auth only"],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "aidd-framework",
    title: "aidd framework",
    description: "The npm package for AI Driven Development",
    explainer: `The aidd npm package is the standard framework for AI Driven Development. Install with \`npm install aidd\`.

**Key components:**
- **AIDD CLI** – project bootstrap and automation
- **Agent Runtime** – workflows from product discovery to commit and release
- **SudoLang Prompt Language** – typed pseudocode for AI orchestration
- **Server Framework** – composable backend for Node and Next.js
- **Utilities & Component Library** – common patterns and reusable recipes

**Source:**
- MIT-licensed, open source
- Maintained by Parallel Drive
- Available on npm (e.g., aidd@2.5.0)`,
    questions: [
      {
        id: "aidd-fw-1",
        question: "How do you install the aidd package?",
        options: ["yarn add aidd", "npm install aidd", "pnpm add aidd", "All of the above"],
        correctIndex: 3,
      },
      {
        id: "aidd-fw-2",
        question: "What does the AIDD CLI provide?",
        options: ["Only linting", "Project bootstrap and automation", "Database migrations", "Docker configs"],
        correctIndex: 1,
      },
      {
        id: "aidd-fw-3",
        question: "The Agent Runtime handles workflows from ___ to commit and release.",
        options: ["Design", "Product discovery", "Testing", "Documentation"],
        correctIndex: 1,
      },
      {
        id: "aidd-fw-4",
        question: "The aidd framework includes SudoLang for what?",
        options: ["Database queries", "Typed pseudocode for AI orchestration", "CSS styling", "Testing"],
        correctIndex: 1,
      },
      {
        id: "aidd-fw-5",
        question: "The Server Framework supports which runtimes?",
        options: ["Python only", "Node and Next.js", "Go only", "Rust only"],
        correctIndex: 1,
      },
      {
        id: "aidd-fw-6",
        question: "Who maintains the aidd package?",
        options: ["Vercel", "Parallel Drive", "OpenAI", "Meta"],
        correctIndex: 1,
      },
      {
        id: "aidd-fw-7",
        question: "What license is aidd released under?",
        options: ["GPL", "Apache", "MIT", "Proprietary"],
        correctIndex: 2,
      },
      {
        id: "aidd-fw-8",
        question: "The aidd framework bin is typically invoked as ___.",
        options: ["aidd run", "aidd", "npx aidd", "node aidd"],
        correctIndex: 1,
      },
      {
        id: "aidd-fw-9",
        question: "Utilities & Component Library provides ___.",
        options: ["Database schemas", "Common patterns and reusable recipes", "Cloud configs", "Mobile SDKs"],
        correctIndex: 1,
      },
      {
        id: "aidd-fw-10",
        question: "aidd is described as the standard framework for ___.",
        options: ["Testing", "AI Driven Development", "DevOps", "Design systems"],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "js-closures-scope",
    title: "Closures & scope",
    description: "Lexical scope, closures, and common pitfalls (great for React hooks)",
    explainer: `**Lexical scope** means where a variable is visible is determined by where it is written in source code, not where a function runs.

**A closure** is a function that "closes over" variables from an outer scope and keeps access to them after the outer function returns.

**Why it matters in UIs:** effects, callbacks, and timers often capture values from render. If you do not list dependencies correctly (React) or misunderstand stale closures, you see "old" state.

**Classic pitfall:** \`var\` in a loop shares one binding; \`let\` creates a new binding per iteration. Another: assuming an async callback sees the latest variable without reading it from a ref or passing it in.`,
    questions: [
      {
        id: "cls-1",
        question: "Lexical scope is determined primarily by ___ in the source code.",
        options: ["Where the function is called", "Where variables and blocks are written", "The call stack at runtime", "The module bundler"],
        correctIndex: 1,
      },
      {
        id: "cls-2",
        question: "A closure allows an inner function to ___ variables from an outer scope after the outer function has finished.",
        options: ["Delete", "Retain access to", "Reassign only in strict mode", "Optimize away"],
        correctIndex: 1,
      },
      {
        id: "cls-3",
        question: "In a for-loop, why does `let` often behave more predictably than `var` for callbacks?",
        options: [
          "`let` is faster",
          "`let` creates a new binding per iteration; `var` shares one loop-scoped binding",
          "`var` is not hoisted",
          "Browsers ignore `var` in loops",
        ],
        correctIndex: 1,
      },
      {
        id: "cls-4",
        question: 'What does this typically log? `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }`',
        options: ["0, 1, 2", "3, 3, 3", "undefined three times", "It throws"],
        correctIndex: 1,
      },
      {
        id: "cls-5",
        question: "A \"stale closure\" in UI code usually means ___",
        options: [
          "The network response expired",
          "A callback captured an old value of state or props",
          "The CSS class name is wrong",
          "The bundle hash changed",
        ],
        correctIndex: 1,
      },
      {
        id: "cls-6",
        question: "Module scope (ES modules) means top-level `let` at file top is ___",
        options: ["Global on `window`", "Private to that module, not visible to other files by default", "Shared with all imports", "Only visible in development"],
        correctIndex: 1,
      },
      {
        id: "cls-7",
        question: "When a function returns another function, the inner function forms a closure over ___",
        options: ["Only globals", "The outer function's variables it references", "Only arguments passed to the inner function", "Nothing; closures are a TypeScript feature"],
        correctIndex: 1,
      },
      {
        id: "cls-8",
        question: "`function outer() { const x = 1; return () => x; }` — calling the returned function twice reads ___",
        options: [
          "A new `x` each time",
          "The same captured `x` from the `outer` invocation that created it",
          "Always `undefined`",
          "An error because `x` was garbage-collected",
        ],
        correctIndex: 1,
      },
      {
        id: "cls-9",
        question: "Compared to Vue’s Composition API, React hooks rely heavily on understanding ___",
        options: ["Only CSS", "Closure and render-cycle semantics", "Only the virtual DOM", "Webpack configuration"],
        correctIndex: 1,
      },
      {
        id: "cls-10",
        question: "An IIFE (immediately invoked function expression) was historically used to ___",
        options: [
          "Speed up promises",
          "Create a new scope to avoid polluting the global namespace",
          "Enable TypeScript",
          "Replace `async`/`await`",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "async-promises",
    title: "Async & Promises",
    description: "Promise chains, async/await, and parallel vs sequential work",
    explainer: `A **Promise** represents a value that may be available later. **\`.then()\`** returns a new Promise; if you return a non-thenable value, it wraps it. That is why "double \`.then()\`" often means the first step returns something you must unwrap in the second.

**\`async\` functions** always return a Promise. **\`await\`** pauses the async function until the Promise settles.

**\`Promise.all\`** fails fast if any input rejects. **\`Promise.allSettled\`** waits for all. Use parallel fetches when requests are independent; use sequential \`await\` when order matters or the second call depends on the first.

**Race conditions** in UIs often mean overlapping async work: cancel, ignore stale responses, or use an abort controller / latest-request id.`,
    questions: [
      {
        id: "asy-1",
        question: "Calling `.then(fn)` on a Promise returns ___",
        options: ["The same Promise unchanged", "A new Promise (chain)", "`undefined`", "A synchronous value only"],
        correctIndex: 1,
      },
      {
        id: "asy-2",
        question: "If the first `.then()` returns another Promise, the next `.then()` receives ___",
        options: [
          "The Promise object itself",
          "The settled value of that inner Promise (once it resolves)",
          "Always `null`",
          "An error immediately",
        ],
        correctIndex: 1,
      },
      {
        id: "asy-3",
        question: "An `async` function always returns ___",
        options: ["A plain object", "A Promise", "void", "A generator"],
        correctIndex: 1,
      },
      {
        id: "asy-4",
        question: "`Promise.all([p1, p2])` resolves when ___",
        options: [
          "The first of p1 or p2 settles",
          "All promises fulfill; if any rejects, the whole thing rejects",
          "Half of them complete",
          "Only when called with await",
        ],
        correctIndex: 1,
      },
      {
        id: "asy-5",
        question: "`Promise.allSettled` is useful when you need results from ___",
        options: [
          "Only the first fulfillment",
          "Every promise, whether fulfilled or rejected",
          "Only rejected promises",
          "Synchronous callbacks",
        ],
        correctIndex: 1,
      },
      {
        id: "asy-6",
        question: "To avoid overlapping fetches updating state out of order, a common pattern is ___",
        options: [
          "Use `var` for flags",
          "Track request id / ignore stale responses / AbortController",
          "Always use `Promise.race` only",
          "Disable the network tab",
        ],
        correctIndex: 1,
      },
      {
        id: "asy-7",
        question: "`await` can only be used inside ___",
        options: ["Any function", "An async function or at the top level of a module (where supported)", "Only class methods", "Only `.then` callbacks"],
        correctIndex: 1,
      },
      {
        id: "asy-8",
        question: "Unhandled Promise rejections in the browser typically ___",
        options: [
          "Are silently ignored",
          "Show as errors / warnings in the console (and may crash Node in strict setups)",
          "Auto-retry forever",
          "Convert to sync exceptions in the same tick",
        ],
        correctIndex: 1,
      },
      {
        id: "asy-9",
        question: "Sequential `await` in a loop (one after another) is appropriate when ___",
        options: [
          "You want maximum parallelism",
          "Each step depends on the previous result or order must be guaranteed",
          "You use only `Promise.all`",
          "You never need error handling",
        ],
        correctIndex: 1,
      },
      {
        id: "asy-10",
        question: "`Promise.race` resolves or rejects with ___",
        options: [
          "The sum of all durations",
          "The outcome of whichever promise settles first",
          "Only if all fulfill",
          "Always the last promise",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "http-fetch",
    title: "HTTP & fetch",
    description: "Status codes, headers, CORS, and the browser security model",
    explainer: `**REST** over HTTP often uses **GET** (read), **POST** (create / actions), **PUT/PATCH** (update), **DELETE** (remove)—exact semantics depend on the API.

**Status codes:** \`2xx\` success (\`200\` OK, \`201\` created, \`204\` no content). \`3xx\` redirects. \`4xx\` client errors (\`400\` bad request, \`401\` unauthorized, \`403\` forbidden, \`404\` not found). \`5xx\` server errors.

**CORS** is enforced by the browser: cross-origin requests need server cooperation (appropriate \`Access-Control-*\` headers). **Preflight** \`OPTIONS\` requests happen for some "non-simple" cross-origin requests.

**\`fetch\`** returns a Promise resolving to a **Response**; check \`response.ok\` (\`status\` 200–299) before assuming success. Use \`response.json()\` etc. to read the body.`,
    questions: [
      {
        id: "hweb-1",
        question: "HTTP status codes in the 4xx range generally indicate ___",
        options: ["Server crashed", "A problem with the client request or authorization", "Success with warnings", "DNS failure only"],
        correctIndex: 1,
      },
      {
        id: "hweb-2",
        question: "`404 Not Found` most often means ___",
        options: ["Server error", "The resource path does not exist (for that method)", "Rate limited", "CORS blocked"],
        correctIndex: 1,
      },
      {
        id: "hweb-3",
        question: "`500 Internal Server Error` indicates ___",
        options: [
          "The client sent bad JSON",
          "Something went wrong on the server",
          "The response was cached",
          "The request was cancelled",
        ],
        correctIndex: 1,
      },
      {
        id: "hweb-4",
        question: "CORS is primarily enforced by ___",
        options: ["The database", "The browser", "TCP", "Git"],
        correctIndex: 1,
      },
      {
        id: "hweb-5",
        question: "A cross-origin request that triggers a CORS preflight typically uses ___ before the real request",
        options: ["GET", "OPTIONS", "TRACE", "CONNECT"],
        correctIndex: 1,
      },
      {
        id: "hweb-6",
        question: "After `const r = await fetch(url)`, you should check success with ___",
        options: [
          "Only `r.status === 200` (never use `.ok`)",
          "`r.ok` or inspect `r.status`, then parse the body",
          "`r.json()` always throws on error",
          "`fetch` throws on 404 automatically",
        ],
        correctIndex: 1,
      },
      {
        id: "hweb-7",
        question: "`Authorization` headers for bearer tokens are often sent on ___",
        options: [
          "Only WebSocket handshakes",
          "Authenticated API requests (when the app chooses to include them)",
          "Every favicon request",
          "DNS lookups",
        ],
        correctIndex: 1,
      },
      {
        id: "hweb-8",
        question: "`204 No Content` commonly means ___",
        options: [
          "The server is offline",
          "Success with no response body",
          "Client must retry forever",
          "Invalid JSON",
        ],
        correctIndex: 1,
      },
      {
        id: "hweb-9",
        question: "Idempotent HTTP methods (safe retries) often include ___",
        options: ["POST for all APIs", "GET and PUT (among others, depending on API design)", "Only WebSocket", "GraphQL only"],
        correctIndex: 1,
      },
      {
        id: "hweb-10",
        question: "Request headers like `Content-Type: application/json` tell the server ___",
        options: [
          "Which CSS file to load",
          "How to interpret the request body",
          "The user's password in plain text",
          "Which database row to delete",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "web-performance",
    title: "Web performance",
    description: "Metrics, networks, bundles, and when optimization matters",
    explainer: `**Measure before optimizing.** Use DevTools Network (waterfall), Performance panel, and field data when available.

**Core Web Vitals** include **LCP** (largest contentful paint—loading performance), **INP** (interaction to next paint—responsiveness), **CLS** (cumulative layout shift—visual stability).

**Common wins:** fewer sequential network dependencies, compress images, lazy-load below-the-fold content, avoid huge JS bundles on first paint, use caching headers intentionally.

**Premature optimization** is tuning code before you know the bottleneck; profiling shows whether CPU, network, or layout dominates.`,
    questions: [
      {
        id: "perf-1",
        question: "LCP (Largest Contentful Paint) primarily measures ___",
        options: ["Time to first byte only", "When the largest visible content element paints", "JavaScript parse time only", "Server CPU usage"],
        correctIndex: 1,
      },
      {
        id: "perf-2",
        question: "CLS (Cumulative Layout Shift) captures ___",
        options: [
          "How many API calls failed",
          "Unexpected layout movement after content loads",
          "Time spent in React render",
          "Lighthouse score only",
        ],
        correctIndex: 1,
      },
      {
        id: "perf-3",
        question: "A long network waterfall often suggests ___",
        options: [
          "Too many sequential requests blocking later work",
          "That CSS is unnecessary",
          "That you must delete React",
          "That HTTP/2 is disabled everywhere",
        ],
        correctIndex: 0,
      },
      {
        id: "perf-4",
        question: "Code-splitting (dynamic `import()`) helps by ___",
        options: [
          "Removing TypeScript",
          "Loading some JS only when a route or feature needs it",
          "Making images smaller automatically",
          "Disabling the browser cache",
        ],
        correctIndex: 1,
      },
      {
        id: "perf-5",
        question: "`Promise.all` for independent API calls can improve perceived performance by ___",
        options: [
          "Running them in parallel instead of awaiting one by one",
          "Caching responses forever",
          "Eliminating CORS",
          "Reducing HTML size",
        ],
        correctIndex: 0,
      },
      {
        id: "perf-6",
        question: "Large images without sizing or responsive variants often hurt ___",
        options: ["Git history", "LCP and bandwidth", "ESLint", "pnpm lockfile"],
        correctIndex: 1,
      },
      {
        id: "perf-7",
        question: "Font loading strategies (e.g. `font-display`, subsetting) mainly target ___",
        options: [
          "Database indexes",
          "Invisible text / layout shifts / late swaps",
          "GraphQL complexity",
          "npm peer dependencies",
        ],
        correctIndex: 1,
      },
      {
        id: "perf-8",
        question: "Profiling before micro-optimizing loops follows the principle of ___",
        options: ["YAGNI", "Measuring real bottlenecks vs guessing", "Using only `var`", "Avoiding all frameworks"],
        correctIndex: 1,
      },
      {
        id: "perf-9",
        question: "Serving static assets with long cache lifetimes works best when ___",
        options: [
          "Filenames never change",
          "Filenames are content-hashed so updates bust cache safely",
          "You disable HTTPS",
          "You use only inline scripts",
        ],
        correctIndex: 1,
      },
      {
        id: "perf-10",
        question: "Main-thread long tasks can hurt ___",
        options: [
          "Only server-side rendering on Node",
          "Interactivity and INP (input responsiveness)",
          "DNS prefetch only",
          "Git merge speed",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "frontend-architecture",
    title: "Front-end architecture",
    description: "Boundaries, data flow, and structuring larger UIs",
    explainer: `**Separation of concerns:** keep UI rendering, application state, and side effects (I/O) in clear boundaries. Exactly how depends on the framework.

**Data layer:** centralize HTTP clients, error handling, and types instead of scattering raw \`fetch\` in every component.

**State placement:** URL for shareable location, server cache for remote data, local component state for ephemeral UI, global stores only when multiple distant components must stay in sync.

**Vue vs React (mental model):** Vue’s SFCs + Composition API vs React’s components + hooks solve similar problems; both need predictable data flow and testable modules.

**Colocation:** keep feature code together (components, hooks, tests) rather than giant technical folders that obscure features.`,
    questions: [
      {
        id: "arch-1",
        question: "A dedicated API module (single place for `fetch` + error mapping) primarily improves ___",
        options: [
          "CSS specificity",
          "Consistency, testability, and easier refactors of network code",
          "npm install speed",
          "Database migrations",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-2",
        question: "Putting shareable navigation state in the URL (pathname, query) helps with ___",
        options: [
          "Hiding bugs",
          "Bookmarking, sharing, and back/forward behavior",
          "Avoiding TypeScript",
          "Disabling accessibility",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-3",
        question: "Presentation (dumb) components are easiest to test when they ___",
        options: [
          "Fetch data internally",
          "Receive data via props and emit changes via callbacks",
          "Import the global store directly",
          "Contain routing logic",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-4",
        question: "Global client state stores are most justified when ___",
        options: [
          "You have one button",
          "Many distant parts of the UI must reflect the same data",
          "You dislike props",
          "The app has no routes",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-5",
        question: "Colocating feature code (UI + hooks + tests nearby) tends to improve ___",
        options: [
          "Merge conflicts only in `node_modules`",
          "Discoverability and feature cohesion vs giant folders by file type",
          "CORS configuration",
          "Server CPU",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-6",
        question: "Side effects (timers, subscriptions, manual DOM) fit best in ___",
        options: [
          "Random utility files with no lifecycle",
          "Framework-provided effect or lifecycle hooks with clear setup/teardown",
          "JSX return values",
          "CSS files",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-7",
        question: "Duplicated request logic across many components is often a sign you need ___",
        options: [
          "More inline styles",
          "A shared data layer or composable / hook",
          "A larger bundle",
          "Slower laptops",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-8",
        question: "In many apps, \"container\" vs \"presentational\" separation aims to ___",
        options: [
          "Remove HTML",
          "Keep wiring and I/O out of purely visual components",
          "Avoid using functions",
          "Disable server rendering",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-9",
        question: "Moving from Vue to React, concepts like composables map most closely to ___",
        options: [
          "Only class components",
          "Hooks and custom hooks for shared stateful logic",
          "Redux only",
          "WebAssembly",
        ],
        correctIndex: 1,
      },
      {
        id: "arch-10",
        question: "Architecture reviews often ask whether a module has ___",
        options: [
          "More lines than others",
          "A clear responsibility and stable boundaries with neighbors",
          "Zero dependencies",
          "Only default exports",
        ],
        correctIndex: 1,
      },
    ],
  },
];

/**
 * Returns the module matching the given slug, or undefined if not found.
 */
export function getModuleBySlug(slug: string): QuizModule | undefined {
  return modules.find((m) => m.slug === slug);
}
