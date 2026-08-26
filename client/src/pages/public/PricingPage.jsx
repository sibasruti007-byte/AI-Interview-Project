import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage = () => {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: 'Forever free',
      desc: 'Essential practice for developers getting ready for interviews.',
      features: [
        '5 AI Mock Interviews per month',
        'Basic Resume Parser & Skill Extraction',
        'Text Answer Evaluation & Scoring',
        'Access to 100+ Question Bank',
        'Community Support'
      ],
      cta: 'Get Started Free',
      highlight: false
    },
    {
      name: 'Pro Engineer',
      price: '$29',
      period: 'per month',
      desc: 'Uncapped adaptive simulations with live coding and deep analytics.',
      features: [
        'Unlimited AI Mock Interviews',
        'Adaptive Follow-Up Interrogations',
        'Deep Resume Scoring & Gap Analysis',
        'Interactive Code Editor with Test Cases',
        'Multidimensional Radar Scorecards',
        'Custom Job Role & Difficulty Tuning',
        'Priority AI Compute'
      ],
      cta: 'Start Pro Free Trial',
      highlight: true
    },
    {
      name: 'Team / Enterprise',
      price: '$99',
      period: 'per month',
      desc: 'For bootcamps and hiring teams screening candidate cohorts.',
      features: [
        'Everything in Pro Engineer',
        'Admin Dashboard & Candidate Tracking',
        'Custom Question Bank Creation',
        'Custom AI Prompt Version Management',
        'Exportable PDF Evaluation Reports',
        'Dedicated SLA & Support'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="primary" className="mb-3">Transparent Pricing</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Invest in Your Career & Land Higher Offers
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Choose the plan that fits your preparation timeline. Upgrade or cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`p-8 flex flex-col justify-between relative ${
              tier.highlight
                ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-xl'
                : ''
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge variant="primary" size="sm" className="shadow-md">
                  Most Popular
                </Badge>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">{tier.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                <span className="text-sm text-slate-500">/{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/register">
              <Button
                variant={tier.highlight ? 'primary' : 'outline'}
                className="w-full"
              >
                {tier.cta}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
