import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const LoginPage = () => {
  const { login, loginWithMock } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await login(data.email, data.password);
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const status = err.response?.status;
      let errorMessage = 'Login failed. Please check your credentials.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (status === 403) {
        errorMessage = 'Your account has been deactivated. Please contact support.';
      } else if (err.code === 'ERR_NETWORK' || status === 502 || status === 504 || !err.response) {
        errorMessage = 'Unable to reach backend server (port 5000). Use Dev Bypass or run "npm run dev".';
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@interviewai.com');
      setValue('password', 'AdminPass123!');
    } else {
      setValue('email', 'candidate@interviewai.com');
      setValue('password', 'CandidatePass123!');
    }
    toast.success(`Filled ${role} credentials`);
  };

  const handleInstantLogin = async (role) => {
    setLoading(true);
    const email = role === 'admin' ? 'admin@interviewai.com' : 'candidate@interviewai.com';
    const password = role === 'admin' ? 'AdminPass123!' : 'CandidatePass123!';
    setValue('email', email);
    setValue('password', password);

    try {
      const user = await login(email, password);
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // If network/proxy failed, fall back to mock session directly
      const mockUser = loginWithMock(role);
      if (mockUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 items-center justify-center text-white shadow-lg shadow-brand-500/25 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back to InterviewAI
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Sign in to continue your AI technical interview simulations
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" isLoading={loading} icon={ArrowRight} className="w-full mt-2">
              Sign In to Account
            </Button>
          </form>

          {/* Quick Demo & Dev Bypass Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Instant Demo Logins
              </span>
              <span className="text-[10px] text-brand-500 font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" /> 1-Click Login
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInstantLogin('candidate')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium rounded-xl border border-brand-200 dark:border-brand-900/50 bg-brand-50/50 dark:bg-brand-950/30 hover:bg-brand-100 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-300 transition-colors shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-500" />
                Demo Candidate
              </button>
              <button
                type="button"
                onClick={() => handleInstantLogin('admin')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                Demo Admin
              </button>
            </div>
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => handleQuickFill('candidate')}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors underline"
              >
                Or fill form fields only
              </button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
};
