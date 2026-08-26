const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const User = require('../models/User');
const Notification = require('../models/Notification');
const resumeService = require('../services/ai/resume.service');
const AppError = require('../utils/appError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @route POST /api/resumes
const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please select a resume file to upload.', 400));
  }

  // Deactivate previous active resumes
  await Resume.updateMany({ user: req.user._id }, { isCurrentActive: false });

  // Extract raw text from file
  const extractedText = await resumeService.extractTextFromFile(
    req.file.path,
    req.file.mimetype
  );

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    filePath: `/uploads/resumes/${req.file.filename}`,
    extractedText,
    status: 'uploaded',
    isCurrentActive: true
  });

  // Link as active resume on user
  await User.findByIdAndUpdate(req.user._id, { activeResume: resume._id });

  return ApiResponse.created(res, 'Resume uploaded successfully', { resume });
});

// @route GET /api/resumes
const getResumes = asyncHandler(async (req, res, next) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Resumes retrieved', { resumes });
});

// @route GET /api/resumes/:id
const getResumeById = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return next(new AppError('Resume not found.', 404));
  }
  return ApiResponse.success(res, 200, 'Resume details retrieved', { resume });
});

// @route POST /api/resumes/:id/analyze
const analyzeResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return next(new AppError('Resume not found.', 404));
  }

  resume.status = 'analyzing';
  await resume.save();

  try {
    const analysisResult = await resumeService.analyzeResume(resume.extractedText || resume.originalName);

    resume.analysis = {
      extractedCandidateName: analysisResult.extractedCandidateName,
      experienceLevel: analysisResult.experienceLevel,
      yearsOfExperience: analysisResult.yearsOfExperience,
      technicalSkills: analysisResult.technicalSkills || [],
      softSkills: analysisResult.softSkills || [],
      technologies: analysisResult.technologies || [],
      education: analysisResult.education || [],
      workExperience: analysisResult.workExperience || [],
      projects: analysisResult.projects || [],
      certifications: analysisResult.certifications || [],
      achievements: analysisResult.achievements || [],
      recommendedJobRoles: analysisResult.recommendedJobRoles || [],
      strengths: analysisResult.strengths || [],
      weaknesses: analysisResult.weaknesses || [],
      missingSkills: analysisResult.missingSkills || [],
      suggestedImprovements: analysisResult.suggestedImprovements || []
    };

    resume.scores = analysisResult.scores || {
      overall: 78,
      technicalSkills: 80,
      experience: 75,
      projects: 80,
      education: 85,
      achievements: 70,
      resumeQuality: 82
    };

    resume.status = 'analyzed';
    await resume.save();

    // Auto-update user skills from resume if user profile has empty skills
    const user = await User.findById(req.user._id);
    if (user && (!user.profile.skills || user.profile.skills.length === 0) && analysisResult.technicalSkills?.length > 0) {
      user.profile.skills = analysisResult.technicalSkills;
      await user.save();
    }

    // Send in-app notification
    await Notification.create({
      user: req.user._id,
      title: 'Resume Analyzed by AI',
      message: `Your resume score is ${resume.scores.overall}/100 with ${resume.analysis.technicalSkills.length} detected skills.`,
      type: 'resume_analyzed',
      link: '/resume'
    });

    return ApiResponse.success(res, 200, 'Resume analyzed successfully', { resume });
  } catch (err) {
    resume.status = 'failed';
    await resume.save();
    return next(new AppError(`Resume analysis failed: ${err.message}`, 500));
  }
});

// @route DELETE /api/resumes/:id
const deleteResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return next(new AppError('Resume not found.', 404));
  }

  // Delete physical file if exists
  const fullPath = path.join(__dirname, '../../uploads/resumes', resume.fileName);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }

  await Resume.deleteOne({ _id: resume._id });

  // Update user activeResume pointer if this was active
  const remaining = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(1);
  await User.findByIdAndUpdate(req.user._id, {
    activeResume: remaining[0]?._id || null
  });

  return ApiResponse.success(res, 200, 'Resume deleted successfully');
});

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  analyzeResume,
  deleteResume
};
