import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, Trash2, Edit, Save, X, Layers } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formState, setFormState] = useState({
    question: '',
    category: 'JavaScript',
    role: 'Full Stack Developer',
    difficulty: 'Medium',
    type: 'Technical',
    expectedConcepts: '',
    evaluationCriteria: '',
    idealAnswerPoints: '',
    tags: ''
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(search ? { search } : {}),
        ...(categoryFilter !== 'All' ? { category: categoryFilter } : {}),
        ...(difficultyFilter !== 'All' ? { difficulty: difficultyFilter } : {})
      };

      const res = await api.get('/admin/questions', { params });
      if (res.data.success) {
        setQuestions(res.data.data.questions || []);
        setTotalPages(res.data.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load question bank');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, categoryFilter, difficultyFilter]);

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormState({
      question: '',
      category: 'JavaScript',
      role: 'Full Stack Developer',
      difficulty: 'Medium',
      type: 'Technical',
      expectedConcepts: '',
      evaluationCriteria: '',
      idealAnswerPoints: '',
      tags: ''
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setFormState({
      question: q.question || '',
      category: q.category || 'JavaScript',
      role: q.role || 'Full Stack Developer',
      difficulty: q.difficulty || 'Medium',
      type: q.type || 'Technical',
      expectedConcepts: (q.expectedConcepts || []).join(', '),
      evaluationCriteria: (q.evaluationCriteria || []).join(', '),
      idealAnswerPoints: (q.idealAnswerPoints || []).join(', '),
      tags: (q.tags || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        question: formState.question,
        category: formState.category,
        role: formState.role,
        difficulty: formState.difficulty,
        type: formState.type,
        expectedConcepts: formState.expectedConcepts.split(',').map((s) => s.trim()).filter(Boolean),
        evaluationCriteria: formState.evaluationCriteria.split(',').map((s) => s.trim()).filter(Boolean),
        idealAnswerPoints: formState.idealAnswerPoints.split(',').map((s) => s.trim()).filter(Boolean),
        tags: formState.tags.split(',').map((s) => s.trim()).filter(Boolean)
      };

      if (editingQuestion) {
        await api.put(`/admin/questions/${editingQuestion._id}`, payload);
        toast.success('Question updated successfully');
      } else {
        await api.post('/admin/questions', payload);
        toast.success('Question created in Question Bank');
      }

      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save question');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question from Question Bank?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      toast.success('Question deleted');
      fetchQuestions();
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Question Bank Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, update, tag, and organize curated questions across all tech stacks.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} variant="primary" icon={Plus}>
          Add New Question
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search question text or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="MongoDB">MongoDB</option>
              <option value="System Design">System Design</option>
              <option value="DSA">DSA</option>
              <option value="Behavioral">Behavioral</option>
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
            <Button
              onClick={() => {
                setPage(1);
                fetchQuestions();
              }}
              variant="secondary"
              size="sm"
              className="w-full h-full"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Questions Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Question</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {questions.map((q) => (
                <tr key={q._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 max-w-md">
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-2">{q.question}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {q.tags?.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="primary" size="sm">{q.category}</Badge>
                  </td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-300">
                    {q.role}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={
                        q.difficulty === 'Expert' || q.difficulty === 'Hard'
                          ? 'danger'
                          : q.difficulty === 'Medium'
                          ? 'warning'
                          : 'success'
                      }
                      size="sm"
                    >
                      {q.difficulty}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Question"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Create / Edit Question Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingQuestion ? 'Edit Interview Question' : 'Create New Interview Question'}
        size="lg"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Question Statement
            </label>
            <textarea
              required
              rows={3}
              value={formState.question}
              onChange={(e) => setFormState({ ...formState, question: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <input
                type="text"
                required
                value={formState.role}
                onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={formState.difficulty}
                onChange={(e) => setFormState({ ...formState, difficulty: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Expected Concepts (Comma-separated)
            </label>
            <input
              type="text"
              value={formState.expectedConcepts}
              onChange={(e) => setFormState({ ...formState, expectedConcepts: e.target.value })}
              placeholder="e.g. Reconciliation, Fiber tree, Key prop"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ideal Answer Points (Comma-separated)
            </label>
            <input
              type="text"
              value={formState.idealAnswerPoints}
              onChange={(e) => setFormState({ ...formState, idealAnswerPoints: e.target.value })}
              placeholder="e.g. Explain Virtual DOM memory tree, Discuss commit phase"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Search Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={formState.tags}
              onChange={(e) => setFormState({ ...formState, tags: e.target.value })}
              placeholder="React, Hooks, Frontend"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Save}>
              Save Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
