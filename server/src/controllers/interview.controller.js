const Interview = require('../models/Interview');
const Answer = require('../models/Answer');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const interviewService = require('../services/ai/interview.service');
const evaluationService = require('../services/ai/evaluation.service');
const AppError = require('../utils/appError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @route POST /api/interviews
const createInterview = asyncHandler(async (req, res, next) => {
  const { role, type, difficulty, experienceLevel, totalQuestionsCount, targetDurationMinutes, useResume } = req.body;

  let resumeDoc = null;
  if (useResume) {
    resumeDoc = await Resume.findOne({ user: req.user._id, isCurrentActive: true });
  }

  // Generate dynamic questions tailored to role, difficulty, experience and resume skills
  const questions = await interviewService.generateInterviewQuestions({
    role,
    type,
    difficulty,
    experienceLevel,
    count: totalQuestionsCount,
    userSkills: req.user.profile?.skills || [],
    resumeExcerpt: resumeDoc ? (resumeDoc.extractedText || resumeDoc.analysis?.technicalSkills?.join(', ')) : ''
  });

  const interview = await Interview.create({
    user: req.user._id,
    role,
    type,
    difficulty,
    experienceLevel,
    totalQuestionsCount,
    targetDurationMinutes,
    status: 'created',
    resumeUsed: resumeDoc ? resumeDoc._id : null,
    questions
  });

  // Increment user total interviews count
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.totalInterviews': 1 }
  });

  return ApiResponse.created(res, 'Interview simulation configured successfully', { interview });
});

// @route GET /api/interviews
const getInterviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { user: req.user._id };

  if (req.query.role) query.role = new RegExp(req.query.role, 'i');
  if (req.query.type) query.type = req.query.type;
  if (req.query.difficulty) query.difficulty = req.query.difficulty;
  if (req.query.status) query.status = req.query.status;

  const total = await Interview.countDocuments(query);
  const interviews = await Interview.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-questions.idealAnswerPoints -questions.expectedConcepts');

  return ApiResponse.success(res, 200, 'Interviews retrieved', {
    interviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// @route GET /api/interviews/:id
const getInterviewById = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    return next(new AppError('Interview session not found.', 404));
  }

  const answers = await Answer.find({ interview: interview._id }).sort({ questionOrder: 1 });

  return ApiResponse.success(res, 200, 'Interview session retrieved', {
    interview,
    answers
  });
});

// @route POST /api/interviews/:id/start
const startInterview = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    return next(new AppError('Interview session not found.', 404));
  }

  if (interview.status === 'completed') {
    return next(new AppError('This interview has already been completed.', 400));
  }

  if (interview.status === 'created') {
    interview.status = 'in_progress';
    interview.startedAt = new Date();
    await interview.save();
  }

  return ApiResponse.success(res, 200, 'Interview started', { interview });
});

// @route POST /api/interviews/:id/answers
const submitAnswer = asyncHandler(async (req, res, next) => {
  const { questionOrder, candidateAnswer, codeAnswer, timeSpentSeconds, isSkipped } = req.body;

  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    return next(new AppError('Interview not found.', 404));
  }

  if (interview.status === 'completed') {
    return next(new AppError('Interview has already ended.', 400));
  }

  const currentQ = interview.questions.find(q => q.order === questionOrder);
  if (!currentQ) {
    return next(new AppError('Invalid question order index.', 400));
  }

  // AI Evaluation of candidate answer
  const evaluation = await evaluationService.evaluateAnswer({
    questionText: currentQ.questionText,
    category: currentQ.category,
    difficulty: currentQ.difficulty,
    expectedConcepts: currentQ.expectedConcepts || [],
    idealAnswerPoints: currentQ.idealAnswerPoints || [],
    candidateAnswer: candidateAnswer || '',
    codeAnswer: codeAnswer || null,
    timeSpentSeconds,
    isSkipped: !!isSkipped
  });

  // Upsert Answer document to prevent duplicates
  const answer = await Answer.findOneAndUpdate(
    { interview: interview._id, questionOrder },
    {
      user: req.user._id,
      questionText: currentQ.questionText,
      questionCategory: currentQ.category,
      questionDifficulty: currentQ.difficulty,
      candidateAnswer: candidateAnswer || '',
      codeAnswer: codeAnswer || { language: 'javascript', code: '' },
      timeSpentSeconds,
      evaluation
    },
    { upsert: true, new: true }
  );

  // Update question state inside interview
  currentQ.isAnswered = !isSkipped;
  currentQ.isSkipped = !!isSkipped;

  // Adaptive Follow-up question injection if AI suggested one
  let injectedFollowUp = null;
  if (evaluation.shouldAskFollowUp && evaluation.followUpQuestion && interview.questions.length < 20) {
    const nextOrder = interview.questions.length + 1;
    const followUpObj = {
      questionText: evaluation.followUpQuestion,
      category: currentQ.category,
      difficulty: currentQ.difficulty,
      type: currentQ.type,
      expectedConcepts: evaluation.missingConcepts || ['Deep technical elaboration'],
      evaluationCriteria: ['Depth of knowledge', 'Practical application'],
      idealAnswerPoints: [evaluation.suggestedBetterAnswer || 'Elaborate on production-scale implementation'],
      order: nextOrder,
      isAnswered: false,
      isSkipped: false,
      followUpFor: questionOrder
    };
    interview.questions.push(followUpObj);
    injectedFollowUp = followUpObj;
  }

  // Advance current question index
  interview.currentQuestionIndex = Math.min(
    interview.questions.length - 1,
    interview.currentQuestionIndex + 1
  );

  await interview.save();

  return ApiResponse.success(res, 200, 'Answer evaluated successfully', {
    answer,
    evaluation,
    injectedFollowUp,
    interview
  });
});

// @route POST /api/interviews/:id/finish
const finishInterview = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    return next(new AppError('Interview session not found.', 404));
  }

  const answers = await Answer.find({ interview: interview._id }).sort({ questionOrder: 1 });

  // Generate comprehensive final report with AI
  const reportData = await evaluationService.generateFinalReport({
    interview,
    answers
  });

  const durationSec = interview.startedAt
    ? Math.round((Date.now() - new Date(interview.startedAt).getTime()) / 1000)
    : 0;

  interview.status = 'completed';
  interview.completedAt = new Date();
  interview.actualDurationSeconds = durationSec;
  interview.scores = reportData.scores || {
    overall: 75,
    technicalScore: 75,
    communicationScore: 75,
    problemSolvingScore: 75,
    correctnessScore: 75
  };
  interview.report = {
    summary: reportData.summary,
    overallAssessment: reportData.overallAssessment,
    strongAreas: reportData.strongAreas || [],
    weakAreas: reportData.weakAreas || [],
    skillsEvaluated: reportData.skillsEvaluated || [],
    aiRecommendations: reportData.aiRecommendations || [],
    suggestedNextPracticeTopics: reportData.suggestedNextPracticeTopics || [],
    generatedAt: new Date()
  };

  await interview.save();

  // Update user statistics
  const user = await User.findById(req.user._id);
  if (user) {
    const userCompleted = await Interview.find({ user: user._id, status: 'completed' });
    const totalScore = userCompleted.reduce((acc, curr) => acc + (curr.scores.overall || 0), 0);
    const avgScore = Math.round(totalScore / userCompleted.length);
    const bestScore = Math.max(...userCompleted.map(i => i.scores.overall || 0));

    user.stats.completedInterviews = userCompleted.length;
    user.stats.averageScore = avgScore;
    user.stats.bestScore = bestScore;
    user.stats.lastInterviewDate = new Date();
    user.stats.currentStreak = (user.stats.currentStreak || 0) + 1;
    await user.save();
  }

  // Create notification
  await Notification.create({
    user: req.user._id,
    title: 'Interview Completed!',
    message: `You completed the ${interview.role} interview with an overall score of ${interview.scores.overall}%.`,
    type: 'interview_completed',
    link: `/interviews/${interview._id}/report`
  });

  return ApiResponse.success(res, 200, 'Interview finished and report generated', {
    interview,
    answers
  });
});

// @route GET /api/interviews/:id/report
const getInterviewReport = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    return next(new AppError('Interview not found.', 404));
  }

  const answers = await Answer.find({ interview: interview._id }).sort({ questionOrder: 1 });

  return ApiResponse.success(res, 200, 'Report retrieved successfully', {
    interview,
    answers
  });
});

// @route DELETE /api/interviews/:id
const deleteInterview = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    return next(new AppError('Interview not found.', 404));
  }

  await Answer.deleteMany({ interview: interview._id });
  await Interview.deleteOne({ _id: interview._id });

  return ApiResponse.success(res, 200, 'Interview deleted successfully');
});

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  startInterview,
  submitAnswer,
  finishInterview,
  getInterviewReport,
  deleteInterview
};
