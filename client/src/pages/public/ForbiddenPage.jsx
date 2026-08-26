import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Home } from 'lucide-react';

export const ForbiddenPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white">403</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">Access Denied</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-8">
        You do not have administrator permissions to access this protected area.
      </p>
      <Link to="/dashboard">
        <Button icon={Home} variant="primary">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
