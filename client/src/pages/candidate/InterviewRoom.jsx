import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Send,
  Sparkles,
  Code2,
  FileText,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  Flag,
  Loader2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Active Question & Answer State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerMode, setAnswerMode] = useState('text'); // 'text' | 'code'
  const [textAnswer, setTextAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState({
    language: 'javascript',
    code: '',
    passedTestCases: 0,
    totalTestCases: 0
  });

  // Live Timer State
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(30 * 60);
  const [timeSpentOnCurrentQ, setTimeSpentOnCurrentQ] = useState(0);
  const timerRef = useRef(null);

  // Post-answer AI Evaluation Feedback Modal State
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [latestEval, setLatestEval] = useState(null);
  const [followUpPrompt, setFollowUpPrompt] = useState(null);

  // Bookmarking
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Load Interview Session
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/interviews/${id}`);
        if (res.data.success) {
          const intData = res.data.data.interview;
          setInterview(intData);
          setAnswers(res.data.data.answers || []);

          if (intData.status === 'completed') {
            navigate(`/interviews/${id}/report`);
            return;
          }

          // Start interview on server if created
          if (intData.status === 'created') {
            await api.post(`/interviews/${id}/start`);
          }

          // Calculate remaining seconds
          const totalSecs = (intData.targetDurationMinutes || 30) * 60;
          setTimeRemainingSeconds(totalSecs);

          // Find first unanswered question
          const firstUnanswered = intData.questions.findIndex((q) => !q.isAnswered && !q.isSkipped);
          const activeIdx = firstUnanswered !== -1 ? firstUnanswered : 0;
          setCurrentIndex(activeIdx);

          // Set starter code if coding question
          const currentQ = intData.questions[activeIdx];
          if (currentQ?.type === 'Coding') {
            setAnswerMode('code');
            setCodeAnswer({
              language: 'javascript',
              code: currentQ.codeStarter || '// Write your algorithmic solution here\nfunction solution() {\n  \n}',
              passedTestCases: 0,
              totalTestCases: 2
            });
          }
        }
      } catch (err) {
        toast.error('Failed to load interview session');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, navigate]);

  // Master Countdown Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoFinish();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentOnCurrentQ((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleAutoFinish = async () => {
    toast.error('Time expired! Finalizing interview scorecard...');
    await finalizeInterview();
  };

  const currentQuestion = interview?.questions?.[currentIndex];
  const totalQuestions = interview?.questions?.length || 1;

  // Format Timer
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Submit Current Answer to AI
  const handleSubmitAnswer = async (isSkipped = false) => {
    if (!isSkipped && !textAnswer.trim() && !codeAnswer.code.trim()) {
      toast.error('Please provide an answer before submitting, or click Skip.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        questionOrder: currentQuestion.order,
        candidateAnswer: textAnswer,
        codeAnswer: answerMode === 'code' ? codeAnswer : null,
        timeSpentSeconds: timeSpentOnCurrentQ,
        isSkipped
      };

      const res = await api.post(`/interviews/${id}/answers`, payload);
      if (res.data.success) {
        const { evaluation, injectedFollowUp, interview: updatedInterview } = res.data.data;
        setLatestEval(evaluation);
        setInterview(updatedInterview);

        if (injectedFollowUp) {
          setFollowUpPrompt(injectedFollowUp);
        }

        // Open evaluation feedback modal
        setEvalModalOpen(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to evaluate answer');
    } finally {
      setSubmitting(false);
    }
  };

  // Move to Next Question after reviewing evaluation
  const handleProceedNext = () => {
    setEvalModalOpen(false);
    setLatestEval(null);
    setFollowUpPrompt(null);
    setTextAnswer('');
    setTimeSpentOnCurrentQ(0);
    setIsBookmarked(false);

    if (currentIndex + 1 < (interview?.questions?.length || 0)) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextQ = interview.questions[nextIdx];
      if (nextQ?.type === 'Coding') {
        setAnswerMode('code');
        setCodeAnswer({
          language: 'javascript',
          code: nextQ.codeStarter || '// Write your algorithmic solution here\nfunction solution() {\n  \n}',
          passedTestCases: 0,
          totalTestCases: 2
        });
      } else {
        setAnswerMode('text');
      }
    } else {
      finalizeInterview();
    }
  };

  // Finalize Interview
  const finalizeInterview = async () => {
    try {
      setFinishing(true);
      const res = await api.post(`/interviews/${id}/finish`);
      if (res.data.success) {
        toast.success('Interview complete! Generating full scorecard report...');
        navigate(`/interviews/${id}/report`);
      }
    } catch (err) {
      toast.error('Failed to complete interview');
    } finally {
      setFinishing(false);
    }
  };

  // Bookmark Question
  const handleToggleBookmark = async () => {
    if (!currentQuestion) return;
    try {
      if (!isBookmarked) {
        await api.post('/bookmarks', {
          customQuestionText: currentQuestion.questionText,
          category: currentQuestion.category,
          difficulty: currentQuestion.difficulty,
          role: interview.role,
          notes: `Bookmarked from ${interview.role} simulation.`
        });
        setIsBookmarked(true);
        toast.success('Question saved to bookmarks!');
      }
    } catch (e) {
      toast.error('Already bookmarked');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        <p className="text-sm font-semibold text-slate-400">
          Entering secure AI simulation room...
        </p>
      </div>
    );
  }

  const isTimerWarning = timeRemainingSeconds < 5 * 60;
  const isTimerCritical = timeRemainingSeconds < 2 * 60;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Session Progress Bar */}
      <Card className="p-4 bg-slate-900 border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 font-black flex items-center justify-center">
            {currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {interview?.role} ({interview?.type})
              </span>
              <Badge variant="primary" size="sm">
                Question {currentIndex + 1} of {totalQuestions}
              </Badge>
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Timer & Finish Button */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
              isTimerCritical
                ? 'bg-rose-950/60 border-rose-500/80 text-rose-400 animate-pulse'
                : isTimerWarning
                ? 'bg-amber-950/60 border-amber-500/80 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          <Button
            onClick={finalizeInterview}
            isLoading={finishing}
            variant="danger"
            size="sm"
            icon={Flag}
          >
            End Interview
          </Button>
        </div>
      </Card>

      {/* Main Question Arena */}
      {currentQuestion && (
        <Card className="p-6 sm:p-8 space-y-6">
          {/* Question Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary">{currentQuestion.category || 'General'}</Badge>
              <Badge
                variant={
                  currentQuestion.difficulty === 'Expert' || currentQuestion.difficulty === 'Hard'
                    ? 'danger'
                    : currentQuestion.difficulty === 'Medium'
                    ? 'warning'
                    : 'success'
                }
              >
                {currentQuestion.difficulty}
              </Badge>
              {currentQuestion.followUpFor && (
                <Badge variant="purple" size="sm">
                  ⚡ Adaptive Follow-Up Question
                </Badge>
              )}
            </div>

            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                isBookmarked
                  ? 'border-brand-500 text-brand-500 bg-brand-50 dark:bg-brand-950'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {isBookmarked ? 'Bookmarked' : 'Bookmark Question'}
            </button>
          </div>

          {/* Question Text */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQuestion.questionText}
            </p>

            {currentQuestion.expectedConcepts?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Key Evaluation Topics:
                </span>
                {currentQuestion.expectedConcepts.slice(0, 3).map((concept) => (
                  <span
                    key={concept}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Answer Mode Switcher */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAnswerMode('text')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  answerMode === 'text'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Text Explanation
              </button>
              <button
                type="button"
                onClick={() => setAnswerMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  answerMode === 'code'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Code Solution
              </button>
            </div>

            {answerMode === 'text' && (
              <span className="text-xs text-slate-400 font-mono">
                {textAnswer.split(/\s+/).filter(Boolean).length} words
              </span>
            )}
          </div>

          {/* Answer Inputs */}
          {answerMode === 'text' ? (
            <div>
              <textarea
                rows={9}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Structure your answer clearly. Discuss core principles, performance implications, architectural trade-offs, and production considerations..."
                className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-xl text-slate-200 text-xs">
                <span className="font-mono font-semibold">Language: JavaScript / Node.js</span>
                <span className="text-slate-400">Sandbox Code Arena</span>
              </div>
              <textarea
                rows={12}
                value={codeAnswer.code}
                onChange={(e) => setCodeAnswer({ ...codeAnswer, code: e.target.value })}
                className="w-full p-4 rounded-b-xl border border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                spellCheck={false}
              />
            </div>
          )}

          {/* Action Submission Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleSubmitAnswer(true)}
              disabled={submitting}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Skip Question
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => handleSubmitAnswer(false)}
                isLoading={submitting}
                icon={Send}
                size="lg"
                className="px-8 font-bold"
              >
                Submit Answer to AI
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Post-Answer Live AI Evaluation Modal */}
      <Modal
        isOpen={evalModalOpen}
        onClose={handleProceedNext}
        title="AI Real-Time Evaluation"
        size="lg"
      >
        {latestEval && (
          <div className="space-y-6">
            {/* Top Score Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-900 to-cyan-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Score</span>
                <p className="text-3xl font-black">{latestEval.score} / 10</p>
                <p className="text-xs text-slate-200 mt-0.5">{latestEval.shortFeedback}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/10">
                  <span className="text-[10px] text-cyan-200 block">Correctness</span>
                  <strong className="font-bold">{latestEval.correctness}/10</strong>
                </div>
                <div className="p-2 rounded-xl bg-white/10">
                  <span className="text-[10px] text-cyan-200 block">Technical</span>
                  <strong className="font-bold">{latestEval.technicalKnowledge}/10</strong>
                </div>
                <div className="p-2 rounded-xl bg-white/10">
                  <span className="text-[10px] text-cyan-200 block">Clarity</span>
                  <strong className="font-bold">{latestEval.communication}/10</strong>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Strengths Detected
                </p>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {latestEval.strengths?.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4" /> Missing Depth / Gaps
                </p>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {latestEval.missingConcepts?.map((gap, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggested Better Answer */}
            {latestEval.suggestedBetterAnswer && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-brand-500 uppercase mb-1">
                  💡 Model Senior Answer Benchmark
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {latestEval.suggestedBetterAnswer}
                </p>
              </div>
            )}

            {/* Adaptive Follow-up Alert */}
            {followUpPrompt && (
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase">Adaptive Follow-Up Challenge Added!</p>
                  <p className="text-xs mt-0.5">
                    The AI added a targeted follow-up question to test your architectural depth on this topic.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button onClick={handleProceedNext} icon={ArrowRight} variant="primary" size="lg">
                {currentIndex + 1 < (interview?.questions?.length || 0) ? 'Continue to Next Question' : 'View Full Interview Scorecard'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
