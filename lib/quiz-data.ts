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

/**
 * Returns a random subset of questions from the pool. Uses seed for reproducible selection.
 * @param questions - Full question pool
 * @param count - Number of questions to return (default 10)
 * @param seed - Optional seed for deterministic selection
 */
export function getRandomQuestions(
  questions: QuizQuestion[],
  count: number = 10,
  seed?: number
): QuizQuestion[] {
  if (questions.length <= count) return questions;
  return shuffle(questions, seed).slice(0, count);
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
];

/**
 * Returns the module matching the given slug, or undefined if not found.
 */
export function getModuleBySlug(slug: string): QuizModule | undefined {
  return modules.find((m) => m.slug === slug);
}
