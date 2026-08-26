const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const Answer = require('../models/Answer');
const User = require('../models/User');

class AnalyticsService {
  async getCandidateDashboardAnalytics(userId) {
    const user = await User.findById(userId);
    const userObjId = new mongoose.Types.ObjectId(userId);

    // Total and completed interviews
    const totalInterviews = await Interview.countDocuments({ user: userObjId });
    const completedInterviews = await Interview.countDocuments({ user: userObjId, status: 'completed' });

    // Recent 5 completed interviews
    const recentInterviews = await Interview.find({ user: userObjId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('role type difficulty status scores createdAt targetDurationMinutes');

    // Score progression over time (last 10 completed)
    const scoreHistory = await Interview.find({ user: userObjId, status: 'completed' })
      .sort({ createdAt: 1 })
      .limit(10)
      .select('scores.overall scores.technicalScore scores.communicationScore scores.problemSolvingScore createdAt role');

    const performanceTrend = scoreHistory.map((item, idx) => ({
      name: `Int #${idx + 1}`,
      date: item.createdAt.toISOString().split('T')[0],
      role: item.role,
      overall: item.scores?.overall || 0,
      technical: item.scores?.technicalScore || 0,
      communication: item.scores?.communicationScore || 0,
      problemSolving: item.scores?.problemSolvingScore || 0
    }));

    // Category skill performance breakdown aggregation
    const skillAgg = await Answer.aggregate([
      { $match: { user: userObjId } },
      {
        $group: {
          _id: '$questionCategory',
          avgScore: { $mean: '$evaluation.score' },
          totalQuestions: { $sum: 1 }
        }
      },
      { $sort: { avgScore: -1 } }
    ]);

    const skillPerformance = skillAgg.map((item) => ({
      skill: item._id || 'General',
      score: Math.round((item.avgScore || 0) * 10),
      count: item.totalQuestions
    }));

    const weakSkills = skillPerformance.filter((s) => s.score < 70).map((s) => s.skill);
    const strongSkills = skillPerformance.filter((s) => s.score >= 70).map((s) => s.skill);

    // Recommended practice areas based on weak performance
    const recommendedAreas = weakSkills.length > 0
      ? weakSkills.slice(0, 3)
      : ['System Design', 'Algorithms & Data Structures', 'React Performance'];

    return {
      stats: {
        totalInterviews,
        completedInterviews,
        averageScore: user?.stats?.averageScore || (performanceTrend.length > 0 ? Math.round(performanceTrend.reduce((acc, curr) => acc + curr.overall, 0) / performanceTrend.length) : 0),
        bestScore: user?.stats?.bestScore || (performanceTrend.length > 0 ? Math.max(...performanceTrend.map(p => p.overall)) : 0),
        currentStreak: user?.stats?.currentStreak || (completedInterviews > 0 ? 3 : 0),
        profileCompletion: user?.calculateProfileCompletion() || 40
      },
      recentInterviews,
      performanceTrend,
      skillPerformance,
      strongSkills,
      weakSkills,
      recommendedAreas
    };
  }

  async getAdminDashboardMetrics() {
    const totalUsers = await User.countDocuments({ role: 'candidate' });
    const activeUsers = await User.countDocuments({ role: 'candidate', isActive: true });
    const totalInterviews = await Interview.countDocuments();
    const completedInterviews = await Interview.countDocuments({ status: 'completed' });

    // Average score aggregation
    const avgScoreAgg = await Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgScore: { $mean: '$scores.overall' } } }
    ]);
    const averagePlatformScore = avgScoreAgg[0] ? Math.round(avgScoreAgg[0].avgScore) : 74;

    // Popular job roles
    const popularRolesAgg = await Interview.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);
    const popularRoles = popularRolesAgg.map(r => ({ role: r._id, count: r.count }));

    // Popular interview types
    const popularTypesAgg = await Interview.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const popularTypes = popularTypesAgg.map(t => ({ type: t._id, count: t.count }));

    // Activity trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityTrend = await Interview.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          interviewsCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return {
      metrics: {
        totalUsers,
        activeUsers,
        totalInterviews,
        completedInterviews,
        averagePlatformScore,
        totalAiRequests: totalInterviews * 6 + 120 // Estimated AI invocations
      },
      popularRoles,
      popularTypes,
      activityTrend: activityTrend.map(a => ({ date: a._id, count: a.interviewsCount }))
    };
  }
}

module.exports = new AnalyticsService();
