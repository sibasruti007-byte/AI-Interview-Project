import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Code2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PracticeMode = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

  const [question, setQuestion] = useState(null);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/questions/categories');
        if (res.data.success) {
          setCategories(res.data.data.categories || []);
        }
      } catch (err) {
        // Fallback categories
        setCategories([
          { name: 'JavaScript' },
          { name: 'React' },
          { name: 'Node.js' },
          { name: 'MongoDB' },
          { name: 'System Design' },
          { name: 'DSA' },
          { name: 'Behavioral' }
        ]);
      }
    };
    fetchCategories();
    fetchNewQuestion();
  }, []);

  const fetchNewQuestion = async () => {
    try {
      setLoadingQuestion(true);
      setEvaluation(null);
      setCandidateAnswer('');
      setIsBookmarked(false);

      const params = {
        category: selectedCategory,
        difficulty: selectedDifficulty
      };

      const res = await api.get('/questions/practice/random', { params });
      if (res.data.success) {
        setQuestion(res.data.data.question);
      }
    } catch (err) {
      toast.error('No question found for this filter combination');
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleEvaluate = async () => {
    if (!candidateAnswer.trim()) {
      toast.error('Please type an answer to evaluate');
      return;
    }

    try {
      setEvaluating(true);
      const payload = {
        questionText: question.question,
        category: question.category,
        difficulty: question.difficulty,
        candidateAnswer,
        expectedConcepts: question.expectedConcepts || []
      };

      const res = await api.post('/questions/practice/evaluate', payload);
      if (res.data.success) {
        setEvaluation(res.data.data.evaluation);
        toast.success('Answer evaluated!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const handleBookmark = async () => {
    if (!question) return;
    try {
      await api.post('/bookmarks', {
        questionId: question._id,
        customQuestionText: question.question,
        category: question.category,
        difficulty: question.difficulty,
        role: question.role || 'Software Engineer',
        notes: 'Saved from Practice Drill'
      });
      setIsBookmarked(true);
      toast.success('Question bookmarked!');
    } catch (e) {
      toast.error('Already bookmarked');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Topic Practice Drills</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Target individual frameworks and receive immediate AI grading with model answers.
        </p>
      </div>

      {/* Filter Selector */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="All">All Topics</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <Button
          onClick={fetchNewQuestion}
          isLoading={loadingQuestion}
          variant="secondary"
          size="sm"
          icon={RotateCcw}
        >
          New Question
        </Button>
      </Card>

      {/* Active Practice Question Card */}
      {question ? (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge variant="primary">{question.category}</Badge>
              <Badge
                variant={
                  question.difficulty === 'Expert' || question.difficulty === 'Hard'
                    ? 'danger'
                    : question.difficulty === 'Medium'
                    ? 'warning'
                    : 'success'
                }
              >
                {question.difficulty}
              </Badge>
            </div>

            <button
              onClick={handleBookmark}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 transition-colors"
              title="Bookmark question"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-brand-500" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your Answer / Explanation:
            </label>
            <textarea
              rows={7}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Type your explanation here..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={handleEvaluate}
              isLoading={evaluating}
              icon={Send}
              variant="primary"
              size="lg"
            >
              Evaluate Answer
            </Button>
          </div>

          {/* Live Evaluation Display */}
          {evaluation && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-900 to-cyan-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-300 uppercase">AI Rating</span>
                  <p className="text-3xl font-black">{evaluation.score} / 10</p>
                  <p className="text-xs text-slate-200 mt-0.5">{evaluation.shortFeedback}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase block mb-1">
                    Strengths:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {evaluation.strengths?.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs">
                  <span className="font-bold text-rose-600 dark:text-rose-400 uppercase block mb-1">
                    Missing Points:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {evaluation.missingConcepts?.map((m, i) => (
                      <li key={i}>• {m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {evaluation.suggestedBetterAnswer && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-brand-500 uppercase block">
                    Ideal Answer Benchmark:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {evaluation.suggestedBetterAnswer}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-12 text-center text-xs text-slate-500">
          Loading practice question...
        </Card>
      )}
    </div>
  );
};
