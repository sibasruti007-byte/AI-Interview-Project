import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Brain,
  Code2,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Play,
  Layers,
  Terminal,
  Target
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const LandingPage = () => {
  const stats = [
    { label: 'AI Simulations Run', value: '250,000+' },
    { label: 'Offer Conversion Rate', value: '88%' },
    { label: 'Curated Question Bank', value: '10,000+' },
    { label: 'Average Score Boost', value: '+34%' }
  ];

  const features = [
    {
      icon: Bot,
      title: 'Adaptive AI Interviewer',
      description: 'Conversational simulations that dynamically ask follow-up questions when your answer lacks technical depth.'
    },
    {
      icon: FileCheck,
      title: 'Resume-Grounded Questions',
      description: 'Extracts skills and projects from your uploaded resume to ask bespoke questions targeting your exact tech stack.'
    },
    {
      icon: Terminal,
      title: 'Live Coding & Text Modes',
      description: 'Interactive IDE with starter templates, language pickers, and automated test-case evaluation with AI code reviews.'
    },
    {
      icon: Brain,
      title: 'Multidimensional Scoring',
      description: 'Comprehensive evaluation across Correctness, Technical Knowledge, Communication, and Problem Solving.'
    },
    {
      icon: TrendingUp,
      title: 'Actionable Performance Analytics',
      description: 'Track score progression, radar proficiencies, and pinpoint weak topics with targeted practice drill recommendations.'
    },
    {
      icon: Target,
      title: 'Domain-Specific Drills',
      description: 'Tailored question banks for Frontend, Backend, Full Stack, DevOps, System Design, DSA, and Behavioral rounds.'
    }
  ];

  const interviewModes = [
    { name: 'Technical Depth', desc: 'Core language internals, frameworks, algorithms, and query optimizations.' },
    { name: 'System Design', desc: 'Distributed architectures, caching, scalability, sharding, and resilience.' },
    { name: 'Coding & DSA', desc: 'Timed algorithmic challenges with live code editor and test cases.' },
    { name: 'Behavioral & STAR', desc: 'Leadership, cross-functional collaboration, and crisis management.' },
    { name: 'Resume-Based Deep Dive', desc: 'Direct interrogation on projects, tech choices, and accomplishments on your CV.' },
    { name: 'HR & Culture Alignment', desc: 'Career motivations, problem resolution, compensation, and team dynamics.' }
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Resume & Target Role',
      desc: 'Our AI parses your experience level, skills, and target engineering position in seconds.'
    },
    {
      step: '02',
      title: 'Launch Adaptive Simulation',
      desc: 'Engage in a distraction-free, timed mock session with real-time dynamic follow-ups.'
    },
    {
      step: '03',
      title: 'Receive Deep AI Scorecard',
      desc: 'Inspect dimension scores, ideal answer comparisons, and tailored practice recommendations.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Autonomous AI Interview Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Master Any Technical Interview with{' '}
            <span className="bg-gradient-to-r from-brand-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Autonomous AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Experience hyper-realistic technical and behavioral mock interviews. Get instant evaluations, adaptive follow-up challenges, and personalized radar scorecards.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto text-base">
                Start Free Interview
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                Explore How It Works
              </Button>
            </Link>
          </div>

          {/* Interactive Simulation Preview Showcase */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 dark:opacity-30 -z-10" />
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-left text-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2">InterviewAI — Active Session: Full Stack Developer</span>
                </div>
                <Badge variant="primary" size="sm">
                  Live AI Evaluation
                </Badge>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
                  <p className="text-brand-400 font-semibold mb-1">AI Interviewer (Question 3/5):</p>
                  <p className="text-slate-200">
                    "Explain the difference between useMemo and useCallback in React. In what scenarios does premature memoization hurt performance?"
                  </p>
                </div>

                <div className="bg-brand-950/30 border border-brand-800/40 p-4 rounded-xl">
                  <p className="text-cyan-400 font-semibold mb-1">Candidate Answer:</p>
                  <p className="text-slate-300">
                    "useMemo caches computed values while useCallback caches function definitions. Premature memoization adds memory overhead for dependency array comparisons..."
                  </p>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-400 font-semibold">AI Real-time Feedback & Adaptive Follow-up:</p>
                    <p className="text-slate-300 text-xs mt-1">
                      Score: 9/10 • Strong explanation of function reference equality.
                    </p>
                    <p className="text-brand-300 text-xs mt-2 italic">
                      Follow-up: "Can you elaborate on how React 18 automatic batching affects state re-renders in custom hooks?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-brand-600 dark:text-brand-400 tracking-tight">
                  {s.value}
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-3">Comprehensive Capabilities</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Engineered for Modern Engineering Rounds
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">
            Every feature is tailored to simulate real-world hiring loops at top technology companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Interview Modes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-3">6 Specialized Formats</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Prepare for Every Stage of the Loop
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewModes.map((mode, i) => (
            <div
              key={mode.name}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center shrink-0">
                0{i + 1}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{mode.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{mode.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="success" className="mb-3">Effortless Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            From Preparation to Offer in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-5xl font-black text-slate-200 dark:text-slate-800 block mb-4">
                {step.step}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-brand-700 via-brand-600 to-cyan-500 p-8 sm:p-14 text-white text-center shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Ace Your Next Senior Engineering Interview?
          </h2>
          <p className="mt-4 text-brand-100 max-w-xl mx-auto text-base sm:text-lg">
            Join thousands of software engineers using InterviewAI to sharpen their skills and land top-tier offers.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-500 shadow-xl text-base font-bold">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
