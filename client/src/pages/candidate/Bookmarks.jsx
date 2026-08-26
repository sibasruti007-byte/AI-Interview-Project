import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, Edit3, Target, ArrowRight, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookmarks');
      if (res.data.success) {
        setBookmarks(res.data.data.bookmarks || []);
      }
    } catch (err) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      toast.success('Bookmark removed');
      fetchBookmarks();
    } catch (err) {
      toast.error('Failed to delete bookmark');
    }
  };

  const handleSaveNote = async (id) => {
    try {
      await api.put(`/bookmarks/${id}`, { notes: noteText });
      toast.success('Note updated');
      setEditingId(null);
      fetchBookmarks();
    } catch (err) {
      toast.error('Failed to update note');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Bookmarks</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Review critical questions, revise your personal study notes, and drill weak topics.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No Bookmarked Questions Yet"
          description="Bookmark tricky or important questions during your interviews and practice drills to review them here."
        />
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm) => (
            <Card key={bm._id} className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-500 shrink-0">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="primary" size="sm">{bm.category}</Badge>
                      <Badge size="sm">{bm.difficulty}</Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {bm.customQuestionText || bm.question?.question}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(bm._id);
                      setNoteText(bm.notes || '');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Note"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bm._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Personal Notes Box */}
              {editingId === bm._id ? (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-semibold text-slate-400">Personal Notes:</label>
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add your study notes or memory triggers..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" icon={Save} onClick={() => handleSaveNote(bm._id)}>
                      Save Note
                    </Button>
                  </div>
                </div>
              ) : bm.notes ? (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                    Study Notes:
                  </span>
                  {bm.notes}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
