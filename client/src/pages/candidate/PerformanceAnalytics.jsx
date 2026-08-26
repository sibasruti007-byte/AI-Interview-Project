import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PerformanceAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/performance');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load performance analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-40 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const performanceTrend = data?.performanceTrend || [];
  const skillPerformance = data?.skillPerformance || [];
  const strongSkills = data?.strongSkills || [];
  const weakSkills = data?.weakSkills || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Performance Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          In-depth dimensional metrics and score progression across your AI interview history.
        </p>
      </div>

      {/* Primary Dimensional Trend Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Dimensional Scoring History</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tracking Technical Depth, Problem Solving, and Communication across recent rounds
            </p>
          </div>
          <Badge variant="primary" size="sm">Multi-Axis</Badge>
        </div>

        {performanceTrend.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-xs text-slate-500">
            No interview history yet. Complete interviews to populate analytics.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="overall" name="Overall" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                <Area type="monotone" dataKey="technical" name="Technical" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                <Area type="monotone" dataKey="communication" name="Communication" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Topic Breakdown & Strengths/Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Domain Proficiency</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Average ratings by question category</p>

          {skillPerformance.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-500">
              No category data yet.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillPerformance} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="skill" stroke="#64748b" fontSize={11} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="score" name="Rating %" fill="#0284c7" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Strengths & Weaknesses Badges */}
        <Card className="p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Skill Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              AI classified proficiencies based on your simulated responses
            </p>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-500 tracking-wider block mb-2">
                  Strong Areas (70%+):
                </span>
                <div className="flex flex-wrap gap-2">
                  {strongSkills.length === 0 ? (
                    <span className="text-xs text-slate-400">Complete more simulations to detect strengths.</span>
                  ) : (
                    strongSkills.map((s) => (
                      <Badge key={s} variant="success" size="md">
                        {s}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase text-rose-500 tracking-wider block mb-2">
                  Recommended Practice Areas (&lt;70%):
                </span>
                <div className="flex flex-wrap gap-2">
                  {weakSkills.length === 0 ? (
                    <span className="text-xs text-slate-400">No major gaps identified yet.</span>
                  ) : (
                    weakSkills.map((w) => (
                      <Badge key={w} variant="danger" size="md">
                        {w}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
