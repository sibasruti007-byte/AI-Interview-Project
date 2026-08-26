const AIPrompt = require('../../models/AIPrompt');
const logger = require('../../utils/logger');

class PromptService {
  // Default system prompts if DB has none yet
  getDefaultPrompt(type) {
    switch (type) {
      case 'resume_analysis':
        return {
          systemPrompt: `You are an elite technical recruiter and AI resume analyst. Analyze candidate resume text accurately, extracting key career data, technical skills, scoring 6 dimensions from 0 to 100, and outlining actionable improvement strategies. Return strictly JSON.`,
          template: `Analyze this candidate resume:\n\n=== RESUME START ===\n{{resumeText}}\n=== RESUME END ===\n\nReturn JSON with schema:\n{\n  "extractedCandidateName": "string",\n  "experienceLevel": "Fresher" | "0-1 years" | "1-3 years" | "3-5 years" | "5+ years",\n  "yearsOfExperience": number,\n  "technicalSkills": ["string"],\n  "softSkills": ["string"],\n  "technologies": ["string"],\n  "education": [{"degree": "string", "institution": "string", "year": "string", "gpa": "string"}],\n  "workExperience": [{"role": "string", "company": "string", "duration": "string", "summary": "string", "highlights": ["string"]}],\n  "projects": [{"title": "string", "description": "string", "technologies": ["string"], "link": "string"}],\n  "certifications": ["string"],\n  "achievements": ["string"],\n  "recommendedJobRoles": ["string"],\n  "strengths": ["string"],\n  "weaknesses": ["string"],\n  "missingSkills": ["string"],\n  "suggestedImprovements": ["string"],\n  "scores": {\n    "overall": number (0-100),\n    "technicalSkills": number (0-100),\n    "experience": number (0-100),\n    "projects": number (0-100),\n    "education": number (0-100),\n    "achievements": number (0-100),\n    "resumeQuality": number (0-100)\n  }\n}`
        };

      case 'question_generation':
        return {
          systemPrompt: `You are a Principal Software Engineer and hiring manager conducting technical and behavioral interviews. Generate bespoke, practical, and highly engaging interview questions tailored to the candidate's exact profile, role, difficulty, and experience. Return strictly JSON.`,
          template: `Generate {{count}} interview questions for:\nRole: {{role}}\nType: {{type}}\nDifficulty: {{difficulty}}\nExperience Level: {{experienceLevel}}\nCandidate Skills: {{candidateSkills}}\nResume Excerpt: {{resumeExcerpt}}\n\nReturn JSON schema:\n{\n  "questions": [\n    {\n      "question": "string",\n      "category": "string",\n      "difficulty": "Easy"|"Medium"|"Hard"|"Expert",\n      "type": "Technical"|"HR"|"Behavioral"|"Coding"|"System Design"|"Mixed"|"Resume-Based",\n      "expectedConcepts": ["string"],\n      "evaluationCriteria": ["string"],\n      "idealAnswerPoints": ["string"],\n      "codeStarter": "string (optional for coding)",\n      "tags": ["string"]\n    }\n  ]\n}`
        };

      case 'answer_evaluation':
        return {
          systemPrompt: `You are an expert technical interviewer evaluating a candidate's answer with nuance, fairness, and precision. Provide numeric ratings (0-10), pinpoint missing concepts, and suggest follow-up questions if appropriate. Return strictly JSON.`,
          template: `Evaluate the candidate's answer:\nQuestion: {{questionText}}\nCategory: {{category}}\nDifficulty: {{difficulty}}\nExpected Concepts: {{expectedConcepts}}\nIdeal Answer Points: {{idealAnswerPoints}}\nCandidate's Answer: {{candidateAnswer}}\nCode Answer: {{codeAnswer}}\nTime Spent: {{timeSpentSeconds}}s\n\nReturn JSON schema:\n{\n  "score": number (0-10),\n  "correctness": number (0-10),\n  "relevance": number (0-10),\n  "technicalKnowledge": number (0-10),\n  "communication": number (0-10),\n  "problemSolving": number (0-10),\n  "shortFeedback": "string",\n  "detailedFeedback": "string",\n  "strengths": ["string"],\n  "weaknesses": ["string"],\n  "correctConcepts": ["string"],\n  "missingConcepts": ["string"],\n  "suggestedBetterAnswer": "string",\n  "followUpQuestion": "string (optional or empty string)",\n  "shouldAskFollowUp": boolean\n}`
        };

      case 'report_generation':
        return {
          systemPrompt: `You are an executive talent evaluator. Synthesize an interview session into a comprehensive final scorecard with actionable recommendations. Return strictly JSON.`,
          template: `Generate final interview report:\nRole: {{role}}\nType: {{type}}\nDifficulty: {{difficulty}}\nQuestions and Evaluations:\n{{evaluationsSummary}}\n\nReturn JSON schema:\n{\n  "summary": "string",\n  "overallAssessment": "string",\n  "strongAreas": ["string"],\n  "weakAreas": ["string"],\n  "skillsEvaluated": [{"skill": "string", "score": number (0-100)}],\n  "aiRecommendations": ["string"],\n  "suggestedNextPracticeTopics": ["string"],\n  "scores": {\n    "overall": number (0-100),\n    "technicalScore": number (0-100),\n    "communicationScore": number (0-100),\n    "problemSolvingScore": number (0-100),\n    "correctnessScore": number (0-100)\n  }\n}`
        };

      default:
        return {
          systemPrompt: 'You are an AI Interview Assistant. Return strictly JSON.',
          template: 'Context: {{context}}'
        };
    }
  }

  async getPrompt(type, variables = {}) {
    try {
      const activePrompt = await AIPrompt.findOne({ type, isActive: true }).sort({ version: -1 });
      const promptData = activePrompt || this.getDefaultPrompt(type);

      let renderedTemplate = promptData.template;
      for (const [key, val] of Object.entries(variables)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        const formattedVal = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val || '');
        renderedTemplate = renderedTemplate.replace(regex, formattedVal);
      }

      return {
        systemPrompt: promptData.systemPrompt,
        userPrompt: renderedTemplate
      };
    } catch (err) {
      logger.error(`Error loading prompt for type ${type}: ${err.message}`);
      const fallback = this.getDefaultPrompt(type);
      let rendered = fallback.template;
      for (const [key, val] of Object.entries(variables)) {
        rendered = rendered.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(val || ''));
      }
      return { systemPrompt: fallback.systemPrompt, userPrompt: rendered };
    }
  }
}

module.exports = new PromptService();
