import React, { useState, useEffect } from 'react';
import {
  Users,
  PlayCircle,
  Award,
  Zap,
  TrendingUp,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load admin metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalUsers: 0,
    activeUsers: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    averagePlatformScore: 0,
    totalAiRequests: 0
  };

  const popularRoles = data?.popularRoles || [];
  const popularTypes = data?.popularTypes || [];
  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-500" />
            <Badge variant="warning" size="sm">System Administrator</Badge>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Platform Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System-wide candidate engagement, AI compute calls, and role distribution.
          </p>
        </div>
      </div>

      {/* 4 Primary System Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-500 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Candidates</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {metrics.totalUsers}
            </h3>
            <span className="text-[11px] text-emerald-500 font-medium">{metrics.activeUsers} active accounts</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-500 flex items-center justify-center shrink-0">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Simulations</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {metrics.totalInterviews}
            </h3>
            <span className="text-[11px] text-slate-400">{metrics.completedInterviews} completed</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Platform Average Score</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {metrics.averagePlatformScore}%
            </h3>
            <span className="text-[11px] text-emerald-500 font-medium">Standard baseline</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-500 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total AI Calls</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {metrics.totalAiRequests}
            </h3>
            <span className="text-[11px] text-purple-400 font-medium">Evaluations & questions</span>
          </div>
        </Card>
      </div>

      {/* Popular Roles & Formats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Most Practiced Job Roles</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Total candidate simulation counts by role</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularRoles} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="role" stroke="#64748b" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Simulations" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Interview Format Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Breakdown by simulation type</p>

          <div className="h-64 w-full flex items-center justify-center">
            {popularTypes.length === 0 ? (
              <span className="text-xs text-slate-500">No simulation data available.</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularTypes}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {popularTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
