import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, Filter, Play, Trash2, PlusCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchRole, setSearchRole] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(searchRole ? { role: searchRole } : {}),
        ...(typeFilter !== 'All' ? { type: typeFilter } : {}),
        ...(difficultyFilter !== 'All' ? { difficulty: difficultyFilter } : {})
      };

      const res = await api.get('/interviews', { params });
      if (res.data.success) {
        setInterviews(res.data.data.interviews || []);
        setTotalPages(res.data.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load interview history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [page, typeFilter, difficultyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInterviews();
  };

  const handleDelete = async (interviewId) => {
    if (!window.confirm('Delete this interview record?')) return;
    try {
      await api.delete(`/interviews/${interviewId}`);
      toast.success('Interview deleted');
      fetchInterviews();
    } catch (err) {
      toast.error('Failed to delete interview');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interview History</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review your past mock simulations, scores, and detailed AI feedback.
          </p>
        </div>
        <Link to="/interviews/create">
          <Button variant="primary" icon={PlusCircle}>
            New Interview
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by role..."
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="All">All Formats</option>
              <option value="Technical">Technical</option>
              <option value="Coding">Coding</option>
              <option value="System Design">System Design</option>
              <option value="Resume-Based">Resume-Based</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <Button type="submit" variant="secondary" size="sm" className="w-full h-full">
              Filter Records
            </Button>
          </div>
        </form>
      </Card>

      {/* Interviews Table */}
      {interviews.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Matching Interviews Found"
          description="Try adjusting your filters or start a new simulation session."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {interviews.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {item.type}
                    </td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-bold">
                      {item.status === 'completed' ? (
                        <span className="text-brand-500 font-extrabold">{item.scores?.overall || 0}%</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={item.status === 'completed' ? 'success' : 'primary'} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {item.status === 'completed' ? (
                        <Link to={`/interviews/${item._id}/report`}>
                          <Button variant="outline" size="sm">
                            Scorecard
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/interviews/${item._id}`}>
                          <Button variant="primary" size="sm">
                            Resume
                          </Button>
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-slate-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
