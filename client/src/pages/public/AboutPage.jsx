import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Users, Target, ShieldCheck } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="primary" className="mb-3">Our Mission</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Democratizing Elite Tech Interview Preparation
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          We built InterviewAI because traditional interview prep is broken. Flashcards and memorization do not prepare engineers for real architectural inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Realism First</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Our AI interviewer is tuned to challenge assumptions, ask follow-up questions, and mimic the scrutiny of top tech engineering panels.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Personalized Guidance</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every candidate has unique strengths. We analyze your real resume to target your exact gaps rather than wasting your time on irrelevant topics.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Data Privacy & Trust</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your resumes and session answers belong to you. We apply strict encryption, access control, and zero data selling policies.
          </p>
        </Card>
      </div>
    </div>
  );
};
