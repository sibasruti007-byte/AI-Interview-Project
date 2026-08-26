import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="bg-gradient-to-r from-slate-900 via-brand-700 to-brand-500 dark:from-white dark:via-brand-200 dark:to-cyan-400 bg-clip-text text-transparent">
                InterviewAI
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
              Autonomous AI-powered interview practice platform. Bridge technical skill gaps with personalized mock simulations, real-time code reviews, and deep analytics.
            </p>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} InterviewAI Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/features" className="text-slate-500 hover:text-brand-500">Features</Link></li>
              <li><Link to="/how-it-works" className="text-slate-500 hover:text-brand-500">How It Works</Link></li>
              <li><Link to="/pricing" className="text-slate-500 hover:text-brand-500">Pricing</Link></li>
              <li><Link to="/practice" className="text-slate-500 hover:text-brand-500">Practice Drills</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-slate-500 hover:text-brand-500">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-brand-500">Contact</Link></li>
              <li><Link to="/faq" className="text-slate-500 hover:text-brand-500">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-slate-500 hover:text-brand-500">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-brand-500">Terms of Service</a></li>
              <li><a href="#" className="text-slate-500 hover:text-brand-500">Security</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
