import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQPage = () => {
  const faqs = [
    {
      q: 'How does InterviewAI generate personalized interview questions?',
      a: 'Our platform ingests your target job role, experience level, difficulty settings, and parsed resume keywords. It synthesizes structured questions that probe both high-level system trade-offs and language-specific fundamentals.'
    },
    {
      q: 'What is the adaptive follow-up feature?',
      a: 'If your initial response misses critical edge cases, concurrency pitfalls, or performance optimizations, the AI interviewer dynamically constructs an intelligent follow-up question to test your depth before moving to the next topic.'
    },
    {
      q: 'Are coding challenges supported?',
      a: 'Yes. Our coding simulation mode includes problem descriptions, code boilerplate in multiple languages, automated test cases, and AI algorithmic code evaluation.'
    },
    {
      q: 'What formats can I upload my resume in?',
      a: 'InterviewAI supports PDF, DOC, and DOCX files up to 10MB. Our server performs strict MIME type and file validation.'
    },
    {
      q: 'Is my personal data and resume secure?',
      a: 'Yes. All authentication uses bcrypt hashing and rotating JWTs with strict RBAC. We never sell your data or expose LLM keys to the client.'
    }
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center">
        <Badge variant="primary" className="mb-3">Frequently Asked Questions</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Everything You Need to Know
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Find answers to common questions about our AI interview engine and scoring methodology.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <Card
              key={faq.q}
              className="p-6 cursor-pointer"
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{faq.q}</h3>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-brand-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </div>
              {isOpen && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
