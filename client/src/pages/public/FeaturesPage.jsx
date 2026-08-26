import React from 'react';
import { Bot, FileText, Code2, LineChart, Shield, Zap, Sparkles, Target, Compass, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const FeaturesPage = () => {
  const featureList = [
    {
      icon: Bot,
      title: 'Real-Time Adaptive Follow-Ups',
      desc: 'Our AI detects incomplete answers and dynamically injects architectural follow-up questions to test your real-world depth.'
    },
    {
      icon: FileText,
      title: 'AI Resume Keyword & Skill Parser',
      desc: 'Instant PDF/DOCX resume analysis extracting your experience level, detecting missing skills, and scoring resume quality out of 100.'
    },
    {
      icon: Code2,
      title: 'Distraction-Free Live Code Arena',
      desc: 'Built-in syntax-highlighted editor with starter boilerplate, runtime test cases, and AI automated code reviews.'
    },
    {
      icon: LineChart,
      title: 'Visual Radar & Performance Analytics',
      desc: 'Track metrics across Correctness, Problem Solving, Communication, and Technical Knowledge over time with interactive charts.'
    },
    {
      icon: Target,
      title: 'Instant Practice Drills & Bookmarks',
      desc: 'On-demand rapid question drilling by specific framework or topic with instant AI grading and bookmarking.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security & Isolation',
      desc: 'Built with JWT token rotation, bcrypt hashing, rate limiting, and zero exposure of internal LLM keys.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="primary" className="mb-3">Platform Features</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Everything You Need to Master Engineering Interviews
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          A full-stack suite of AI-driven tools designed to take you from initial resume screening to final round offers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <Link to="/register">
          <Button size="lg" variant="primary">
            Try InterviewAI Features Today
          </Button>
        </Link>
      </div>
    </div>
  );
};
