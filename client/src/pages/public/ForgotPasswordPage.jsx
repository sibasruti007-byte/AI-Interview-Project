import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [devResetToken, setDevResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post('/auth/forgot-password', { email });
      setResetSent(true);
      if (data.data?.resetToken) {
        setDevResetToken(data.data.resetToken);
      }
      toast.success(data.message || 'Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Enter your email to receive secure recovery instructions
          </p>
        </div>

        <Card className="p-8">
          {resetSent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Instructions have been sent to <strong>{email}</strong>. Please check your inbox.
              </p>
              {devResetToken && (
                <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-left">
                  <p className="text-[11px] font-bold text-brand-500 uppercase">Dev Environment Helper:</p>
                  <Link
                    to={`/reset-password/${devResetToken}`}
                    className="text-xs text-brand-400 underline break-all block mt-1"
                  >
                    Click to Open Password Reset Screen directly
                  </Link>
                </div>
              )}
              <Link to="/login" className="block text-xs font-semibold text-brand-500 hover:underline pt-2">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <Button type="submit" isLoading={loading} icon={ArrowRight} className="w-full">
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-slate-500 hover:text-brand-500">
                  Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
