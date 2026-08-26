import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Target,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InterviewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/interviews/${id}/report`);
        if (res.data.success) {
          setInterview(res.data.data.interview);
          setAnswers(res.data.data.answers || []);
        }
      } catch (err) {
        toast.error('Failed to load interview report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const toggleExpand = (idx) => {
    setExpandedQ((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-64 rounded-3xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Report Not Found</h3>
        <Link to="/dashboard" className="text-brand-500 hover:underline mt-2 block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const scores = interview.scores || {
    overall: 75,
    technicalScore: 75,
    communicationScore: 75,
    problemSolvingScore: 75,
    correctnessScore: 75
  };

  const report = interview.report || {};

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner with Overall Score */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-brand-800/40 p-8 sm:p-10 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">Official AI Scorecard</Badge>
              <span className="text-xs text-slate-400">
                Completed on {new Date(interview.completedAt || interview.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {interview.role} Simulation
            </h2>
            <p className="text-xs text-slate-300">
              Format: {interview.type} • Difficulty: {interview.difficulty} • Duration: {Math.round((interview.actualDurationSeconds || 1200) / 60)} mins
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-3xl bg-brand-500/10 border border-brand-500/30 text-center min-w-[130px]">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                Overall Score
              </span>
              <p className="text-4xl sm:text-5xl font-black text-brand-400 mt-1">
                {scores.overall}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Dimensional Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Technical Knowledge
          </span>
          <p className="text-3xl font-black text-brand-600 dark:text-brand-400 mt-1">
            {scores.technicalScore}%
          </p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Communication & Clarity
          </span>
          <p className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
            {scores.communicationScore}%
          </p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Problem Solving
          </span>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {scores.problemSolvingScore}%
          </p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Correctness
          </span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {scores.correctnessScore}%
          </p>
        </Card>
      </div>

      {/* AI Executive Summary & Recommendations */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-5 h-5" /> AI Evaluator Assessment
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {report.overallAssessment || report.summary || 'Solid performance across core domains.'}
        </p>

        {/* Strengths and Weaknesses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" /> Strongest Demonstrated Skills
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {report.strongAreas?.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4" /> Priority Areas for Growth
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {report.weakAreas?.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Actionable Recommendations */}
        {report.aiRecommendations?.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-brand-500 uppercase tracking-wider">
              Targeted Next Steps & Practice Plan
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {report.aiRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Question by Question Comprehensive Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Question-by-Question Deep Review ({answers.length})
        </h3>

        {answers.map((ans, idx) => {
          const isExpanded = expandedQ[idx] !== false; // Default expanded
          const ev = ans.evaluation || {};

          return (
            <Card key={ans._id || idx} className="p-6 space-y-4">
              <div
                className="flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(idx)}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center shrink-0 text-xs">
                    Q{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary" size="sm">{ans.questionCategory}</Badge>
                      <Badge size="sm">{ans.questionDifficulty}</Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {ans.questionText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-black text-brand-500">
                      {ev.score || 0}/10 Score
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {/* Candidate Answer */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Your Submitted Answer:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {ans.candidateAnswer || ans.codeAnswer?.code || 'Question was skipped.'}
                    </p>
                  </div>

                  {/* AI Detailed Feedback */}
                  <div className="p-3.5 rounded-xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/40">
                    <span className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block mb-1">
                      AI Feedback & Evaluation:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {ev.detailedFeedback || ev.shortFeedback}
                    </p>
                  </div>

                  {/* Missing Concepts vs Model Answer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30">
                      <span className="font-bold text-rose-600 dark:text-rose-400 uppercase block mb-1">
                        Missing Concepts:
                      </span>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        {ev.missingConcepts?.map((mc, i) => (
                          <li key={i}>• {mc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-brand-500 uppercase block mb-1">
                        Ideal Answer Benchmark:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">
                        {ev.suggestedBetterAnswer || 'Comprehensive explanation addressing edge cases and architecture.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <Link to="/practice">
          <Button variant="outline" icon={Target}>
            Practice Recommended Weak Topics
          </Button>
        </Link>
        <Link to="/interviews/create">
          <Button variant="primary" size="lg" icon={RotateCcw}>
            Configure Next Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};
