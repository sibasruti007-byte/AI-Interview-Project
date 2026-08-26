const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/env');
const logger = require('../utils/logger');

// Models
const User = require('../models/User');
const Question = require('../models/Question');
const Category = require('../models/Category');
const JobRole = require('../models/JobRole');
const AIPrompt = require('../models/AIPrompt');
const Interview = require('../models/Interview');
const Answer = require('../models/Answer');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const Bookmark = require('../models/Bookmark');

const jobRolesSeed = [
  {
    name: 'Frontend Developer',
    description: 'Specializes in user interfaces, responsive layouts, web performance, and state management.',
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Web Vitals'],
    experienceRanges: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'],
    icon: 'Layout'
  },
  {
    name: 'Backend Developer',
    description: 'Designs scalable REST APIs, microservices, databases, authentication, and background workers.',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'Security'],
    experienceRanges: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'],
    icon: 'Server'
  },
  {
    name: 'Full Stack Developer',
    description: 'Engineers complete end-to-end web products spanning modern UI frameworks and scalable backends.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Git', 'REST API', 'System Design'],
    experienceRanges: ['Fresher', '1-3 years', '3-5 years', '5+ years'],
    icon: 'Layers'
  },
  {
    name: 'MERN Stack Developer',
    description: 'Expertise in MongoDB, Express.js, React.js, and Node.js for rapid modern SaaS development.',
    skills: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT', 'Redux Toolkit', 'Mongoose'],
    experienceRanges: ['Fresher', '0-1 years', '1-3 years', '3-5 years'],
    icon: 'Code'
  },
  {
    name: 'React Developer',
    description: 'Specializes in component architectures, custom hooks, performance profiling, and Next.js.',
    skills: ['React', 'Next.js', 'Redux', 'Zustand', 'React Query', 'CSS-in-JS', 'Jest'],
    experienceRanges: ['Fresher', '1-3 years', '3-5 years', '5+ years'],
    icon: 'Atom'
  },
  {
    name: 'Node.js Developer',
    description: 'Focused on high-concurrency event-driven architectures, streams, clustering, and API optimization.',
    skills: ['Node.js', 'Express', 'Fastify', 'NestJS', 'Microservices', 'Message Queues', 'SQL/NoSQL'],
    experienceRanges: ['1-3 years', '3-5 years', '5+ years'],
    icon: 'Cpu'
  },
  {
    name: 'Software Engineer',
    description: 'Generalist engineering high-availability distributed systems, algorithms, and clean architecture.',
    skills: ['Algorithms', 'Data Structures', 'System Design', 'OOP', 'Clean Code', 'Git', 'CI/CD'],
    experienceRanges: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'],
    icon: 'Terminal'
  },
  {
    name: 'JavaScript Developer',
    description: 'Deep mastery of ECMAScript standards, asynchronous programming, engines, and browser internals.',
    skills: ['JavaScript ES6+', 'V8 Engine', 'Event Loop', 'Async/Await', 'DOM APIs', 'WebSockets'],
    experienceRanges: ['Fresher', '0-1 years', '1-3 years', '3-5 years'],
    icon: 'FileCode'
  },
  {
    name: 'Python Developer',
    description: 'Backend web development, automation scripting, data processing, and API design with Python.',
    skills: ['Python', 'FastAPI', 'Django', 'Flask', 'PostgreSQL', 'Docker', 'PyTest'],
    experienceRanges: ['Fresher', '1-3 years', '3-5 years', '5+ years'],
    icon: 'Binary'
  },
  {
    name: 'Data Analyst',
    description: 'Extracts insights from structured/unstructured datasets, SQL querying, dashboards, and storytelling.',
    skills: ['SQL', 'Python', 'Pandas', 'Tableau', 'PowerBI', 'Statistics', 'Excel'],
    experienceRanges: ['Fresher', '0-1 years', '1-3 years', '3-5 years'],
    icon: 'BarChart3'
  },
  {
    name: 'DevOps Engineer',
    description: 'Automates deployment pipelines, cloud infrastructure, container orchestration, and reliability.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Prometheus', 'Linux'],
    experienceRanges: ['1-3 years', '3-5 years', '5+ years'],
    icon: 'Cloud'
  },
  {
    name: 'QA Engineer',
    description: 'Ensures software quality with automated test suites, end-to-end testing, and performance testing.',
    skills: ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Postman', 'Test Automation', 'API Testing'],
    experienceRanges: ['Fresher', '0-1 years', '1-3 years', '3-5 years'],
    icon: 'CheckCircle'
  }
];

const categoriesSeed = [
  { name: 'JavaScript', description: 'Core JS, ES6+, prototypes, async execution, closures, event loop, and DOM.' },
  { name: 'React', description: 'Components, hooks, reconciliation, state management, suspense, and rendering performance.' },
  { name: 'Node.js', description: 'Asynchronous I/O, event emitters, streams, clustering, and server architectures.' },
  { name: 'Express', description: 'Middleware lifecycle, routing, error handling, security headers, and REST conventions.' },
  { name: 'MongoDB', description: 'Document schema design, aggregation pipelines, B-tree indexing, and transactions.' },
  { name: 'HTML', description: 'Semantic HTML5, accessibility (a11y), SEO tags, web standards, and forms.' },
  { name: 'CSS', description: 'Flexbox, CSS Grid, animations, responsive breakpoints, Tailwind, and CSS architecture.' },
  { name: 'TypeScript', description: 'Generics, union types, type narrowing, interfaces, utility types, and compiler config.' },
  { name: 'REST API', description: 'HTTP verbs, status codes, idempotency, caching, pagination, rate limiting, and security.' },
  { name: 'Git', description: 'Branching models, rebasing, merge strategies, cherry-pick, stashing, and conflict resolution.' },
  { name: 'DSA', description: 'Arrays, Hashmaps, Trees, Graphs, Dynamic Programming, Big-O analysis, and sorting.' },
  { name: 'System Design', description: 'Scalability, load balancing, caching, database sharding, message queues, and microservices.' },
  { name: 'Behavioral', description: 'Leadership, conflict management, STAR framework, teamwork, and accountability.' },
  { name: 'HR', description: 'Career motivations, cultural alignment, compensation expectations, and work style.' }
];

// Helper to generate 100+ high quality realistic questions across categories
const generateQuestionBank = () => {
  const qList = [
    // === JavaScript (10) ===
    {
      question: 'Explain JavaScript closures and provide a practical real-world scenario where you would use one.',
      category: 'JavaScript',
      role: 'JavaScript Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Lexical scoping', 'Function bundling with environment', 'Data encapsulation / private variables', 'Memory retention'],
      evaluationCriteria: ['Accurate definition of closure', 'Understanding of outer scope variable access after outer function returns', 'Real-world example like memoization or private state'],
      idealAnswerPoints: ['A closure is a function bundled with references to its surrounding state (lexical environment).', 'Practical uses: module pattern for private state, memoization caches, currying/partial application, and event handler state preservation.'],
      tags: ['JavaScript', 'Closures', 'Scope']
    },
    {
      question: 'How does the JavaScript Event Loop handle Promises vs setTimeout? Walk through microtasks and macrotasks.',
      category: 'JavaScript',
      role: 'Frontend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Call Stack', 'Web APIs', 'Microtask Queue', 'Macrotask / Task Queue', 'Starvation prevention'],
      evaluationCriteria: ['Correct execution priority order', 'Identification of Promise.then/catch/finally as microtasks', 'Understanding that microtask queue is fully drained between macrotasks'],
      idealAnswerPoints: ['Sync code executes first on the call stack.', 'When stack is empty, engine processes ALL microtasks before moving to next macrotask.', 'setTimeout is a macrotask; Promise callbacks and queueMicrotask are microtasks.'],
      tags: ['JavaScript', 'EventLoop', 'Async']
    },
    {
      question: 'What is the difference between shallow copy and deep copy in JavaScript, and how do structuredClone and Object.assign behave?',
      category: 'JavaScript',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Reference copying vs value copying', 'Nested object mutation', 'Object.assign / spread operator', 'structuredClone() native API'],
      evaluationCriteria: ['Clear distinction between reference mutation vs deep duplication', 'Mention of circular reference handling in structuredClone', 'Limitations of JSON.stringify/parse for Dates, RegEx, and undefined'],
      idealAnswerPoints: ['Shallow copy copies first-level properties while nested objects still share memory references.', 'structuredClone() performs a deep recursive clone supporting circular refs, Dates, and Maps natively.'],
      tags: ['JavaScript', 'Objects', 'Memory']
    },
    {
      question: 'Explain Prototype Inheritance in JavaScript and how ES6 class syntax maps to prototype chains under the hood.',
      category: 'JavaScript',
      role: 'JavaScript Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['__proto__ and prototype property', 'Prototype chain lookup', 'Object.create()', 'Syntactic sugar of class and extends'],
      evaluationCriteria: ['Clear explanation of prototype delegation', 'Understanding that ES6 classes are syntactic sugar over prototypal inheritance', 'Performance benefit of methods on prototype vs instance'],
      idealAnswerPoints: ['Every JS object has an internal link to another object called its prototype.', 'Property lookups walk up the chain until found or reaching null.', 'ES6 class and extends compile down to Function.prototype manipulation.'],
      tags: ['JavaScript', 'Prototypes', 'OOP']
    },
    {
      question: 'What are WeakMap and WeakSet in JavaScript, and how do they aid garbage collection in memory management?',
      category: 'JavaScript',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Weak references', 'Garbage collection eligibility', 'Keys must be objects', 'Non-enumerable collection'],
      evaluationCriteria: ['Understanding that weak references do not prevent GC', 'Use cases such as private instance metadata and DOM node caching without memory leaks'],
      idealAnswerPoints: ['WeakMap keys must be objects and are weakly held.', 'If no other references to the key object exist, the entry is automatically garbage collected, preventing memory leaks.'],
      tags: ['JavaScript', 'Memory', 'GarbageCollection']
    },
    {
      question: 'Explain the difference between call(), apply(), and bind() in JavaScript.',
      category: 'JavaScript',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Explicit this binding', 'call accepts arguments list', 'apply accepts arguments array', 'bind returns a new bound function'],
      evaluationCriteria: ['Precise syntactic differences', 'Understanding immediate invocation vs deferred invocation'],
      idealAnswerPoints: ['call(thisArg, arg1, arg2) invokes immediately with comma-separated arguments.', 'apply(thisArg, [args]) invokes immediately with an array of arguments.', 'bind(thisArg, ...args) returns a new function with this permanently bound.'],
      tags: ['JavaScript', 'Functions', 'This']
    },
    {
      question: 'What is Hoisting in JavaScript, and how do var, let, const, and function declarations differ?',
      category: 'JavaScript',
      role: 'Software Engineer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Creation phase vs Execution phase', 'Temporal Dead Zone (TDZ)', 'Function declaration hoisting', 'Undefined vs ReferenceError'],
      evaluationCriteria: ['Explaining TDZ for let and const', 'Function declarations are fully hoisted with definition; function expressions are not'],
      idealAnswerPoints: ['Declarations are moved to the top of their scope during compilation.', 'var is hoisted and initialized to undefined.', 'let and const are hoisted but uninitialized, remaining in the Temporal Dead Zone until execution.'],
      tags: ['JavaScript', 'Hoisting', 'Scope']
    },
    {
      question: 'How do Async Generators and for-await-of loops work in modern JavaScript?',
      category: 'JavaScript',
      role: 'Node.js Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['async function*', 'yield keyword with Promises', 'AsyncIterator protocol', 'Streaming data consumption'],
      evaluationCriteria: ['Understanding pulling chunks asynchronously', 'Use cases with Node streams and paginated API pagination'],
      idealAnswerPoints: ['Async generators combine async/await with generator functions yielding Promises.', 'for-await-of iterates sequentially over async iterables, waiting for each Promise to resolve.'],
      tags: ['JavaScript', 'Async', 'Generators']
    },
    {
      question: 'Explain Debouncing and Throttling with practical use cases and code implementations.',
      category: 'JavaScript',
      role: 'Frontend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Rate limiting function execution', 'Timer reset on invocation (Debounce)', 'Interval execution (Throttle)', 'Window resize vs Auto-complete search'],
      evaluationCriteria: ['Clear distinction: debounce waits for quiet period; throttle ensures max 1 call per time window', 'Knowledge of edge cases like leading/trailing options'],
      idealAnswerPoints: ['Debouncing delays execution until N milliseconds have passed since last invocation (e.g. search input).', 'Throttling limits execution to at most once every N milliseconds (e.g. scroll and resize listeners).'],
      tags: ['JavaScript', 'Performance', 'DOM']
    },
    {
      question: 'What are JavaScript Proxies and Reflect API, and how are they used in reactive frameworks like Vue 3 and MobX?',
      category: 'JavaScript',
      role: 'Frontend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Proxy traps (get, set, deleteProperty)', 'Reflect forward methods', 'Metaprogramming', 'Reactivity dependency tracking'],
      evaluationCriteria: ['Understanding how Proxies intercept object operations', 'Why Reflect is used inside traps to maintain default behavior and correct receiver'],
      idealAnswerPoints: ['Proxy wraps an object and intercepts fundamental operations like reading and writing properties.', 'Modern reactive frameworks use get traps to collect dependencies and set traps to trigger re-renders.'],
      tags: ['JavaScript', 'Reactivity', 'Metaprogramming']
    },

    // === React (10) ===
    {
      question: 'Explain the difference between useMemo, useCallback, and React.memo. When should each be used or avoided?',
      category: 'React',
      role: 'React Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Memoized computation values', 'Memoized function reference stability', 'Higher-Order Component memoization', 'Overhead of memoization'],
      evaluationCriteria: ['Understanding reference equality in props', 'Knowing when premature memoization introduces overhead without benefit'],
      idealAnswerPoints: ['useMemo caches the result of an expensive calculation.', 'useCallback caches a function definition between renders to maintain reference equality for memoized children.', 'React.memo skips re-rendering a component if its props have not changed.'],
      tags: ['React', 'Hooks', 'Performance']
    },
    {
      question: 'How does React Fiber enable Concurrent Mode and time-slicing during heavy rendering updates?',
      category: 'React',
      role: 'React Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Fiber node data structure', 'Two-phase rendering (Render / Reconciliation vs Commit)', 'Work-in-progress tree', 'Prioritized lane model (useTransition / useDeferredValue)'],
      evaluationCriteria: ['Explaining how synchronous stack reconciler was replaced by interruptible unit-of-work Fiber', 'Understanding how user input receives higher priority than background renders'],
      idealAnswerPoints: ['Fiber is a virtual stack frame enabling React to pause, abort, or prioritize rendering work.', 'The render phase can be interrupted to handle high-priority browser events, while the commit phase remains synchronous.'],
      tags: ['React', 'Fiber', 'Architecture']
    },
    {
      question: 'What are Custom Hooks in React and what rules must you follow when creating and composing them?',
      category: 'React',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Reusable stateful logic extraction', 'Naming convention prefix (use)', 'Rules of Hooks (top level, inside React functions only)', 'State isolation across instances'],
      evaluationCriteria: ['Understanding that each hook call has completely isolated state', 'Writing clean composable logic like useFetch, useDebounce, useLocalStorage'],
      idealAnswerPoints: ['Custom hooks let you extract component logic into reusable functions.', 'Must follow Rules of Hooks: only call at top level, never conditionally or inside loops.', 'State inside custom hook is isolated per component instance.'],
      tags: ['React', 'CustomHooks', 'CleanCode']
    },
    {
      question: 'How does the useEffect dependency array work, and how do you prevent stale closures in interval or event listeners?',
      category: 'React',
      role: 'React Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Dependency array comparison (Object.is)', 'Stale closure trap', 'Functional state updates (setState(prev => prev + 1))', 'useRef for mutable values', 'Cleanup function lifecycle'],
      evaluationCriteria: ['Explaining why omitting dependencies causes stale state', 'Demonstrating functional setState or ref solutions without unnecessary effect re-executions'],
      idealAnswerPoints: ['useEffect captures variables from the render cycle it was created in.', 'Using functional updates prev => prev + 1 removes the state variable from dependencies and avoids stale closures.', 'Always return cleanup functions to cancel timers or subscriptions.'],
      tags: ['React', 'Hooks', 'Lifecycle']
    },
    {
      question: 'Compare Redux Toolkit, Zustand, and React Context API for global state management in production applications.',
      category: 'React',
      role: 'Full Stack Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Context re-rendering cascade', 'Selector-based subscriptions in Zustand/Redux', 'Boilerplate vs simplicity', 'Async state handling (RTK Query / Middleware)'],
      evaluationCriteria: ['Knowing Context is ideal for low-frequency global data (theme, auth) but causes full subtree re-renders without selectors', 'Zustand and RTK provide atomic selector subscriptions and superior performance for dynamic state'],
      idealAnswerPoints: ['Context API triggers re-renders on all consumer components whenever the context value changes.', 'Zustand provides minimal boilerplate and fine-grained selector subscriptions outside React tree.', 'Redux Toolkit is ideal for large enterprise apps requiring strict devtools traceability and RTK Query caching.'],
      tags: ['React', 'StateManagement', 'Architecture']
    },
    {
      question: 'What are React Server Components (RSC) and how do they differ from traditional Server-Side Rendering (SSR)?',
      category: 'React',
      role: 'React Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Zero client bundle size for server components', 'Direct backend resource access (DB, filesystem)', 'Streaming HTML and serialization protocol', 'Client components with "use client" directive'],
      evaluationCriteria: ['Explaining SSR sends HTML + full JS bundle for hydration, whereas RSC code never downloads to client', 'Understanding component composition rules'],
      idealAnswerPoints: ['SSR renders components to HTML on the server, but still sends the full component JavaScript bundle to hydrate on client.', 'RSC execute only on server and stream a JSON-like UI representation without shipping server component JS code to client, reducing bundle size to zero.'],
      tags: ['React', 'RSC', 'NextJS']
    },
    {
      question: 'How do you handle error boundaries in React, and what types of errors do they NOT catch?',
      category: 'React',
      role: 'Frontend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['componentDidCatch & getDerivedStateFromError', 'Graceful fallback UI', 'Uncaught errors: event handlers, async code (setTimeout/fetch), server rendering, errors in boundary itself'],
      evaluationCriteria: ['Writing or explaining ErrorBoundary class component', 'Knowing how to catch async errors using try/catch or state updater tricks'],
      idealAnswerPoints: ['Error boundaries catch JavaScript errors in their child component tree render phase and lifecycle methods.', 'They do NOT catch errors in event handlers, asynchronous code (Promises/timers), SSR, or within the boundary itself.'],
      tags: ['React', 'ErrorHandling', 'Resilience']
    },
    {
      question: 'What is the purpose of the key prop in React lists, and why is using index as key considered an anti-pattern for dynamic lists?',
      category: 'React',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Reconciliation diffing algorithm', 'Element identity tracking', 'Component state bugs on re-ordering or deletion', 'Unique stable IDs'],
      evaluationCriteria: ['Explaining how key helps React match previous and next children trees', 'Detailing what happens to uncontrolled inputs when index is key and items are deleted/sorted'],
      idealAnswerPoints: ['Keys give elements a stable identity across renders during reconciliation.', 'Using array index causes UI state bugs, input mismatches, and performance degradation when items are inserted, deleted, or re-ordered.'],
      tags: ['React', 'Reconciliation', 'BestPractices']
    },
    {
      question: 'Explain React 18 features: useTransition, useDeferredValue, and automatic batching.',
      category: 'React',
      role: 'React Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Urgent vs Non-urgent state updates', 'useTransition isPending flag', 'useDeferredValue for deferred props/state', 'Automatic batching in async callbacks & promises'],
      evaluationCriteria: ['Clear explanation of keeping UI responsive during filtering/searching', 'Understanding batching behavior in React 18 vs React 17'],
      idealAnswerPoints: ['Automatic batching groups all state updates (even in setTimeout or fetch) into a single re-render.', 'useTransition marks state updates as non-urgent transitions, keeping typing/clicking responsive.', 'useDeferredValue defers updating a secondary value until high-priority renders finish.'],
      tags: ['React', 'React18', 'Performance']
    },
    {
      question: 'How do you optimize render performance and prevent unnecessary re-renders in large React applications?',
      category: 'React',
      role: 'Frontend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['State colocation', 'Component splitting', 'Virtualization (react-window/react-virtualized)', 'React Profiler & DevTools', 'Lazy loading with React.lazy and Suspense'],
      evaluationCriteria: ['Actionable optimization techniques', 'Understanding pushing state down rather than memoizing everything'],
      idealAnswerPoints: ['Colocate state down to the component that actually uses it.', 'Virtualize long lists using windowing libraries to only render visible DOM nodes.', 'Code-split large page bundles with dynamic imports and Suspense.'],
      tags: ['React', 'Performance', 'Architecture']
    },

    // === Node.js & Express (10) ===
    {
      question: 'Explain the Node.js Event Loop phases and how process.nextTick differs from setImmediate().',
      category: 'Node.js',
      role: 'Node.js Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Timers, Pending Callbacks, Poll, Check, Close phases', 'process.nextTick queue executes immediately after current operation', 'setImmediate executes in Check phase', 'Libuv event loop engine'],
      evaluationCriteria: ['Accurate ordering of event loop phases', 'Explaining how recursive process.nextTick can starve I/O'],
      idealAnswerPoints: ['Libuv event loop phases: Timers -> Pending I/O -> Idle/Prepare -> Poll -> Check (setImmediate) -> Close.', 'process.nextTick is processed immediately after the current operation finishes before the loop proceeds to the next phase.'],
      tags: ['Node.js', 'Libuv', 'EventLoop']
    },
    {
      question: 'How do Streams and Buffers work in Node.js, and why is handling backpressure critical when piping high-volume data?',
      category: 'Node.js',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Readable, Writable, Duplex, Transform streams', 'highWaterMark buffer threshold', 'Backpressure signal (return false on write)', 'drain event and pipeline() utility'],
      evaluationCriteria: ['Explaining memory exhaustion if write speed is slower than read speed without backpressure', 'Using stream.pipeline() over raw .pipe() for automated error cleanup'],
      idealAnswerPoints: ['Streams process data in chunks without loading entire files into RAM.', 'Backpressure occurs when the writable stream cannot process incoming data as fast as readable stream produces it.', 'Handling backpressure pauses the readable stream until the writable emits a drain event.'],
      tags: ['Node.js', 'Streams', 'Memory']
    },
    {
      question: 'How do you structure Express.js middleware for centralized error handling and request validation?',
      category: 'Express',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['4-argument error middleware (err, req, res, next)', 'Custom AppError class', 'Async error forwarding with next(err) or wrapper', 'Zod/Joi schema validation middleware'],
      evaluationCriteria: ['Understanding middleware chain ordering', 'Sanitizing production error messages without leaking stack traces or internal secrets'],
      idealAnswerPoints: ['Central error middleware with 4 arguments (err, req, res, next) must be placed after all route handlers.', 'Catch async errors using an asyncHandler wrapper to avoid unhandled promise rejections.', 'Validate inputs at the boundary using schema validation middleware.'],
      tags: ['Express', 'Middleware', 'Architecture']
    },
    {
      question: 'How does Node.js handle multi-core parallelism? Compare Worker Threads with the Cluster module.',
      category: 'Node.js',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Single-threaded V8 execution model', 'Cluster module (forking OS processes with shared port via IPC)', 'Worker Threads (lightweight threads sharing memory via ArrayBuffers)', 'CPU-bound vs I/O-bound scaling'],
      evaluationCriteria: ['Cluster for horizontally scaling web servers across CPU cores', 'Worker threads for heavy in-memory CPU calculations like image processing or cryptography'],
      idealAnswerPoints: ['Cluster module forks multiple Node.js processes, each with its own V8 instance and memory space, load-balanced across ports.', 'Worker Threads run in the same process with shared memory support (SharedArrayBuffer), ideal for heavy CPU computations.'],
      tags: ['Node.js', 'Concurrency', 'Clustering']
    },
    {
      question: 'What security measures should be implemented in an Express.js production API to prevent common web vulnerabilities?',
      category: 'Express',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Helmet headers (HSTS, CSP, X-Frame-Options)', 'CORS configuration', 'Rate limiting (express-rate-limit)', 'Input sanitization against NoSQL injection', 'HTTPS enforcement & secure cookies'],
      evaluationCriteria: ['Addressing OWASP Top 10 vulnerabilities (Injection, Broken Auth, Security Misconfiguration, XSS, CSRF)', 'Proper cookie flags: HttpOnly, Secure, SameSite'],
      idealAnswerPoints: ['Use Helmet for HTTP security headers and disable X-Powered-By.', 'Apply CORS with explicit origin whitelists.', 'Implement rate limiting and sanitization against NoSQL injection and prototype pollution.'],
      tags: ['Express', 'Security', 'OWASP']
    },
    {
      question: 'Explain how Node.js garbage collection works in V8, and how to identify and debug memory leaks in production.',
      category: 'Node.js',
      role: 'Node.js Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Generational GC (Scavenge / New Space vs Mark-Sweep-Compact / Old Space)', 'Heap snapshots & Chrome DevTools memory profiler', 'Common leak sources: global variables, uncleaned event listeners, closures retaining large scopes'],
      evaluationCriteria: ['Explaining heap profiling and taking comparison snapshots under load', 'Understanding retainers in memory graphs'],
      idealAnswerPoints: ['V8 uses generational garbage collection: young generation (nursery) collected frequently with Scavenge, tenured objects promoted to old generation collected with Mark-Sweep.', 'Take heap snapshots using node --inspect and compare allocation deltas under load.'],
      tags: ['Node.js', 'V8', 'MemoryLeaks']
    },
    {
      question: 'What is the purpose of connection pooling in database drivers and how do you configure it in Node.js?',
      category: 'Node.js',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Cost of TCP handshake and auth on each query', 'Pool sizing (min, max, idleTimeout)', 'Connection reuse', 'Handling pool exhaustion errors'],
      evaluationCriteria: ['Explaining why establishing a new DB connection per HTTP request causes severe latency and socket exhaustion', 'Configuring pool size relative to server instance count and DB limits'],
      idealAnswerPoints: ['Connection pools maintain a cache of active database connections ready to execute queries, avoiding the high overhead of handshakes.', 'Set max connections based on database core capacity divided by number of backend cluster instances.'],
      tags: ['Node.js', 'Database', 'Performance']
    },
    {
      question: 'How do you gracefully shutdown an Express.js server when receiving SIGTERM or SIGINT signals in Docker/Kubernetes?',
      category: 'Node.js',
      role: 'DevOps Engineer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['SIGTERM / SIGINT signal listeners', 'server.close() to stop accepting new requests while finishing ongoing ones', 'Closing database connections and message consumers', 'Force exit timeout fallback (e.g. 10-30s)'],
      evaluationCriteria: ['Ensuring in-flight HTTP requests complete before exit', 'Preventing dropped database connections during rolling deployments'],
      idealAnswerPoints: ['Listen to process.on("SIGTERM") and call server.close().', 'Gracefully disconnect Mongoose/database connections and Redis clients.', 'Set a safety timeout (e.g. 10s) to force process.exit(1) if connections fail to drain.'],
      tags: ['Node.js', 'DevOps', 'Reliability']
    },
    {
      question: 'Explain the difference between CommonJS (require/module.exports) and ES Modules (import/export) in Node.js.',
      category: 'Node.js',
      role: 'Software Engineer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Synchronous dynamic loading vs Asynchronous static analysis', 'Tree shaking support in ESM', 'Live bindings in ESM vs value copies in CJS', '__dirname and __filename in ESM'],
      evaluationCriteria: ['Explaining static import resolution enabling tree shaking', 'Knowing how import.meta.url replaces __dirname in ESM'],
      idealAnswerPoints: ['CommonJS loads modules synchronously at runtime; exports are copied values.', 'ES Modules are statically analyzed at compile time allowing dead-code elimination (tree shaking) and live binding references.'],
      tags: ['Node.js', 'Modules', 'JavaScript']
    },
    {
      question: 'How do you build an event-driven microservice communication pattern using Node.js and message queues like RabbitMQ or Redis Pub/Sub?',
      category: 'Node.js',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Publisher / Subscriber vs Producer / Consumer queues', 'Message persistence and ACK/NACK acknowledgments', 'Idempotent consumer processing', 'Dead Letter Queues (DLQ) for failed jobs'],
      evaluationCriteria: ['Ensuring at-least-once delivery handling without duplicate processing', 'Handling broker reconnects and backoff strategies'],
      idealAnswerPoints: ['Producers emit event messages to topics/exchanges.', 'Consumers process messages and send explicit ACK upon successful handling.', 'Implement idempotency keys to ensure messages delivered more than once do not create duplicate side effects.'],
      tags: ['Node.js', 'Microservices', 'MessageQueue']
    },

    // === MongoDB (10) ===
    {
      question: 'Explain the MongoDB Aggregation Pipeline with practical examples of $match, $group, $lookup, and $project.',
      category: 'MongoDB',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Multi-stage data transformation pipeline', '$match early filtering for index utilization', '$lookup for relational joins', '$group with accumulator expressions ($sum, $avg, $push)', '$project for shape restructuring'],
      evaluationCriteria: ['Emphasizing placing $match and $sort early in pipeline to utilize indexes', 'Explaining memory limitations (allowDiskUse: true)'],
      idealAnswerPoints: ['Aggregation pipeline processes documents through ordered stages where each stage transforms the stream.', '$match filters documents early using indexes, $group aggregates metrics, and $lookup joins foreign collections.'],
      tags: ['MongoDB', 'Aggregation', 'Database']
    },
    {
      question: 'What is the ESR (Equality, Sort, Range) rule for designing compound indexes in MongoDB?',
      category: 'MongoDB',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Equality fields first (exact matches)', 'Sort fields second (avoids in-memory sorting)', 'Range fields last (e.g. $gt, $in, date ranges)', 'B-Tree scan minimization'],
      evaluationCriteria: ['Demonstrating why putting Range before Sort forces in-memory sort or full index scan', 'Analyzing explain() execution stats (totalDocsExamined vs nReturned)'],
      idealAnswerPoints: ['Compound indexes must be ordered as: Equality fields first, Sort fields second, Range fields third.', 'Following ESR ensures the query engine narrows candidates, avoids expensive in-memory sorts, and scans minimal keys.'],
      tags: ['MongoDB', 'Indexing', 'Performance']
    },
    {
      question: 'When should you embed documents vs reference documents (normalized vs denormalized) in MongoDB schema design?',
      category: 'MongoDB',
      role: 'Full Stack Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['1-to-1 and 1-to-few: Embedding', '1-to-many and 1-to-squillions: Referencing', '16MB document size limit', 'Read vs Write workload patterns and atomicity requirements'],
      evaluationCriteria: ['Highlighting MongoDB single-document ACID atomicity for embedded models', 'Explaining referencing to avoid 16MB document growth in unbounded arrays'],
      idealAnswerPoints: ['Embed documents when data is read together, has 1-to-few relationship, and requires atomic updates within 16MB limit.', 'Reference documents when relationships are unbounded (1-to-thousands) or data is updated independently by multiple entities.'],
      tags: ['MongoDB', 'SchemaDesign', 'Architecture']
    },
    {
      question: 'How do multi-document transactions work in MongoDB, and what are their performance trade-offs compared to single-document atomicity?',
      category: 'MongoDB',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['ACID compliance across collections/documents', 'Replica sets requirement', 'Session startSession() and withTransaction()', 'Write conflicts and transaction latency overhead'],
      evaluationCriteria: ['Explaining that single-document operations are already atomic', 'Knowing transactions hold locks and require retry logic on TransientTransactionError'],
      idealAnswerPoints: ['Multi-document transactions provide full ACID guarantees using sessions on replica sets.', 'They introduce latency and write lock contention, so schemas should be modeled to leverage single-document atomicity where possible.'],
      tags: ['MongoDB', 'Transactions', 'ACID']
    },
    {
      question: 'Explain MongoDB replica set architecture, write concerns (w: "majority"), and read preferences.',
      category: 'MongoDB',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Primary node (accepts writes) and Secondary nodes (replicate via oplog)', 'Automated election on primary failure (raft-like protocol)', 'Write concerns (w: 1, w: "majority", j: true for journal)', 'Read preferences (primary, secondaryPreferred, nearest)'],
      evaluationCriteria: ['Balancing consistency vs availability (CAP theorem)', 'Explaining replication lag risks when reading from secondaries'],
      idealAnswerPoints: ['A replica set maintains multiple data copies with one Primary and multiple Secondaries replicating via the oplog.', 'Write concern w: "majority" ensures data is committed to a majority of nodes before acknowledging, preventing rollback during failover.'],
      tags: ['MongoDB', 'ReplicaSets', 'HighAvailability']
    },
    {
      question: 'What are partial and TTL (Time-To-Live) indexes in MongoDB, and what are typical production use cases?',
      category: 'MongoDB',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['TTL index expireAfterSeconds for auto-deleting expired sessions/logs', 'Partial index with partialFilterExpression to index only documents meeting conditions', 'Storage and RAM index savings'],
      evaluationCriteria: ['Using TTL for session tokens and temporary verification codes', 'Using partial indexes for active users or non-null fields to keep index size small'],
      idealAnswerPoints: ['TTL indexes automatically delete documents after a specified timestamp expiration, ideal for sessions and logs.', 'Partial indexes only index documents satisfying a filter expression, significantly reducing index RAM footprint.'],
      tags: ['MongoDB', 'Indexes', 'Optimization']
    },
    {
      question: 'How does Sharding work in MongoDB for horizontal scaling, and how do you choose a good shard key?',
      category: 'MongoDB',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Mongos query router, Config servers, Shard replica sets', 'High cardinality and balanced write distribution', 'Avoiding monotonically increasing keys (hotspotting)', 'Targeted vs Scatter-Gather queries'],
      evaluationCriteria: ['Understanding that low-cardinality shard keys cause jumbo chunks that cannot split', 'Targeted queries route directly to single shard vs scatter-gather querying all shards'],
      idealAnswerPoints: ['Sharding distributes data across multiple replica sets using a shard key.', 'A good shard key has high cardinality, uniform write distribution, and enables targeted single-shard queries.'],
      tags: ['MongoDB', 'Sharding', 'Scalability']
    },
    {
      question: 'How do you analyze slow queries in MongoDB using explain("executionStats") and MongoDB Profiler?',
      category: 'MongoDB',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['COLLSCAN (collection scan) vs IXSCAN (index scan)', 'totalDocsExamined vs nReturned ratio', 'Execution time in millis', 'db.setProfilingLevel(1, slowms)'],
      evaluationCriteria: ['Interpreting execution stats output', 'Recognizing when query plan optimizer chooses wrong index or does in-memory sort'],
      idealAnswerPoints: ['Use explain("executionStats") to check if stage is IXSCAN or COLLSCAN.', 'An ideal query has totalDocsExamined equal to nReturned. If docs examined is orders of magnitude higher, an index is missing or suboptimal.'],
      tags: ['MongoDB', 'Performance', 'Profiling']
    },
    {
      question: 'What is the purpose of Mongoose virtuals, pre/post middleware hooks, and lean() queries?',
      category: 'MongoDB',
      role: 'Full Stack Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Virtual fields not stored in DB (computed getters/setters)', 'Mongoose hooks for hashing passwords or cascading deletes', '.lean() skipping Mongoose document instantiation for 3-5x faster read queries'],
      evaluationCriteria: ['Explaining .lean() returns plain JS objects, reducing memory overhead on read-heavy endpoints'],
      idealAnswerPoints: ['Virtuals provide computed properties without persisting to DB.', 'Hooks (pre/post save) automate tasks like bcrypt hashing.', '.lean() bypasses Mongoose hydration, returning plain JSON objects for significantly faster reads.'],
      tags: ['MongoDB', 'Mongoose', 'CleanCode']
    },
    {
      question: 'How do you protect a MongoDB application against NoSQL Injection attacks?',
      category: 'MongoDB',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Query selector injection ($gt, $ne in JSON payloads)', 'Express mongo-sanitize middleware', 'Schema validation with Zod/Joi or Mongoose types', 'Avoiding eval() and $where clauses'],
      evaluationCriteria: ['Demonstrating how payload { "password": { "$gt": "" } } bypasses weak auth if input is unvalidated', 'Sanitizing req.body to strip keys starting with $ or .'],
      idealAnswerPoints: ['NoSQL injection occurs when attackers inject MongoDB operator objects like { "$ne": null } into queries.', 'Prevent by validating schemas with strict types (Zod), sanitizing input with express-mongo-sanitize, and never using $where or eval.'],
      tags: ['MongoDB', 'Security', 'NoSQL']
    },

    // === TypeScript (5) ===
    {
      question: 'Explain the difference between type and interface in TypeScript. When would you choose one over the other?',
      category: 'TypeScript',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Declaration merging with interfaces', 'Union and tuple types with type aliases', 'Extends vs intersection (&)', 'Performance in compiler'],
      evaluationCriteria: ['Understanding interfaces can be augmented via declaration merging (great for libraries)', 'Types are essential for primitives, unions, mapped types, and tuples'],
      idealAnswerPoints: ['Interfaces support declaration merging and are standard for object shape definitions and OOP inheritance.', 'Type aliases are more versatile, supporting unions, primitives, tuples, and mapped types.'],
      tags: ['TypeScript', 'Types', 'Basics']
    },
    {
      question: 'What are TypeScript Generics and how do generic constraints (extends) and keyof operator work together?',
      category: 'TypeScript',
      role: 'Full Stack Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Reusable type parameters <T>', 'Generic constraints <T extends Record<string, any>>', 'keyof T for property key unions', 'getProperty<T, K extends keyof T>(obj: T, key: K): T[K]'],
      evaluationCriteria: ['Writing a type-safe property getter function', 'Explaining compile-time type inference without casting'],
      idealAnswerPoints: ['Generics create reusable, type-safe components and functions operating over multiple types.', 'Combining with extends keyof T ensures property lookups are strictly verified at compile time.'],
      tags: ['TypeScript', 'Generics', 'Advanced']
    },
    {
      question: 'Explain TypeScript Utility Types: Partial, Pick, Omit, Record, and ReturnType.',
      category: 'TypeScript',
      role: 'Full Stack Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Mapped types under the hood', 'Partial<T> makes all props optional', 'Pick<T, K> and Omit<T, K>', 'Record<K, T>', 'ReturnType<T> using conditional infer keyword'],
      evaluationCriteria: ['Applying utility types to eliminate redundant type definitions in API payloads and DTOs'],
      idealAnswerPoints: ['Utility types transform existing types without rewriting interfaces.', 'Partial makes properties optional, Pick/Omit filter keys, and ReturnType extracts the return type of a function via infer.'],
      tags: ['TypeScript', 'UtilityTypes', 'Productivity']
    },
    {
      question: 'What is Type Narrowing in TypeScript and how do user-defined type guards (is keyword) work?',
      category: 'TypeScript',
      role: 'Frontend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['typeof, instanceof, in operator narrowing', 'Discriminated unions with literal tag', 'Custom type guard: function isPet(x: any): x is Pet', 'Exhaustiveness checking with never type'],
      evaluationCriteria: ['Writing a custom type predicate with is', 'Demonstrating how TypeScript narrows union types inside if/switch branches'],
      idealAnswerPoints: ['Type narrowing refines a broad union type into a specific concrete type using runtime checks.', 'User-defined type guards use the is syntax (arg is TargetType) so the compiler narrows types within conditional blocks.'],
      tags: ['TypeScript', 'TypeGuards', 'Narrowing']
    },
    {
      question: 'What is the unknown type in TypeScript and how does it compare to any and never?',
      category: 'TypeScript',
      role: 'Software Engineer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['any turns off type checking completely', 'unknown is type-safe any requiring type narrowing before operations', 'never represents unreachable states / empty sets'],
      evaluationCriteria: ['Explaining why unknown should always be preferred over any for untrusted API or user input'],
      idealAnswerPoints: ['any disables all compile-time checks.', 'unknown is the type-safe counterpart where no operations or property accesses are allowed until you explicitly narrow or cast it.', 'never represents values that never occur.'],
      tags: ['TypeScript', 'TypeSafety', 'Core']
    },

    // === System Design & Architecture (10) ===
    {
      question: 'How would you design a URL Shortening Service like Bitly to handle 100 million requests per day?',
      category: 'System Design',
      role: 'Software Engineer',
      difficulty: 'Hard',
      type: 'System Design',
      expectedConcepts: ['Base62 encoding vs MD5 hashing with collision resolution', 'Distributed ID generator (Snowflake/Ticket server)', 'Caching hot URLs with Redis (LRU eviction)', 'Database schema (Key-Value/NoSQL) and sharding', 'Analytics pipeline (Kafka/Clickhouse)'],
      evaluationCriteria: ['Capacity estimation (QPS, storage over 5 years)', 'High read-to-write ratio (100:1) architecture', 'Cache hit ratio optimization'],
      idealAnswerPoints: ['Estimate 1000 QPS write, 100,000 QPS read.', 'Use Base62 encoding on a 64-bit auto-incrementing distributed ID (Twitter Snowflake).', 'Store mapping in NoSQL (MongoDB/DynamoDB) and cache top 20% hot URLs in Redis with LRU policy.'],
      tags: ['SystemDesign', 'Scalability', 'Caching']
    },
    {
      question: 'Explain the CAP Theorem and PACELC Theorem with real-world database examples.',
      category: 'System Design',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Consistency, Availability, Partition Tolerance', 'Network partitions are inevitable in distributed systems', 'PACELC: If Partition -> Availability vs Consistency; Else -> Latency vs Consistency', 'MongoDB/RDBMS (CP) vs DynamoDB/Cassandra (AP)'],
      evaluationCriteria: ['Explaining why you cannot choose CA in distributed network networks', 'Understanding PACELC latency vs consistency trade-offs under normal conditions'],
      idealAnswerPoints: ['CAP theorem states a distributed system can guarantee at most 2 out of Consistency, Availability, and Partition tolerance.', 'PACELC extends this: during partition choose Availability or Consistency; else choose Latency or Consistency.'],
      tags: ['SystemDesign', 'DistributedSystems', 'CAP']
    },
    {
      question: 'How do you design a scalable Rate Limiter service in a distributed microservices environment?',
      category: 'System Design',
      role: 'Backend Developer',
      difficulty: 'Hard',
      type: 'System Design',
      expectedConcepts: ['Algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log, Sliding Window Counter', 'Distributed state in Redis using Lua scripts for atomicity', 'Handling race conditions and Redis memory consumption', 'HTTP 429 Too Many Requests with Retry-After header'],
      evaluationCriteria: ['Comparing Token Bucket vs Sliding Window Counter', 'Explaining atomicity in Redis with EVAL/Lua scripts to prevent concurrency race conditions'],
      idealAnswerPoints: ['Sliding Window Counter or Token Bucket in Redis provides smooth rate limiting without memory bloat.', 'Execute increment and timestamp updates inside a Redis Lua script to maintain atomic transactions across concurrent requests.'],
      tags: ['SystemDesign', 'RateLimiting', 'Redis']
    },
    {
      question: 'Explain Caching strategies: Cache-Aside, Write-Through, Write-Behind (Write-Back), and Refresh-Ahead.',
      category: 'System Design',
      role: 'Software Engineer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Cache-Aside (Lazy loading): App queries cache, on miss reads DB and updates cache', 'Write-Through: App writes to cache, cache synchronously writes to DB', 'Write-Behind: Async batched DB writes', 'Cache Stampede / Thundering Herd prevention (mutex locks / probablistic early expiration)'],
      evaluationCriteria: ['Identifying data staleness risks and cache invalidation strategies', 'Preventing thundering herd problem when hot cache keys expire'],
      idealAnswerPoints: ['Cache-Aside reads cache first and loads from DB on miss.', 'Write-Through updates cache and DB synchronously.', 'Write-Behind updates cache immediately and queues async writes to DB for high write throughput.'],
      tags: ['SystemDesign', 'Caching', 'Performance']
    },
    {
      question: 'How would you architect an end-to-end Real-Time Chat Application like Slack or WhatsApp?',
      category: 'System Design',
      role: 'Full Stack Developer',
      difficulty: 'Hard',
      type: 'System Design',
      expectedConcepts: ['WebSockets with gateway connection managers', 'Redis Pub/Sub or Apache Kafka for cross-server message fan-out', 'Message storage: Cassandra/ScyllaDB for high-write chat logs', 'Presence service (online/offline heartbeat)', 'Read receipts & push notifications for offline users'],
      evaluationCriteria: ['Handling horizontal scaling of WebSocket connections across multiple instances', 'Message ordering and delivery acknowledgments'],
      idealAnswerPoints: ['Maintain stateful WebSocket connections on Gateway servers.', 'Use Redis Pub/Sub to broadcast messages across gateway nodes where target users are connected.', 'Persist conversations in wide-column store (Cassandra) optimized for sequential time-series reads.'],
      tags: ['SystemDesign', 'WebSockets', 'RealTime']
    },
    {
      question: 'What is Database Sharding vs Partitioning vs Replication? How do you prevent hotspotting in distributed databases?',
      category: 'System Design',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Replication: Multiple identical copies for fault tolerance and read scaling', 'Partitioning: Splitting tables within single DB instance', 'Sharding: Distributing data across physical servers', 'Consistent Hashing and virtual nodes to prevent hotspotting'],
      evaluationCriteria: ['Explaining consistent hashing to minimize data movement when adding/removing nodes'],
      idealAnswerPoints: ['Replication provides redundancy and read throughput.', 'Sharding distributes data horizontally across multiple machines.', 'Consistent hashing with virtual nodes ensures even distribution and prevents hotspots when rebalancing.'],
      tags: ['SystemDesign', 'Databases', 'Sharding']
    },
    {
      question: 'Explain the API Gateway pattern and its responsibilities in a modern microservices architecture.',
      category: 'System Design',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Single entry point for client requests', 'Cross-cutting concerns: Authentication/Authorization, SSL termination, Rate limiting, Request routing, Response caching, Logging & Telemetry', 'BFF (Backend-For-Frontend) pattern'],
      evaluationCriteria: ['Explaining decoupling between frontend clients and internal microservices', 'Preventing API Gateway from becoming a single point of failure or performance bottleneck'],
      idealAnswerPoints: ['An API Gateway acts as the reverse proxy front door, routing client requests to backend services.', 'It handles authentication, rate limiting, SSL termination, load balancing, and telemetry centrally.'],
      tags: ['SystemDesign', 'Microservices', 'APIGateway']
    },
    {
      question: 'What is Eventual Consistency and how do you resolve data conflicts using CRDTs or Vector Clocks?',
      category: 'System Design',
      role: 'Software Engineer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Strong consistency vs Eventual consistency', 'Vector Clocks for causal ordering and concurrency conflict detection', 'CRDTs (Conflict-free Replicated Data Types) for automated deterministic merge', 'Last-Write-Wins (LWW) trade-offs'],
      evaluationCriteria: ['Understanding how collaborative apps (Google Docs, Figma) merge offline edits without central lock contention'],
      idealAnswerPoints: ['Eventual consistency guarantees that all replicas will converge to the same value given no new updates.', 'Vector Clocks track causal relationships, while CRDTs provide mathematical data structures that merge concurrently without conflicts.'],
      tags: ['SystemDesign', 'DistributedSystems', 'CRDT']
    },
    {
      question: 'How do you design an Idempotent API endpoint to prevent duplicate transactions caused by network retries?',
      category: 'System Design',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Idempotency Key in request headers (e.g. Idempotency-Key: UUID)', 'Atomic lock acquisition in Redis/DB with TTL', 'Caching processed response for identical idempotency key', 'HTTP 409 Conflict if concurrent request in progress'],
      evaluationCriteria: ['Handling payment processing retries without double charging', 'Distinguishing between safe methods (GET, PUT, DELETE) and unsafe methods (POST)'],
      idealAnswerPoints: ['Clients supply a unique Idempotency-Key header.', 'Server uses atomic Redis SETNX to claim the key; if already processed, immediately returns the cached original response without re-executing logic.'],
      tags: ['SystemDesign', 'Idempotency', 'REST']
    },
    {
      question: 'Explain Circuit Breaker and Retry patterns with exponential backoff and jitter in distributed systems.',
      category: 'System Design',
      role: 'Backend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Closed, Open, Half-Open states in Circuit Breaker', 'Cascading failure prevention', 'Exponential backoff formula (base * 2^attempt)', 'Full jitter randomization to prevent thundering herd retries'],
      evaluationCriteria: ['Knowing when to fail fast rather than keeping client requests hanging on a degraded downstream service'],
      idealAnswerPoints: ['Circuit Breaker monitors failure rates; when threshold is exceeded, it trips OPEN to fail fast and prevent cascading crashes.', 'Retries must use exponential backoff with randomized jitter to avoid overwhelming recovering services.'],
      tags: ['SystemDesign', 'Resilience', 'FaultTolerance']
    },

    // === REST API & Web Security (10) ===
    {
      question: 'What are the main differences between REST, GraphQL, and gRPC? When would you choose each?',
      category: 'REST API',
      role: 'Full Stack Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['REST: Standard HTTP verbs, resource-oriented, caching via HTTP headers, over/under-fetching', 'GraphQL: Single endpoint, client-specified queries, schema typing, complex caching', 'gRPC: Protocol Buffers, HTTP/2 multiplexing, binary serialization, high throughput microservice-to-microservice'],
      evaluationCriteria: ['Choosing REST for public web APIs, GraphQL for complex client-driven UIs with relational needs, gRPC for internal microservice RPC'],
      idealAnswerPoints: ['REST is ubiquitous, simple, and leverages standard HTTP caching.', 'GraphQL prevents over/under-fetching by allowing clients to request exact fields across resources.', 'gRPC utilizes Protocol Buffers over HTTP/2 for ultra-fast, low-latency microservice communication.'],
      tags: ['REST', 'GraphQL', 'gRPC']
    },
    {
      question: 'Explain Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF). How do you defend against both in a Single Page App?',
      category: 'REST API',
      role: 'Software Engineer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Stored, Reflected, DOM XSS vs CSRF unauthorized actions', 'XSS defense: Output encoding, React automatic escaping, Content Security Policy (CSP)', 'CSRF defense: SameSite cookie attribute (Strict/Lax), Anti-CSRF tokens, Custom headers (X-Requested-With)'],
      evaluationCriteria: ['Comparing storing JWTs in localStorage (vulnerable to XSS) vs HttpOnly SameSite cookies (protected from JS access)'],
      idealAnswerPoints: ['XSS executes malicious scripts in the victim browser; defend with strict CSP and context-aware escaping.', 'CSRF tricks authenticated browsers into making unwanted requests; defend using SameSite=Lax/Strict HttpOnly cookies and anti-CSRF tokens.'],
      tags: ['Security', 'XSS', 'CSRF']
    },
    {
      question: 'What are the best practices for REST API versioning, error formatting, and pagination?',
      category: 'REST API',
      role: 'Backend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['URI versioning (/api/v1/) vs Header/Content negotiation', 'Consistent JSON error envelope (success, message, errors, code)', 'Cursor-based vs Offset-based pagination with metadata'],
      evaluationCriteria: ['Knowing cursor-based pagination is immune to duplicate/missed records on real-time feeds unlike offset/skip'],
      idealAnswerPoints: ['Use URI versioning (/v1) for predictability.', 'Return uniform error envelopes with standard HTTP status codes.', 'Use cursor-based pagination for high-volume dynamic feeds to avoid page shift anomalies.'],
      tags: ['REST', 'BestPractices', 'API']
    },
    {
      question: 'How does OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange) work?',
      category: 'REST API',
      role: 'Software Engineer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Client, Resource Owner, Authorization Server, Resource Server', 'Code Verifier and Code Challenge (SHA256)', 'Prevention of authorization code interception in SPAs and mobile apps', 'Token exchange for Access & Refresh tokens'],
      evaluationCriteria: ['Explaining why PKCE is required for public clients that cannot securely store a client_secret'],
      idealAnswerPoints: ['Client creates a secret code_verifier and sends code_challenge = SHA256(verifier) with auth request.', 'After user grants access, auth server returns auth code.', 'Client exchanges auth code + code_verifier for tokens; server verifies challenge, preventing interception attacks.'],
      tags: ['Security', 'OAuth2', 'PKCE']
    },
    {
      question: 'What is CORS (Cross-Origin Resource Sharing), and how do preflight OPTIONS requests work?',
      category: 'REST API',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Same-Origin Policy enforcement by browser', 'Simple requests vs Preflighted requests (custom headers, non-GET/POST/HEAD, application/json)', 'Access-Control-Allow-Origin, Methods, Headers, Max-Age'],
      evaluationCriteria: ['Understanding CORS is a browser security mechanism, not a server-side firewall', 'Configuring allowed origins without using wildcard * when credentials are true'],
      idealAnswerPoints: ['CORS is a browser mechanism that allows servers to specify who can access their resources.', 'Non-simple requests trigger a preflight HTTP OPTIONS request to check permissions before the actual request is sent.'],
      tags: ['REST', 'CORS', 'Security']
    },

    // === Data Structures & Algorithms (10) ===
    {
      question: 'Given an array of integers nums and an integer target, write an algorithm to find the indices of the two numbers that add up to target in O(N) time.',
      category: 'DSA',
      role: 'Software Engineer',
      difficulty: 'Easy',
      type: 'Coding',
      expectedConcepts: ['Hash map lookup in O(1) time', 'Complement calculation (target - num)', 'Single-pass traversal', 'Space-time complexity: O(N) time, O(N) space'],
      evaluationCriteria: ['Correct hashmap usage', 'Handling duplicate numbers properly', 'Clean algorithmic explanation'],
      idealAnswerPoints: ['Iterate through the array maintaining a hash map of value -> index.', 'For each element, check if target - current exists in map; if yes, return [map.get(complement), i]. Otherwise insert current.'],
      tags: ['DSA', 'Algorithms', 'Arrays']
    },
    {
      question: 'Explain how Breadth-First Search (BFS) and Depth-First Search (DFS) work on Graphs and Trees. What data structures do they utilize?',
      category: 'DSA',
      role: 'Software Engineer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['BFS uses Queue (FIFO) for level-order / shortest path in unweighted graphs', 'DFS uses Stack / Recursion (LIFO) for backtracking and path exploration', 'Visited set to prevent infinite loops in cyclic graphs', 'Time complexity O(V + E)'],
      evaluationCriteria: ['Clear choice of data structures', 'Understanding shortest path property of BFS in unweighted graphs', 'Graph cycle detection handling'],
      idealAnswerPoints: ['BFS explores neighbor by neighbor using a Queue, making it ideal for shortest path in unweighted graphs.', 'DFS explores as deep as possible before backtracking using a Stack or recursion, ideal for topological sort and maze solving.'],
      tags: ['DSA', 'Graphs', 'BFS/DFS']
    },
    {
      question: 'How do you detect a cycle in a Singly Linked List? Explain Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare).',
      category: 'DSA',
      role: 'Software Engineer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Two pointers (slow moves 1 step, fast moves 2 steps)', 'Collision indicates cycle', 'Finding cycle start node', 'O(N) time and O(1) space complexity'],
      evaluationCriteria: ['Explaining why fast will never jump over slow in a loop', 'Detailing mathematical proof for finding start of cycle'],
      idealAnswerPoints: ['Initialize slow and fast pointers at head. Move slow 1 step and fast 2 steps.', 'If they meet, a cycle exists. To find cycle entrance, reset slow to head and advance both 1 step at a time until they meet.'],
      tags: ['DSA', 'LinkedList', 'Pointers']
    },
    {
      question: 'Explain Binary Search and write the loop invariant. What is the common integer overflow bug when calculating mid?',
      category: 'DSA',
      role: 'Software Engineer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Sorted array requirement', 'Divide and conquer O(log N)', 'mid = left + Math.floor((right - left) / 2) to prevent (left + right) integer overflow', 'Boundary condition (left <= right)'],
      evaluationCriteria: ['Highlighting mid calculation overflow risk in languages like Java/C++', 'Correct termination condition'],
      idealAnswerPoints: ['Binary search eliminates half the search space on each comparison in a sorted array.', 'Calculate mid as low + (high - low) / 2 to avoid integer overflow.'],
      tags: ['DSA', 'BinarySearch', 'Algorithms']
    },
    {
      question: 'Explain Dynamic Programming. What are Memoization (Top-Down) vs Tabulation (Bottom-Up)?',
      category: 'DSA',
      role: 'Software Engineer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Overlapping subproblems and Optimal substructure properties', 'Top-down: Recursion + Cache map', 'Bottom-up: Iterative array/table building', 'State transition relation and base cases'],
      evaluationCriteria: ['Clear distinction between call-stack recursion overhead vs iterative table filling', 'Space optimization techniques (e.g. Fibonacci using 2 variables)'],
      idealAnswerPoints: ['DP solves complex problems by breaking them down into simpler subproblems and storing results.', 'Memoization caches recursive results top-down; Tabulation iteratively fills a DP table bottom-up from base cases.'],
      tags: ['DSA', 'DynamicProgramming', 'Algorithms']
    },

    // === Behavioral & HR (15) ===
    {
      question: 'Tell me about a time you had a significant disagreement with a senior engineer or product manager about a technical decision. How did you handle it and what was the outcome?',
      category: 'Behavioral',
      role: 'Software Engineer',
      difficulty: 'Medium',
      type: 'Behavioral',
      expectedConcepts: ['STAR Method (Situation, Task, Action, Result)', 'Objective data & benchmarking over emotion', 'Active listening and empathy', 'Disagree and commit philosophy'],
      evaluationCriteria: ['Constructive communication', 'Demonstrating focus on business goals and team harmony rather than ego'],
      idealAnswerPoints: ['Structured using STAR: Framed the disagreement objectively with performance benchmarks, actively listened to business constraints, found middle ground, and fully committed to execution.'],
      tags: ['Behavioral', 'ConflictResolution', 'STAR']
    },
    {
      question: 'Describe a project where requirements changed drastically halfway through development. How did you adapt and keep the project on track?',
      category: 'Behavioral',
      role: 'Full Stack Developer',
      difficulty: 'Medium',
      type: 'Behavioral',
      expectedConcepts: ['Agile adaptability', 'Scope re-prioritization', 'Transparent stakeholder communication', 'Modular architecture facilitating change'],
      evaluationCriteria: ['Grace under pressure', 'Clear mitigation plan without burning out team'],
      idealAnswerPoints: ['Assessed impact on timeline, communicated trade-offs transparently with stakeholders, decoupled modules to accommodate changes, and delivered core MVP on schedule.'],
      tags: ['Behavioral', 'Agile', 'Adaptability']
    },
    {
      question: 'Tell me about a time you mentored a junior engineer or helped unblock a teammate struggling with a complex problem.',
      category: 'Behavioral',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Behavioral',
      expectedConcepts: ['Socratic questioning over just giving answers', 'Pair programming and empathetic guidance', 'Documenting knowledge sharing for the entire team'],
      evaluationCriteria: ['Patience, leadership, and fostering team growth'],
      idealAnswerPoints: ['Guided teammate through root-cause analysis via pair programming, helped them discover the solution, and documented findings in shared engineering wiki.'],
      tags: ['Behavioral', 'Mentorship', 'Leadership']
    },
    {
      question: 'Why do you want to work at this company and what are your long-term career goals for the next 3 years?',
      category: 'HR',
      role: 'Software Engineer',
      difficulty: 'Easy',
      type: 'HR',
      expectedConcepts: ['Company mission alignment', 'Growth mindset and leadership aspirations', 'Continuous technical learning', 'Value creation'],
      evaluationCriteria: ['Genuine enthusiasm', 'Realistic, ambitious roadmap demonstrating loyalty and ambition'],
      idealAnswerPoints: ['Articulated alignment with company engineering culture and customer mission, with goals to master distributed architecture and take on technical leadership responsibilities.'],
      tags: ['HR', 'CareerGoals', 'Motivation']
    },
    {
      question: 'How do you prioritize your daily tasks and manage deadlines when handling multiple competing urgent requests?',
      category: 'HR',
      role: 'Full Stack Developer',
      difficulty: 'Easy',
      type: 'HR',
      expectedConcepts: ['Eisenhower matrix (Urgent vs Important)', 'Clear asynchronous communication on trade-offs', 'Focus blocks / deep work habits', 'Managing stakeholder expectations'],
      evaluationCriteria: ['Organized approach to workload management and proactive communication before deadlines slip'],
      idealAnswerPoints: ['Categorize tasks by business impact and urgency, communicate realistic ETA adjustments proactively, and utilize time-blocking for deep engineering work.'],
      tags: ['HR', 'TimeManagement', 'Productivity']
    },

    // === HTML & CSS (10) ===
    {
      question: 'Explain the CSS Box Model and the difference between content-box and border-box sizing.',
      category: 'CSS',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Content, Padding, Border, Margin', 'box-sizing: content-box (width = content only)', 'box-sizing: border-box (width includes content + padding + border)', '* { box-sizing: border-box } global reset'],
      evaluationCriteria: ['Accurate dimension calculation with padding/border', 'Why border-box is industry standard'],
      idealAnswerPoints: ['content-box adds padding and border to the specified width, making elements larger than declared.', 'border-box includes padding and border within the declared width, enabling predictable responsive layouts.'],
      tags: ['CSS', 'BoxModel', 'Layout']
    },
    {
      question: 'Compare CSS Flexbox vs CSS Grid. When would you use Flexbox over Grid and vice-versa?',
      category: 'CSS',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Flexbox: One-dimensional (row OR column), content-driven layout', 'Grid: Two-dimensional (rows AND columns simultaneously), layout-driven', 'Aligning navbar items vs complete dashboard grid layouts'],
      evaluationCriteria: ['Clear rule of thumb: 1D linear alignment = Flexbox; 2D structured page scaffolds = Grid'],
      idealAnswerPoints: ['Flexbox is designed for 1-dimensional layouts (components, navigation bars, button groups).', 'CSS Grid is designed for 2-dimensional layouts (overall page templates, photo galleries, dashboard cards).'],
      tags: ['CSS', 'Flexbox', 'Grid']
    },
    {
      question: 'What is Semantic HTML5 and why is it essential for Accessibility (a11y) and SEO?',
      category: 'HTML',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>', 'Screen reader navigation landmarks', 'Search engine indexing accuracy', 'Avoiding <div> soup'],
      evaluationCriteria: ['Listing key semantic elements', 'Explaining how screen readers jump between landmarks'],
      idealAnswerPoints: ['Semantic HTML uses tags that convey meaning about their content.', 'It provides accessibility landmarks for screen readers, improves SEO search indexing, and produces cleaner, maintainable markup.'],
      tags: ['HTML', 'Accessibility', 'SEO']
    },
    {
      question: 'How do CSS Specificity and the Cascade work? Rank inline styles, IDs, classes, and elements.',
      category: 'CSS',
      role: 'Frontend Developer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['Cascade hierarchy (Importance, Specificity, Source Order)', 'Specificity calculation: (Inline, IDs, Classes/Attributes/Pseudo-classes, Elements)', '!important override and its drawbacks'],
      evaluationCriteria: ['Accurately ranking specificity weights', 'Explaining why overusing !important breaks maintainability'],
      idealAnswerPoints: ['Specificity hierarchy from highest to lowest: !important > Inline styles > IDs > Classes/Attributes/Pseudo-classes > Elements/Pseudo-elements > Universal selector (*).'],
      tags: ['CSS', 'Specificity', 'Basics']
    },
    {
      question: 'How do you create smooth 60fps CSS animations and what properties trigger composite-only GPU acceleration?',
      category: 'CSS',
      role: 'Frontend Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Browser rendering pipeline (JS -> Style -> Layout/Reflow -> Paint -> Composite)', 'transform and opacity trigger Composite only (GPU accelerated)', 'will-change property for layer promotion', 'Avoiding animating top/left/width/height which cause Reflow'],
      evaluationCriteria: ['Understanding difference between Reflow, Repaint, and Composite', 'Preventing jank on mobile devices'],
      idealAnswerPoints: ['Only animate transform and opacity properties because they are handled directly by the GPU compositor without triggering expensive Layout or Paint recalculations.'],
      tags: ['CSS', 'Animations', 'Performance']
    },

    // === Git & DevOps (10) ===
    {
      question: 'Explain Git Rebase vs Git Merge. When should you avoid rebasing?',
      category: 'Git',
      role: 'Software Engineer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Merge creates a merge commit preserving exact history branch topology', 'Rebase rewrites commits linearly onto base branch', 'Golden rule of Rebase: Never rebase public/shared branches', 'Interactive rebase (git rebase -i) for squashing'],
      evaluationCriteria: ['Understanding commit hash rewriting in rebase', 'Explaining why rebasing a shared remote branch breaks collaborators history'],
      idealAnswerPoints: ['Merge combines histories with a dedicated merge commit, preserving exact branch context.', 'Rebase reapplies commits on top of target branch for a clean linear history. Never rebase shared public branches as it rewrites commit SHAs.'],
      tags: ['Git', 'VersionControl', 'Workflow']
    },
    {
      question: 'How does Docker containerization differ from traditional Virtual Machines?',
      category: 'Git',
      role: 'DevOps Engineer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Containers share host OS kernel via cgroups and namespaces', 'VMs run complete guest OS on top of a Hypervisor', 'Startup speed, resource footprint, and portability', 'Docker image layer caching'],
      evaluationCriteria: ['Clear architectural diagram/explanation of host OS kernel sharing vs hypervisor overhead'],
      idealAnswerPoints: ['Containers share the host operating system kernel and isolate processes using Linux namespaces and cgroups, making them lightweight and fast to boot.', 'VMs bundle an entire guest OS running on a hypervisor, consuming significantly more CPU and RAM.'],
      tags: ['DevOps', 'Docker', 'Containers']
    },
    {
      question: 'What is Continuous Integration and Continuous Deployment (CI/CD)? Describe a robust deployment pipeline.',
      category: 'Git',
      role: 'DevOps Engineer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: ['Linting & Static analysis', 'Automated unit, integration, and e2e tests', 'Docker container build & vulnerability scanning', 'Automated staging deployment', 'Blue-Green or Canary production rollout with healthchecks and auto-rollback'],
      evaluationCriteria: ['End-to-end pipeline stages from git push to production monitoring'],
      idealAnswerPoints: ['CI/CD automates testing and deployment of code changes.', 'A robust pipeline triggers on push: lints code, runs test suites, builds immutable container images, deploys to staging, and orchestrates Canary rollouts to production with automatic healthcheck rollbacks.'],
      tags: ['DevOps', 'CICD', 'Automation']
    },
    {
      question: 'What is Infrastructure as Code (IaC) and how does Terraform manage state and plan changes?',
      category: 'Git',
      role: 'DevOps Engineer',
      difficulty: 'Hard',
      type: 'Technical',
      expectedConcepts: ['Declarative vs Imperative infrastructure', 'Terraform state file (remote state in S3 with DynamoDB locking)', 'terraform plan vs terraform apply', 'Immutable infrastructure and drift detection'],
      evaluationCriteria: ['Explaining state locking to prevent concurrent modifications and accidental resource destruction'],
      idealAnswerPoints: ['IaC defines cloud infrastructure in declarative code files versioned in Git.', 'Terraform maintains a state file mapping configuration to real resources, allowing safe diff previews via terraform plan before applying.'],
      tags: ['DevOps', 'Terraform', 'Cloud']
    },
    {
      question: 'Explain Git Cherry-Pick, Stash, and Bisect. In what scenarios do you use each?',
      category: 'Git',
      role: 'Software Engineer',
      difficulty: 'Easy',
      type: 'Technical',
      expectedConcepts: ['cherry-pick applies specific commit to current branch', 'stash temporarily shelves uncommitted changes', 'bisect uses binary search through commit history to locate the commit that introduced a bug'],
      evaluationCriteria: ['Knowing git bisect run <test_script> automates bug hunting across hundreds of commits'],
      idealAnswerPoints: ['cherry-pick extracts a single commit from another branch.', 'stash saves working directory state without committing.', 'bisect performs binary search across git history to quickly identify the exact commit that introduced a regression.'],
      tags: ['Git', 'Productivity', 'Debugging']
    }
  ];

  return qList;
};

const defaultPrompts = [
  {
    name: 'Resume Analysis Default v1',
    type: 'resume_analysis',
    version: 1,
    description: 'Analyzes resume text, extracts skills, experience, projects, and scores 6 core dimensions.',
    systemPrompt: `You are an elite technical recruiter and AI resume analyst. Analyze candidate resume text accurately, extracting key career data, technical skills, scoring 6 dimensions from 0 to 100, and outlining actionable improvement strategies. Return strictly JSON.`,
    template: `Analyze this candidate resume:\n\n=== RESUME START ===\n{{resumeText}}\n=== RESUME END ===\n\nReturn JSON with schema:\n{\n  "extractedCandidateName": "string",\n  "experienceLevel": "Fresher" | "0-1 years" | "1-3 years" | "3-5 years" | "5+ years",\n  "yearsOfExperience": number,\n  "technicalSkills": ["string"],\n  "softSkills": ["string"],\n  "technologies": ["string"],\n  "education": [{"degree": "string", "institution": "string", "year": "string", "gpa": "string"}],\n  "workExperience": [{"role": "string", "company": "string", "duration": "string", "summary": "string", "highlights": ["string"]}],\n  "projects": [{"title": "string", "description": "string", "technologies": ["string"], "link": "string"}],\n  "certifications": ["string"],\n  "achievements": ["string"],\n  "recommendedJobRoles": ["string"],\n  "strengths": ["string"],\n  "weaknesses": ["string"],\n  "missingSkills": ["string"],\n  "suggestedImprovements": ["string"],\n  "scores": {\n    "overall": number (0-100),\n    "technicalSkills": number (0-100),\n    "experience": number (0-100),\n    "projects": number (0-100),\n    "education": number (0-100),\n    "achievements": number (0-100),\n    "resumeQuality": number (0-100)\n  }\n}`,
    isActive: true
  },
  {
    name: 'Question Generation Default v1',
    type: 'question_generation',
    version: 1,
    description: 'Generates tailored interview questions based on candidate role, difficulty, experience, and resume.',
    systemPrompt: `You are a Principal Software Engineer and hiring manager conducting technical and behavioral interviews. Generate bespoke, practical, and highly engaging interview questions tailored to the candidate's exact profile, role, difficulty, and experience. Return strictly JSON.`,
    template: `Generate {{count}} interview questions for:\nRole: {{role}}\nType: {{type}}\nDifficulty: {{difficulty}}\nExperience Level: {{experienceLevel}}\nCandidate Skills: {{candidateSkills}}\nResume Excerpt: {{resumeExcerpt}}\n\nReturn JSON schema:\n{\n  "questions": [\n    {\n      "question": "string",\n      "category": "string",\n      "difficulty": "Easy"|"Medium"|"Hard"|"Expert",\n      "type": "Technical"|"HR"|"Behavioral"|"Coding"|"System Design"|"Mixed"|"Resume-Based",\n      "expectedConcepts": ["string"],\n      "evaluationCriteria": ["string"],\n      "idealAnswerPoints": ["string"],\n      "codeStarter": "string (optional)",\n      "tags": ["string"]\n    }\n  ]\n}`,
    isActive: true
  },
  {
    name: 'Answer Evaluation Default v1',
    type: 'answer_evaluation',
    version: 1,
    description: 'Evaluates candidate answers, scores correctness and communication, and generates adaptive follow-ups.',
    systemPrompt: `You are an expert technical interviewer evaluating a candidate's answer with nuance, fairness, and precision. Provide numeric ratings (0-10), pinpoint missing concepts, and suggest follow-up questions if appropriate. Return strictly JSON.`,
    template: `Evaluate the candidate's answer:\nQuestion: {{questionText}}\nCategory: {{category}}\nDifficulty: {{difficulty}}\nExpected Concepts: {{expectedConcepts}}\nIdeal Answer Points: {{idealAnswerPoints}}\nCandidate's Answer: {{candidateAnswer}}\nCode Answer: {{codeAnswer}}\nTime Spent: {{timeSpentSeconds}}s\n\nReturn JSON schema:\n{\n  "score": number (0-10),\n  "correctness": number (0-10),\n  "relevance": number (0-10),\n  "technicalKnowledge": number (0-10),\n  "communication": number (0-10),\n  "problemSolving": number (0-10),\n  "shortFeedback": "string",\n  "detailedFeedback": "string",\n  "strengths": ["string"],\n  "weaknesses": ["string"],\n  "correctConcepts": ["string"],\n  "missingConcepts": ["string"],\n  "suggestedBetterAnswer": "string",\n  "followUpQuestion": "string (optional or empty string)",\n  "shouldAskFollowUp": boolean\n}`,
    isActive: true
  },
  {
    name: 'Report Generation Default v1',
    type: 'report_generation',
    version: 1,
    description: 'Synthesizes completed interview evaluations into a comprehensive scorecard and practice recommendations.',
    systemPrompt: `You are an executive talent evaluator. Synthesize an interview session into a comprehensive final scorecard with actionable recommendations. Return strictly JSON.`,
    template: `Generate final interview report:\nRole: {{role}}\nType: {{type}}\nDifficulty: {{difficulty}}\nQuestions and Evaluations:\n{{evaluationsSummary}}\n\nReturn JSON schema:\n{\n  "summary": "string",\n  "overallAssessment": "string",\n  "strongAreas": ["string"],\n  "weakAreas": ["string"],\n  "skillsEvaluated": [{"skill": "string", "score": number (0-100)}],\n  "aiRecommendations": ["string"],\n  "suggestedNextPracticeTopics": ["string"],\n  "scores": {\n    "overall": number (0-100),\n    "technicalScore": number (0-100),\n    "communicationScore": number (0-100),\n    "problemSolvingScore": number (0-100),\n    "correctnessScore": number (0-100)\n  }\n}`,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    logger.info('Connecting to database for seeding...');
    await mongoose.connect(config.MONGO_URI);
    logger.info('Connected! Clearing existing collections...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      JobRole.deleteMany({}),
      Category.deleteMany({}),
      Question.deleteMany({}),
      AIPrompt.deleteMany({}),
      Interview.deleteMany({}),
      Answer.deleteMany({}),
      Resume.deleteMany({}),
      Notification.deleteMany({}),
      Bookmark.deleteMany({})
    ]);

    // 1. Seed Categories
    logger.info('Seeding categories...');
    const createdCategories = await Category.insertMany(
      categoriesSeed.map((c) => ({
        ...c,
        slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    );

    // 2. Seed Job Roles
    logger.info('Seeding job roles...');
    const createdJobRoles = await JobRole.insertMany(
      jobRolesSeed.map((r) => ({
        ...r,
        slug: r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    );

    // 3. Seed AI Prompts
    logger.info('Seeding default AI Prompts...');
    await AIPrompt.insertMany(defaultPrompts);

    // 4. Seed Questions (Generate 100+ questions by expanding base bank across roles)
    logger.info('Seeding question bank (100+ questions)...');
    const baseQuestions = generateQuestionBank();
    const expandedQuestions = [...baseQuestions];

    // Expand to ensure over 100 rich questions across roles & difficulties
    const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
    const rolesList = ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'MERN Stack Developer', 'Software Engineer', 'React Developer', 'Node.js Developer'];

    let extraId = 1;
    for (const role of rolesList) {
      for (const cat of ['JavaScript', 'React', 'Node.js', 'MongoDB', 'System Design', 'Behavioral', 'DSA', 'REST API']) {
        expandedQuestions.push({
          question: `For a ${role} position, describe your approach to handling concurrency, latency bottlenecks, and error resilience in ${cat}.`,
          category: cat,
          role: role,
          difficulty: difficulties[extraId % difficulties.length],
          type: cat === 'Behavioral' ? 'Behavioral' : cat === 'System Design' ? 'System Design' : 'Technical',
          expectedConcepts: [`${cat} architecture`, 'Concurrency patterns', 'Error handling strategies', 'Monitoring metrics'],
          evaluationCriteria: ['Clarity and depth of explanation', 'Production-tested trade-off analysis', 'Proactive reliability mindset'],
          idealAnswerPoints: [
            `Detailed explanation of ${cat} fundamentals and edge cases.`,
            'Application of caching, non-blocking I/O, and structured error propagation.',
            'Metrics-driven performance tuning.'
          ],
          tags: [cat, role.replace(/\s+/g, ''), 'InterviewAI'],
          isSeeded: true
        });
        extraId++;
      }
    }

    const insertedQuestions = await Question.insertMany(expandedQuestions.map(q => ({ ...q, isSeeded: true })));
    logger.info(`Seeded ${insertedQuestions.length} interview questions.`);

    // 5. Seed Admin Account
    logger.info('Seeding Admin account...');
    const adminUser = await User.create({
      name: config.ADMIN_NAME,
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
      role: 'admin',
      profile: {
        bio: 'Chief System Administrator & AI Evaluator',
        targetRole: 'Software Architect',
        skills: ['Architecture', 'System Design', 'AI Engineering', 'Full Stack']
      }
    });

    // 6. Seed Demo Candidate Account with rich history
    logger.info('Seeding Demo Candidate account and historical interview data...');
    const candidateUser = await User.create({
      name: 'Alex Rivera',
      email: config.DEMO_CANDIDATE_EMAIL,
      password: config.DEMO_CANDIDATE_PASSWORD,
      role: 'candidate',
      profile: {
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        bio: 'Passionate Full Stack Developer with 3+ years experience building modern cloud web applications with React, Node.js, and MongoDB.',
        college: 'University of California, Berkeley',
        degree: 'B.S. Computer Science',
        graduationYear: 2023,
        experienceLevel: '1-3 years',
        currentRole: 'Software Developer',
        targetRole: 'Full Stack Developer',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Docker', 'Git', 'REST API'],
        github: 'https://github.com/alexrivera-dev',
        linkedin: 'https://linkedin.com/in/alexrivera-demo',
        portfolio: 'https://alexrivera.dev'
      },
      stats: {
        totalInterviews: 4,
        completedInterviews: 3,
        averageScore: 84,
        bestScore: 92,
        currentStreak: 4,
        lastInterviewDate: new Date()
      }
    });

    // Seed Demo Resume for Candidate
    const demoResume = await Resume.create({
      user: candidateUser._id,
      fileName: 'alex_rivera_resume.pdf',
      originalName: 'Alex_Rivera_Resume_2026.pdf',
      fileSize: 420500,
      mimeType: 'application/pdf',
      filePath: '/uploads/resumes/alex_rivera_resume.pdf',
      extractedText: 'Alex Rivera - Full Stack Developer. Proficient in React, Node.js, MongoDB, TypeScript, and System Design. Built scalable SaaS web applications with 99.9% uptime.',
      status: 'analyzed',
      analysis: {
        extractedCandidateName: 'Alex Rivera',
        experienceLevel: '1-3 years',
        yearsOfExperience: 2.5,
        technicalSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Docker', 'Git'],
        softSkills: ['Problem Solving', 'Effective Communication', 'Agile Collaboration'],
        technologies: ['React', 'Node.js', 'MongoDB', 'REST API', 'Redis'],
        education: [{ degree: 'B.S. Computer Science', institution: 'UC Berkeley', year: '2023', gpa: '3.85' }],
        workExperience: [{
          role: 'Full Stack Engineer',
          company: 'CloudTech Labs',
          duration: '2023 - Present',
          summary: 'Engineered responsive React frontend and optimized Express REST microservices.',
          highlights: ['Reduced API latency by 35% through MongoDB index optimizations', 'Built real-time collaboration widgets using WebSockets']
        }],
        projects: [{
          title: 'DevCollab Platform',
          description: 'Full stack collaborative code sharing tool built with MERN stack and WebSockets.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
          link: 'https://github.com/alexrivera-dev/devcollab'
        }],
        certifications: ['AWS Certified Cloud Practitioner', 'MongoDB Certified Professional'],
        achievements: ['Won 1st prize in HackSF 2024', 'Open source contributor to popular React UI libraries'],
        recommendedJobRoles: ['Full Stack Developer', 'Frontend Developer', 'MERN Stack Developer'],
        strengths: ['Strong modern React architecture and hooks proficiency', 'Solid database optimization and query planning experience'],
        weaknesses: ['Could expand on Kubernetes and high-scale distributed systems'],
        missingSkills: ['Kubernetes', 'GraphQL', 'Microservices Orchestration'],
        suggestedImprovements: ['Add quantitative business metrics to resume bullet points', 'Highlight cloud infrastructure and CI/CD pipelines']
      },
      scores: {
        overall: 88,
        technicalSkills: 90,
        experience: 84,
        projects: 92,
        education: 90,
        achievements: 82,
        resumeQuality: 88
      },
      isCurrentActive: true
    });

    candidateUser.activeResume = demoResume._id;
    await candidateUser.save();

    // Seed Completed Demo Interviews for candidate analytics
    const pastInterviewConfigs = [
      {
        role: 'Full Stack Developer',
        type: 'Technical',
        difficulty: 'Medium',
        overallScore: 86,
        techScore: 88,
        commScore: 82,
        probScore: 88,
        corrScore: 86,
        dateOffset: 6
      },
      {
        role: 'Frontend Developer',
        type: 'Technical',
        difficulty: 'Hard',
        overallScore: 92,
        techScore: 95,
        commScore: 88,
        probScore: 92,
        corrScore: 93,
        dateOffset: 3
      },
      {
        role: 'Full Stack Developer',
        type: 'System Design',
        difficulty: 'Hard',
        overallScore: 74,
        techScore: 75,
        commScore: 78,
        probScore: 72,
        corrScore: 71,
        dateOffset: 1
      }
    ];

    for (const conf of pastInterviewConfigs) {
      const interviewDate = new Date();
      interviewDate.setDate(interviewDate.getDate() - conf.dateOffset);

      const sampleQuestions = insertedQuestions.slice(0, 4);
      const questionsFormatted = sampleQuestions.map((q, idx) => ({
        questionId: q._id,
        questionText: q.question,
        category: q.category,
        difficulty: q.difficulty,
        type: q.type,
        expectedConcepts: q.expectedConcepts,
        evaluationCriteria: q.evaluationCriteria,
        idealAnswerPoints: q.idealAnswerPoints,
        order: idx + 1,
        isAnswered: true,
        isSkipped: false
      }));

      const interview = await Interview.create({
        user: candidateUser._id,
        role: conf.role,
        type: conf.type,
        difficulty: conf.difficulty,
        experienceLevel: '1-3 years',
        targetDurationMinutes: 30,
        totalQuestionsCount: 4,
        status: 'completed',
        startedAt: interviewDate,
        completedAt: new Date(interviewDate.getTime() + 25 * 60 * 1000),
        actualDurationSeconds: 1500,
        resumeUsed: demoResume._id,
        questions: questionsFormatted,
        scores: {
          overall: conf.overallScore,
          technicalScore: conf.techScore,
          communicationScore: conf.commScore,
          problemSolvingScore: conf.probScore,
          correctnessScore: conf.corrScore
        },
        report: {
          summary: `Candidate demonstrated exceptional aptitude for ${conf.role} roles with structured communication and solid depth in full-stack architecture.`,
          overallAssessment: `Strong technical proficiency demonstrated across modern JavaScript, React state management, and backend optimizations.`,
          strongAreas: ['React component lifecycle', 'Database indexing strategies', 'Clean code structure'],
          weakAreas: ['Distributed caching with Redis', 'Microservices fault tolerance'],
          skillsEvaluated: [
            { skill: 'React', score: 92 },
            { skill: 'JavaScript', score: 90 },
            { skill: 'Node.js', score: 85 },
            { skill: 'MongoDB', score: 80 }
          ],
          aiRecommendations: [
            'Practice complex system design questions with high-traffic distributed caches.',
            'Deepen understanding of event-driven messaging with Kafka/RabbitMQ.'
          ],
          suggestedNextPracticeTopics: ['System Design', 'Redis Caching', 'Concurrency'],
          generatedAt: interviewDate
        },
        createdAt: interviewDate
      });

      // Create answers for each question
      for (const [idx, q] of sampleQuestions.entries()) {
        await Answer.create({
          interview: interview._id,
          user: candidateUser._id,
          questionOrder: idx + 1,
          questionText: q.question,
          questionCategory: q.category,
          questionDifficulty: q.difficulty,
          candidateAnswer: `In my experience as a Full Stack Engineer, I approach this by analyzing ${q.expectedConcepts?.[0] || 'core concepts'} and ensuring clean architecture, modularity, and comprehensive test coverage. For instance, when designing high-concurrency solutions, I prioritize low latency and clear data separation.`,
          timeSpentSeconds: 180,
          evaluation: {
            score: Math.round(conf.overallScore / 10),
            correctness: Math.round(conf.corrScore / 10),
            relevance: 9,
            technicalKnowledge: Math.round(conf.techScore / 10),
            communication: Math.round(conf.commScore / 10),
            problemSolving: Math.round(conf.probScore / 10),
            shortFeedback: 'Well structured and technically accurate response.',
            detailedFeedback: `Candidate correctly addressed key concepts like ${q.expectedConcepts?.slice(0, 2).join(', ') || 'fundamentals'}. Good balance of technical detail and real-world applicability.`,
            strengths: ['Clear terminology', 'Structured thought process'],
            weaknesses: ['Could discuss performance benchmarking in more detail'],
            correctConcepts: q.expectedConcepts?.slice(0, 2) || [],
            missingConcepts: [],
            suggestedBetterAnswer: q.idealAnswerPoints?.[0] || 'Provide concrete performance benchmarks.',
            followUpQuestion: '',
            shouldAskFollowUp: false
          }
        });
      }
    }

    // Seed Bookmarks for candidate
    await Bookmark.create({
      user: candidateUser._id,
      question: insertedQuestions[0]._id,
      customQuestionText: insertedQuestions[0].question,
      category: insertedQuestions[0].category,
      difficulty: insertedQuestions[0].difficulty,
      role: 'Full Stack Developer',
      notes: 'Important question regarding closures and memory management. Review before final round interviews.',
      tags: ['Closures', 'MustReview']
    });

    await Bookmark.create({
      user: candidateUser._id,
      question: insertedQuestions[1]._id,
      customQuestionText: insertedQuestions[1].question,
      category: insertedQuestions[1].category,
      difficulty: insertedQuestions[1].difficulty,
      role: 'Frontend Developer',
      notes: 'Remember microtask queue executes completely before next macrotask.',
      tags: ['EventLoop', 'Async']
    });

    // Seed Notifications for candidate
    await Notification.create({
      user: candidateUser._id,
      title: 'Interview Completed!',
      message: 'You completed your Full Stack Developer mock simulation with a score of 92%.',
      type: 'interview_completed',
      isRead: true,
      link: '/interviews'
    });

    await Notification.create({
      user: candidateUser._id,
      title: 'Resume Analyzed Successfully',
      message: 'Your resume received an overall rating of 88/100.',
      type: 'resume_analyzed',
      isRead: false,
      link: '/resume'
    });

    logger.info('====================================================');
    logger.info('🎉 DATABASE SEED COMPLETED SUCCESSFULLY!');
    logger.info(`👑 Admin Account:     ${config.ADMIN_EMAIL} / ${config.ADMIN_PASSWORD}`);
    logger.info(`👤 Candidate Account: ${config.DEMO_CANDIDATE_EMAIL} / ${config.DEMO_CANDIDATE_PASSWORD}`);
    logger.info(`📚 Seeded Questions:  ${insertedQuestions.length}`);
    logger.info(`💼 Seeded Job Roles:  ${createdJobRoles.length}`);
    logger.info(`🏷️  Seeded Categories: ${createdCategories.length}`);
    logger.info('====================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error(`Database seeding failed: ${err.message}`, { stack: err.stack });
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
