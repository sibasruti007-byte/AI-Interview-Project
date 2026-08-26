import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  Play,
  Trophy,
  Flame,
  Award,
  BarChart3,
  ArrowRight,
  Clock,
  Target,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (e) {
        // Fallback state
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-44 w-full rounded-3xl" />
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

  const stats = data?.stats || {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    currentStreak: 0,
    profileCompletion: user?.profileCompletion || 40
  };

  const performanceTrend = data?.performanceTrend || [];
  const skillPerformance = data?.skillPerformance || [];
  const recentInterviews = data?.recentInterviews || [];
  const recommendedAreas = data?.recommendedAreas || ['System Design', 'React State', 'Async JavaScript'];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-700 to-cyan-600 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Candidate Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready for your next mock round, {user?.name?.split(' ')[0] || 'Candidate'}?
            </h2>
            <p className="mt-1 text-sm text-brand-100 max-w-xl">
              Your target role is set to <strong>{user?.profile?.targetRole || 'Full Stack Developer'}</strong>. Keep your streak alive!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/interviews/create">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg font-bold">
                <PlusCircle className="w-5 h-5 mr-2" /> Start Interview
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-brand-100">
          <div className="flex items-center gap-2">
            <span>Profile Completion: {stats.profileCompletion}%</span>
            <div className="w-36 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-300 rounded-full transition-all duration-500"
                style={{ width: `${stats.profileCompletion}%` }}
              />
            </div>
          </div>
          {stats.profileCompletion < 100 && (
            <Link to="/profile" className="underline hover:text-white">
              Complete profile for better AI accuracy →
            </Link>
          )}
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Simulations</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {stats.totalInterviews}
            </h3>
            <span className="text-[11px] text-slate-400">{stats.completedInterviews} finished</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Score</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {stats.averageScore}%
            </h3>
            <span className="text-[11px] text-emerald-500 font-medium">Best: {stats.bestScore}%</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Streak</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {stats.currentStreak} Days
            </h3>
            <span className="text-[11px] text-amber-500 font-medium">Consistency matters</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Next Focus</p>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate max-w-[130px]">
              {recommendedAreas[0] || 'System Design'}
            </h3>
            <Link to="/practice" className="text-[11px] text-purple-500 hover:underline">
              Practice drills →
            </Link>
          </div>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Progression Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Score Progression</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Historical interview performance over time</p>
            </div>
            <Badge variant="primary" size="sm">Last 10 Rounds</Badge>
          </div>
          {performanceTrend.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-500">
              No interview scores recorded yet. Complete your first session to unlock trends.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="overall"
                    name="Overall Score"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Skill Performance Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Topic Proficiency</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Average evaluation score across domains</p>
            </div>
            <Badge variant="success" size="sm">Live Radar</Badge>
          </div>
          {skillPerformance.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-500">
              Complete interview answers to generate topic breakdown.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillPerformance.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="skill" stroke="#64748b" fontSize={11} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="score" name="Proficiency %" fill="#0284c7" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Recommended Practice Areas Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 to-brand-950/80 border-brand-800/40 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold">AI Recommended Next Practice</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Based on recent simulation scorecards, drilling these topics will yield the highest rating boost:
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {recommendedAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 rounded-lg bg-brand-500/20 border border-brand-500/30 text-xs font-semibold text-cyan-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
          <Link to="/practice">
            <Button variant="primary" size="md">
              Start Drill Session
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Interviews Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Interview Sessions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review past scorecards or resume in-progress rounds</p>
          </div>
          <Link to="/interviews" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            View All History →
          </Link>
        </div>

        {recentInterviews.length === 0 ? (
          <EmptyState
            icon={Play}
            title="No Interviews Yet"
            description="Create your first tailored interview simulation to see scores, radar feedback, and recommendations."
            actionText="Configure Interview"
            onAction={() => navigate('/interviews/create')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {recentInterviews.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {item.role}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {item.type}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          item.difficulty === 'Expert' || item.difficulty === 'Hard'
                            ? 'danger'
                            : item.difficulty === 'Medium'
                            ? 'warning'
                            : 'success'
                        }
                        size="sm"
                      >
                        {item.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      {item.status === 'completed' ? (
                        <span className="text-emerald-500">{item.scores?.overall || 0}%</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={item.status === 'completed' ? 'success' : 'primary'}
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'completed' ? (
                        <Link to={`/interviews/${item._id}/report`}>
                          <Button variant="outline" size="sm">
                            View Report
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/interviews/${item._id}`}>
                          <Button variant="primary" size="sm">
                            Resume
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
