const Question = require('../../models/Question');
const aiService = require('./ai.service');
const promptService = require('./prompt.service');
const logger = require('../../utils/logger');

class InterviewService {
  async generateInterviewQuestions({ role, type, difficulty, experienceLevel, count, userSkills = [], resumeExcerpt = '' }) {
    // 1. Check if we have pre-seeded questions matching criteria in DB
    const seededMatches = await Question.find({
      $or: [
        { role: new RegExp(role, 'i') },
        { tags: { $in: userSkills.map(s => new RegExp(s, 'i')) } }
      ],
      difficulty: difficulty
    }).limit(count * 2);

    // 2. Prepare AI prompt to generate tailored customized questions
    const { systemPrompt, userPrompt } = await promptService.getPrompt('question_generation', {
      role,
      type,
      difficulty,
      experienceLevel,
      count,
      candidateSkills: userSkills.join(', ') || 'General Full Stack Development',
      resumeExcerpt: resumeExcerpt ? resumeExcerpt.slice(0, 1500) : 'None'
    });

    const fallbackGenerator = () => {
      // If DB has questions, format them
      if (seededMatches.length >= count) {
        return {
          questions: seededMatches.slice(0, count).map(q => ({
            question: q.question,
            category: q.category,
            difficulty: q.difficulty,
            type: q.type,
            expectedConcepts: q.expectedConcepts,
            evaluationCriteria: q.evaluationCriteria,
            idealAnswerPoints: q.idealAnswerPoints,
            codeStarter: q.codeStarter || '',
            tags: q.tags
          }))
        };
      }
      return this._generateHeuristicQuestions(role, type, difficulty, count);
    };

    const aiResult = await aiService.generateStructuredJSON(systemPrompt, userPrompt, fallbackGenerator);
    const questionsList = (aiResult && Array.isArray(aiResult.questions) && aiResult.questions.length > 0)
      ? aiResult.questions
      : fallbackGenerator().questions;

    // Normalize and return questions
    return questionsList.slice(0, count).map((q, idx) => ({
      questionText: q.question || q.questionText || `Question ${idx + 1} regarding ${role}`,
      category: q.category || 'General',
      difficulty: q.difficulty || difficulty,
      type: q.type || type,
      expectedConcepts: Array.isArray(q.expectedConcepts) ? q.expectedConcepts : ['Core concepts', 'Best practices'],
      evaluationCriteria: Array.isArray(q.evaluationCriteria) ? q.evaluationCriteria : ['Clarity', 'Technical depth'],
      idealAnswerPoints: Array.isArray(q.idealAnswerPoints) ? q.idealAnswerPoints : ['Comprehensive explanation'],
      codeStarter: q.codeStarter || '',
      order: idx + 1,
      isAnswered: false,
      isSkipped: false
    }));
  }

  _generateHeuristicQuestions(role, type, difficulty, count) {
    const roleQuestionsMap = {
      'Frontend Developer': [
        {
          question: 'Explain the Virtual DOM in React and how the reconciliation process with Fiber works.',
          category: 'React',
          difficulty: 'Medium',
          type: 'Technical',
          expectedConcepts: ['Diffing algorithm', 'Fiber tree', 'Render phase vs Commit phase', 'Key prop optimization'],
          evaluationCriteria: ['Accurate diffing explanation', 'Understanding of performance gains', 'Component re-render awareness'],
          idealAnswerPoints: ['Virtual DOM is an in-memory representation of real DOM', 'React creates a fiber work-in-progress tree', 'Keys help identify elements that changed, were added or removed'],
          tags: ['React', 'Frontend', 'JavaScript']
        },
        {
          question: 'What is the Event Loop in JavaScript, and how do microtasks differ from macrotasks?',
          category: 'JavaScript',
          difficulty: 'Medium',
          type: 'Technical',
          expectedConcepts: ['Call stack', 'Web APIs', 'Task queue', 'Microtask queue (Promises/MutationObserver)', 'Render queue'],
          evaluationCriteria: ['Execution priority clarity', 'Understanding of async flow', 'Code execution prediction accuracy'],
          idealAnswerPoints: ['Call stack executes synchronous code first', 'Microtasks execute immediately after the current task finishes and before macrotasks', 'Macrotasks include setTimeout, setInterval, I/O'],
          tags: ['JavaScript', 'Async', 'EventLoop']
        },
        {
          question: 'How do you optimize Web Vitals (LCP, FID/INP, CLS) in a modern single-page application?',
          category: 'Frontend',
          difficulty: 'Hard',
          type: 'Technical',
          expectedConcepts: ['Image optimization & modern formats', 'Code splitting / Lazy loading', 'Font display swap', 'Layout stability', 'Bundle minification'],
          evaluationCriteria: ['Knowledge of core Web Vitals definitions', 'Actionable remediation strategies', 'Production impact awareness'],
          idealAnswerPoints: ['LCP improved by SSR, CDN caching, preloading hero assets', 'INP improved by breaking long tasks with requestIdleCallback or web workers', 'CLS avoided by explicit width/height dimensions on images/embeds'],
          tags: ['Web Performance', 'React', 'CSS']
        }
      ],
      'Backend Developer': [
        {
          question: 'How would you architect and implement token-based authentication with Access and Refresh tokens in Node.js?',
          category: 'Node.js',
          difficulty: 'Medium',
          type: 'Technical',
          expectedConcepts: ['JWT structure', 'Short-lived access tokens', 'Long-lived refresh token storage in DB', 'Token rotation & revocation', 'HttpOnly Cookies'],
          evaluationCriteria: ['Security awareness (XSS vs CSRF)', 'Token lifecycle and edge cases', 'Revocation strategies'],
          idealAnswerPoints: ['Access token stored in memory/headers with short lifespan (15m)', 'Refresh token stored in DB and secure HttpOnly cookie', 'Rotate refresh token on every usage and revoke compromised family on reuse'],
          tags: ['Auth', 'Node.js', 'Security']
        },
        {
          question: 'Explain MongoDB indexing strategies, including compound indexes and the Equality, Sort, Range (ESR) rule.',
          category: 'MongoDB',
          difficulty: 'Hard',
          type: 'Technical',
          expectedConcepts: ['B-Tree indexes', 'Compound indexes', 'ESR rule (Equality, Sort, Range)', 'Index cardinality', 'Covered queries'],
          evaluationCriteria: ['Query plan understanding (explain())', 'Index creation cost vs read speed balance', 'Correct ordering application'],
          idealAnswerPoints: ['Compound indexes should order keys as: Equality matches first, Sort fields second, Range filters last', 'Covered queries read directly from index without document fetch', 'Over-indexing slows down write throughput'],
          tags: ['MongoDB', 'Database', 'Performance']
        }
      ],
      'Full Stack Developer': [
        {
          question: 'Describe how you would design an end-to-end real-time notification system using WebSockets/SSE, Node.js, and React.',
          category: 'System Design',
          difficulty: 'Hard',
          type: 'System Design',
          expectedConcepts: ['WebSocket handshake', 'Connection management & heartbeat', 'Redis Pub/Sub for multi-instance horizontal scaling', 'Reconnection & missed message buffer', 'Client-side state sync'],
          evaluationCriteria: ['Scalability across multiple server instances', 'Fault tolerance and network disconnect handling', 'Clean client-side state integration'],
          idealAnswerPoints: ['Client establishes WSS connection authenticated via handshake token', 'Redis Pub/Sub distributes notifications across distributed Node instances', 'Store unread notifications in database and sync on reconnection with sequence IDs'],
          tags: ['FullStack', 'WebSocket', 'SystemDesign']
        }
      ]
    };

    const genericPool = [
      {
        question: 'Explain the SOLID design principles with concrete practical examples in modern software development.',
        category: 'System Design',
        difficulty: 'Medium',
        type: 'Technical',
        expectedConcepts: ['Single Responsibility', 'Open-Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'],
        evaluationCriteria: ['Clear definition of each letter', 'Realistic code/architecture example for each', 'Understanding of maintainability advantages'],
        idealAnswerPoints: ['SRP: Single reason to change', 'OCP: Open for extension, closed for modification', 'DIP: Depend on abstractions, not concretions'],
        tags: ['Architecture', 'CleanCode']
      },
      {
        question: 'Describe a situation where you encountered a critical production bug or outage. How did you diagnose, mitigate, and prevent recurrence?',
        category: 'Behavioral',
        difficulty: 'Medium',
        type: 'Behavioral',
        expectedConcepts: ['STAR method (Situation, Task, Action, Result)', 'Root Cause Analysis', 'Blameless post-mortem', 'Observability / Monitoring', 'Automated regression tests'],
        evaluationCriteria: ['Calm structured problem solving', 'Ownership and leadership', 'Systemic preventive mindset'],
        idealAnswerPoints: ['Identified symptom via APM/logs', 'Applied immediate mitigation/rollback to stop user impact', 'Conducted post-mortem and added automated tests/alerts'],
        tags: ['Behavioral', 'STAR', 'Leadership']
      }
    ];

    const matched = roleQuestionsMap[role] || roleQuestionsMap['Full Stack Developer'] || [];
    const pool = [...matched, ...genericPool];

    const questions = [];
    for (let i = 0; i < count; i++) {
      const template = pool[i % pool.length];
      questions.push({
        ...template,
        difficulty: difficulty
      });
    }

    return { questions };
  }
}

module.exports = new InterviewService();
