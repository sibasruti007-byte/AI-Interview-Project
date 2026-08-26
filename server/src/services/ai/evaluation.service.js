const aiService = require('./ai.service');
const promptService = require('./prompt.service');
const logger = require('../../utils/logger');

class EvaluationService {
  async evaluateAnswer({
    questionText,
    category,
    difficulty,
    expectedConcepts = [],
    idealAnswerPoints = [],
    candidateAnswer = '',
    codeAnswer = null,
    timeSpentSeconds = 0,
    isSkipped = false
  }) {
    if (isSkipped || (!candidateAnswer && (!codeAnswer || !codeAnswer.code))) {
      return {
        score: 0,
        correctness: 0,
        relevance: 0,
        technicalKnowledge: 0,
        communication: 0,
        problemSolving: 0,
        shortFeedback: 'Question was skipped by candidate.',
        detailedFeedback: 'No answer was provided for this question.',
        strengths: [],
        weaknesses: ['Question was not attempted'],
        correctConcepts: [],
        missingConcepts: expectedConcepts,
        suggestedBetterAnswer: idealAnswerPoints.join('. ') || 'A comprehensive structured answer addressing all key concepts.',
        followUpQuestion: '',
        shouldAskFollowUp: false
      };
    }

    const { systemPrompt, userPrompt } = await promptService.getPrompt('answer_evaluation', {
      questionText,
      category,
      difficulty,
      expectedConcepts: expectedConcepts.join(', '),
      idealAnswerPoints: idealAnswerPoints.join(', '),
      candidateAnswer: candidateAnswer || 'None',
      codeAnswer: codeAnswer ? JSON.stringify(codeAnswer) : 'None',
      timeSpentSeconds
    });

    const fallbackGenerator = () => this._generateHeuristicAnswerEvaluation({
      questionText,
      category,
      difficulty,
      expectedConcepts,
      candidateAnswer,
      codeAnswer
    });

    const evalResult = await aiService.generateStructuredJSON(systemPrompt, userPrompt, fallbackGenerator);
    return evalResult || fallbackGenerator();
  }

  _generateHeuristicAnswerEvaluation({
    questionText,
    category,
    expectedConcepts,
    candidateAnswer,
    codeAnswer
  }) {
    const combinedAnswer = (candidateAnswer + ' ' + (codeAnswer?.code || '')).toLowerCase();
    const wordCount = combinedAnswer.split(/\s+/).filter(Boolean).length;

    // Check how many expected concepts are mentioned in candidate answer
    const matchedConcepts = [];
    const missingConcepts = [];

    expectedConcepts.forEach((concept) => {
      const keywords = concept.toLowerCase().split(/[\s,/]+/);
      const isPresent = keywords.some((kw) => kw.length > 3 && combinedAnswer.includes(kw));
      if (isPresent) {
        matchedConcepts.push(concept);
      } else {
        missingConcepts.push(concept);
      }
    });

    // Score calculation
    let baseScore = 5;
    if (wordCount > 30) baseScore += 2;
    if (wordCount > 80) baseScore += 1;
    if (matchedConcepts.length > 0) {
      baseScore += Math.round((matchedConcepts.length / Math.max(expectedConcepts.length, 1)) * 2);
    }
    const finalScore = Math.min(10, Math.max(1, baseScore));

    const correctness = Math.min(10, Math.max(1, finalScore));
    const relevance = wordCount > 15 ? Math.min(10, finalScore + 1) : 4;
    const technicalKnowledge = Math.min(10, Math.max(2, finalScore));
    const communication = wordCount > 40 ? 8 : 6;
    const problemSolving = codeAnswer?.code ? 8 : 7;

    const strengths = [];
    if (matchedConcepts.length > 0) {
      strengths.push(`Clearly identified core elements including: ${matchedConcepts.slice(0, 2).join(', ')}.`);
    }
    if (wordCount > 50) {
      strengths.push('Provided a well-structured and detailed explanation.');
    } else {
      strengths.push('Direct and concise response.');
    }

    const weaknesses = [];
    if (missingConcepts.length > 0) {
      weaknesses.push(`Could expand further on: ${missingConcepts.slice(0, 2).join(', ')}.`);
    }
    if (wordCount < 25) {
      weaknesses.push('Answer would benefit from more concrete real-world examples and trade-off analysis.');
    }

    let followUp = '';
    let shouldAskFollowUp = false;
    if (missingConcepts.length > 0 && finalScore >= 5 && finalScore < 8) {
      shouldAskFollowUp = true;
      followUp = `Could you elaborate on how ${missingConcepts[0]} applies in a high-traffic production scenario?`;
    }

    return {
      score: finalScore,
      correctness,
      relevance,
      technicalKnowledge,
      communication,
      problemSolving,
      shortFeedback: finalScore >= 7 ? 'Strong answer demonstrating solid conceptual understanding.' : 'Decent start, but missing several crucial depth points.',
      detailedFeedback: `Your response highlighted ${matchedConcepts.join(', ') || 'general ideas'}. To make it senior-level, discuss architectural trade-offs, edge cases, and performance implications.`,
      strengths,
      weaknesses,
      correctConcepts: matchedConcepts,
      missingConcepts: missingConcepts.length > 0 ? missingConcepts : ['Edge-case fault tolerance'],
      suggestedBetterAnswer: `A top-tier answer covers ${expectedConcepts.join(', ')} while citing trade-offs and performance optimizations.`,
      followUpQuestion: followUp,
      shouldAskFollowUp
    };
  }

  async generateFinalReport({ interview, answers }) {
    const summaryData = answers.map((a, i) => ({
      questionIndex: i + 1,
      question: a.questionText,
      category: a.questionCategory,
      score: a.evaluation?.score || 0,
      strengths: a.evaluation?.strengths || [],
      weaknesses: a.evaluation?.weaknesses || []
    }));

    const { systemPrompt, userPrompt } = await promptService.getPrompt('report_generation', {
      role: interview.role,
      type: interview.type,
      difficulty: interview.difficulty,
      evaluationsSummary: JSON.stringify(summaryData, null, 2)
    });

    const fallbackGenerator = () => this._generateHeuristicFinalReport(interview, answers);

    const reportResult = await aiService.generateStructuredJSON(systemPrompt, userPrompt, fallbackGenerator);
    return reportResult || fallbackGenerator();
  }

  _generateHeuristicFinalReport(interview, answers) {
    if (!answers || answers.length === 0) {
      return {
        summary: 'Interview completed with no recorded answers.',
        overallAssessment: 'Insufficient data for a comprehensive assessment.',
        strongAreas: ['Initiative to practice'],
        weakAreas: ['Incomplete submission'],
        skillsEvaluated: [{ skill: 'General Problem Solving', score: 50 }],
        aiRecommendations: ['Retake the interview and attempt all questions.'],
        suggestedNextPracticeTopics: ['Core Fundamentals'],
        scores: {
          overall: 0,
          technicalScore: 0,
          communicationScore: 0,
          problemSolvingScore: 0,
          correctnessScore: 0
        }
      };
    }

    const totalQuestions = answers.length;
    let sumScore = 0;
    let sumTech = 0;
    let sumComm = 0;
    let sumProblem = 0;
    let sumCorrect = 0;

    const allWeaknesses = [];
    const allStrengths = [];
    const skillMap = {};

    answers.forEach((ans) => {
      const ev = ans.evaluation || {};
      const score = ev.score || 0;
      sumScore += score;
      sumTech += ev.technicalKnowledge || score;
      sumComm += ev.communication || score;
      sumProblem += ev.problemSolving || score;
      sumCorrect += ev.correctness || score;

      if (ev.strengths) allStrengths.push(...ev.strengths);
      if (ev.weaknesses) allWeaknesses.push(...ev.weaknesses);

      const cat = ans.questionCategory || 'General';
      if (!skillMap[cat]) skillMap[cat] = { total: 0, count: 0 };
      skillMap[cat].total += score * 10;
      skillMap[cat].count += 1;
    });

    const avg100 = (sum) => Math.round((sum / (totalQuestions * 10)) * 100);

    const overall = avg100(sumScore);
    const technicalScore = avg100(sumTech);
    const communicationScore = avg100(sumComm);
    const problemSolvingScore = avg100(sumProblem);
    const correctnessScore = avg100(sumCorrect);

    const skillsEvaluated = Object.entries(skillMap).map(([skill, data]) => ({
      skill,
      score: Math.round(data.total / data.count)
    }));

    const strongAreas = Array.from(new Set(allStrengths)).slice(0, 4);
    const weakAreas = Array.from(new Set(allWeaknesses)).slice(0, 4);

    const recommendations = [
      `Deepen your focus on ${weakAreas[0] || 'advanced data structures and system architecture'}.`,
      'Structure all answers using the STAR method for behavioral and architectural trade-off frameworks for technical topics.',
      'Practice timed coding mock drills to build precision and speed under pressure.'
    ];

    const suggestedTopics = Object.entries(skillMap)
      .sort((a, b) => (a[1].total / a[1].count) - (b[1].total / b[1].count))
      .map(([skill]) => skill)
      .slice(0, 3);

    return {
      summary: `Candidate demonstrated solid understanding for the ${interview.role} position with an overall rating of ${overall}%.`,
      overallAssessment: overall >= 75
        ? `Strong candidate showing solid domain knowledge in ${interview.role} with clear communication and structured reasoning.`
        : `Demonstrates strong potential. Recommend targeted practice in weak concept areas before real-world hiring rounds.`,
      strongAreas: strongAreas.length > 0 ? strongAreas : ['Clear foundational knowledge', 'Logical thought process'],
      weakAreas: weakAreas.length > 0 ? weakAreas : ['Deep dive into distributed scalability', 'Edge case error handling'],
      skillsEvaluated: skillsEvaluated.length > 0 ? skillsEvaluated : [{ skill: interview.role, score: overall }],
      aiRecommendations: recommendations,
      suggestedNextPracticeTopics: suggestedTopics.length > 0 ? suggestedTopics : ['System Design', 'Async Architecture', 'Performance Optimization'],
      scores: {
        overall,
        technicalScore,
        communicationScore,
        problemSolvingScore,
        correctnessScore
      }
    };
  }
}

module.exports = new EvaluationService();
