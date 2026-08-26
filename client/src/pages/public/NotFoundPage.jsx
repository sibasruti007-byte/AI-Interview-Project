import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-8">
        The page you are looking for doesn't exist or has been moved to another URL.
      </p>
      <Link to="/">
        <Button icon={Home} variant="primary">
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
};
