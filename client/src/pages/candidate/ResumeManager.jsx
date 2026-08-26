import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes');
      if (res.data.success) {
        const list = res.data.data.resumes || [];
        setResumes(list);
        if (list.length > 0) {
          setSelectedResume(list[0]);
        }
      }
    } catch (err) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      const res = await api.post('/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Resume uploaded successfully!');
        await fetchResumes();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzeResume = async (resumeId) => {
    try {
      setAnalyzing(true);
      const res = await api.post(`/resumes/${resumeId}/analyze`);
      if (res.data.success) {
        toast.success('Resume analyzed by AI successfully!');
        const updated = res.data.data.resume;
        setSelectedResume(updated);
        setResumes((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${resumeId}`);
      toast.success('Resume deleted');
      await fetchResumes();
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resume & AI Analysis</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload your resume (PDF/DOCX) for automated skill extraction and AI-grounded interview simulations.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <Card className="p-8 border-dashed border-2 border-brand-500/40 dark:border-brand-500/20 bg-brand-50/20 dark:bg-brand-950/10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload Your Resume</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-4">
            Supports PDF, DOC, and DOCX (Max 10MB). Never shared externally.
          </p>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={uploading}
              icon={UploadCloud}
              onClick={() => document.querySelector('input[type="file"]').click()}
            >
              Select File to Upload
            </Button>
          </label>
        </div>
      </Card>

      {/* Main Grid: Resumes List on Left, Deep AI Analysis on Right */}
      {resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Resumes Uploaded Yet"
          description="Upload your resume above to get automated AI skill extraction and gap analysis."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Uploaded Resumes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Resume History ({resumes.length})
            </h3>
            {resumes.map((r) => {
              const isSelected = selectedResume?._id === r._id;
              return (
                <Card
                  key={r._id}
                  onClick={() => setSelectedResume(r)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/30 dark:bg-brand-950/20'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-500 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {r.originalName}
                        </p>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {(r.fileSize / 1024).toFixed(1)} KB • {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={r.status === 'analyzed' ? 'success' : 'primary'}
                            size="sm"
                          >
                            {r.status}
                          </Badge>
                          {r.scores?.overall > 0 && (
                            <span className="text-xs font-bold text-brand-500">
                              {r.scores.overall}/100 Score
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteResume(r._id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Right Column: Active Resume AI Analysis Scorecard */}
          <div className="lg:col-span-2 space-y-6">
            {selectedResume ? (
              <Card className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold text-brand-500 uppercase tracking-wider">
                      Selected Resume
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {selectedResume.originalName}
                    </h3>
                  </div>

                  <Button
                    onClick={() => handleAnalyzeResume(selectedResume._id)}
                    isLoading={analyzing}
                    variant="primary"
                    size="md"
                    icon={Sparkles}
                  >
                    {selectedResume.status === 'analyzed' ? 'Re-Analyze with AI' : 'Run AI Analysis'}
                  </Button>
                </div>

                {selectedResume.status !== 'analyzed' ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-10 h-10 text-brand-500 mx-auto mb-3 animate-pulse" />
                    <h4 className="font-bold text-slate-900 dark:text-white">AI Analysis Ready</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                      Click the "Run AI Analysis" button above to evaluate your tech skills, experience gaps, and overall resume rating.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Overall Score + Dimensional Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-center">
                        <span className="text-[10px] font-bold text-brand-500 uppercase">Overall</span>
                        <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
                          {selectedResume.scores?.overall || 0}
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tech Skills</span>
                        <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                          {selectedResume.scores?.technicalSkills || 0}
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Experience</span>
                        <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                          {selectedResume.scores?.experience || 0}
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Projects</span>
                        <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                          {selectedResume.scores?.projects || 0}
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Education</span>
                        <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                          {selectedResume.scores?.education || 0}
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Quality</span>
                        <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                          {selectedResume.scores?.resumeQuality || 0}
                        </p>
                      </div>
                    </div>

                    {/* Detected Technical Skills */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Detected Technical Skills ({selectedResume.analysis?.technicalSkills?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.analysis?.technicalSkills?.map((skill) => (
                          <Badge key={skill} variant="primary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase mb-2">
                          <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {selectedResume.analysis?.strengths?.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase mb-2">
                          <AlertTriangle className="w-4 h-4" /> Potential Gaps / Weaknesses
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {selectedResume.analysis?.weaknesses?.map((w, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-rose-500">•</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actionable Suggestions */}
                    {selectedResume.analysis?.suggestedImprovements?.length > 0 && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-2">
                          Actionable Resume Polish Recommendations
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {selectedResume.analysis.suggestedImprovements.map((imp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ArrowRight className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
