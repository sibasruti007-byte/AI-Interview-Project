import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { UploadCloud, PlayCircle, Award, ArrowRight } from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      icon: UploadCloud,
      num: '01',
      title: 'Upload Resume & Pick Your Target Role',
      desc: 'Upload your latest CV in PDF or DOCX format. Our AI parser maps your demonstrated skills, detects gaps, and configures an interview tailored to your seniority.'
    },
    {
      icon: PlayCircle,
      num: '02',
      title: 'Engage with the Adaptive AI Interviewer',
      desc: 'Answer questions via text or write code in our integrated editor. The AI analyzes each response in real time, asking contextual follow-up questions if your answer lacks precision.'
    },
    {
      icon: Award,
      num: '03',
      title: 'Analyze Your Scorecard & Master Weak Topics',
      desc: 'Receive immediate multidimensional ratings (0-100%), ideal answer breakdowns, and curated practice drills targeting your identified weak areas.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="success" className="mb-3">Simple 3-Step Process</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          How InterviewAI Transforms Your Prep
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          No generic flashcards or static questionnaires. An intelligent simulation engine that challenges you like a real Principal Engineer.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.num} className="p-8 flex flex-col sm:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Step {s.num}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">{s.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Link to="/register">
          <Button size="lg" icon={ArrowRight}>
            Start Your First Mock Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};
