import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Clock, Award, HelpCircle, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const CreateInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRoles, setFetchingRoles] = useState(true);

  // Form States
  const [selectedRole, setSelectedRole] = useState(user?.profile?.targetRole || 'Full Stack Developer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [experienceLevel, setExperienceLevel] = useState(user?.profile?.experienceLevel || '1-3 years');
  const [questionsCount, setQuestionsCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [useResume, setUseResume] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/questions/job-roles');
        if (res.data.success) {
          setJobRoles(res.data.data.jobRoles || []);
        }
      } catch (err) {
        // Fallback default roles
        setJobRoles([
          { name: 'Frontend Developer' },
          { name: 'Backend Developer' },
          { name: 'Full Stack Developer' },
          { name: 'MERN Stack Developer' },
          { name: 'React Developer' },
          { name: 'Node.js Developer' },
          { name: 'Software Engineer' }
        ]);
      } finally {
        setFetchingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const payload = {
        role: selectedRole,
        type: interviewType,
        difficulty,
        experienceLevel,
        totalQuestionsCount: questionsCount,
        targetDurationMinutes: durationMinutes,
        useResume
      };

      const res = await api.post('/interviews', payload);
      if (res.data.success) {
        const interviewId = res.data.data.interview._id;
        toast.success('Simulation questions synthesized! Entering interview room...');
        navigate(`/interviews/${interviewId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  const typesList = [
    { name: 'Technical', desc: 'Core architecture, language internals, frameworks, and edge cases' },
    { name: 'Coding', desc: 'Algorithm challenges with code editor, language selector, and test cases' },
    { name: 'System Design', desc: 'Scalability, caching, sharding, message queues, and high availability' },
    { name: 'Resume-Based', desc: 'Direct questions exploring projects and technologies on your uploaded CV' },
    { name: 'Behavioral', desc: 'STAR framework scenarios, crisis resolution, and leadership questions' },
    { name: 'Mixed', desc: 'Comprehensive round combining technical depth, system design, and behavioral' }
  ];

  const difficultyLevels = [
    { name: 'Easy', desc: 'Fundamental concepts & junior level inquiries' },
    { name: 'Medium', desc: 'Standard mid-level engineering interview standard' },
    { name: 'Hard', desc: 'Senior level architecture & complex edge cases' },
    { name: 'Expert', desc: 'Staff/Principal level trade-offs & distributed scaling' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-2">Simulation Setup</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Configure Your AI Interview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize role, format, and difficulty to match your upcoming hiring loop.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1: Target Role */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" /> 1. Select Target Job Role
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {jobRoles.map((role) => {
              const isSelected = selectedRole === role.name;
              return (
                <button
                  key={role.name}
                  type="button"
                  onClick={() => setSelectedRole(role.name)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {role.name}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step 2: Interview Type */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" /> 2. Choose Interview Format
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {typesList.map((t) => {
              const isSelected = interviewType === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setInterviewType(t.name)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 text-slate-900 dark:text-white ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step 3: Difficulty & Experience */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" /> 3. Difficulty Level & Experience
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {difficultyLevels.map((d) => {
              const isSelected = difficulty === d.name;
              return (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => setDifficulty(d.name)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{d.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{d.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Experience Bracket
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="Fresher">Fresher</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Question Count
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionsCount(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      questionsCount === num
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      durationMinutes === mins
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Step 4: Resume Grounding Option */}
        <Card className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Ground Questions in Uploaded Resume
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI will inject questions referencing your verified projects and claimed technologies.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={useResume}
            onChange={(e) => setUseResume(e.target.checked)}
            className="w-5 h-5 text-brand-600 rounded border-slate-300 dark:border-slate-700 focus:ring-brand-500 cursor-pointer"
          />
        </Card>

        {/* Start Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleStartInterview}
            isLoading={loading}
            icon={Sparkles}
            size="lg"
            className="px-8 font-bold"
          >
            Synthesize & Launch Interview
          </Button>
        </div>
      </div>
    </div>
  );
};
