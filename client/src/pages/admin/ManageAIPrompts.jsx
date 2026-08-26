import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit, CheckCircle2, History, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ManageAIPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  const [formState, setFormState] = useState({
    name: '',
    type: 'question_generation',
    systemPrompt: '',
    template: '',
    description: '',
    isActive: true
  });

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/prompts');
      if (res.data.success) {
        setPrompts(res.data.data.prompts || []);
      }
    } catch (err) {
      toast.error('Failed to load AI prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingPrompt(null);
    setFormState({
      name: 'Custom AI Prompt v1',
      type: 'question_generation',
      systemPrompt: 'You are an AI interviewer...',
      template: 'Context: {{role}}, {{difficulty}}',
      description: 'Custom prompt template version',
      isActive: true
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingPrompt(p);
    setFormState({
      name: p.name,
      type: p.type,
      systemPrompt: p.systemPrompt,
      template: p.template,
      description: p.description || '',
      isActive: p.isActive
    });
    setModalOpen(true);
  };

  const handleSavePrompt = async (e) => {
    e.preventDefault();
    try {
      if (editingPrompt) {
        await api.put(`/admin/prompts/${editingPrompt._id}`, formState);
        toast.success('Prompt version updated');
      } else {
        await api.post('/admin/prompts', formState);
        toast.success('New AI Prompt version created and activated');
      }
      setModalOpen(false);
      fetchPrompts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save prompt');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI System Prompts Manager</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tune system prompts, inject parameters, and manage active prompt versions across all AI services.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} variant="primary" icon={Plus}>
          Create Prompt Version
        </Button>
      </div>

      <div className="space-y-4">
        {prompts.map((p) => (
          <Card key={p._id} className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="purple" size="sm">{p.type}</Badge>
                  <span className="text-xs font-mono text-slate-400">v{p.version}</span>
                  {p.isActive && (
                    <Badge variant="success" size="sm" className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Version
                    </Badge>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.description}</p>
              </div>

              <Button
                onClick={() => handleOpenEditModal(p)}
                variant="outline"
                size="sm"
                icon={Edit}
              >
                Edit / View
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  System Persona Prompt:
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] line-clamp-3">
                  {p.systemPrompt}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Dynamic User Template:
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] line-clamp-3">
                  {p.template}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPrompt ? 'Edit AI Prompt Template' : 'Create AI Prompt Template Version'}
        size="lg"
      >
        <form onSubmit={handleSavePrompt} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prompt Name
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                AI Service Pipeline Type
              </label>
              <select
                value={formState.type}
                onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="resume_analysis">resume_analysis</option>
                <option value="question_generation">question_generation</option>
                <option value="answer_evaluation">answer_evaluation</option>
                <option value="follow_up">follow_up</option>
                <option value="report_generation">report_generation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              System Instruction Prompt
            </label>
            <textarea
              required
              rows={4}
              value={formState.systemPrompt}
              onChange={(e) => setFormState({ ...formState, systemPrompt: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              User Prompt Template (Use {'{{variables}}'} for dynamic parameter hydration)
            </label>
            <textarea
              required
              rows={6}
              value={formState.template}
              onChange={(e) => setFormState({ ...formState, template: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActivePrompt"
              checked={formState.isActive}
              onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
              className="w-4 h-4 text-brand-500 rounded border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="isActivePrompt" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Set as active default prompt for this pipeline
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Save}>
              Save Prompt Version
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
