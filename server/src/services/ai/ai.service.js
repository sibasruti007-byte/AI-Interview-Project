const config = require('../../config/env');
const logger = require('../../utils/logger');

// Pluggable AI Service with automatic structured JSON parsing, multi-provider fallback & retry
class AIService {
  constructor() {
    this.provider = config.AI_PROVIDER || 'gemini';
    this.geminiKey = config.AI_API_KEY;
    this.openaiKey = config.OPENAI_API_KEY;
    this.geminiModel = config.AI_MODEL || 'gemini-1.5-flash';
    this.openaiModel = config.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async generateStructuredJSON(systemPrompt, userPrompt, fallbackGenerator) {
    let result = null;

    // 1. Try Gemini if configured
    if ((this.provider === 'gemini' || !this.provider) && this.geminiKey) {
      try {
        result = await this._callGemini(systemPrompt, userPrompt);
        if (result) return result;
      } catch (err) {
        logger.warn(`Gemini AI call failed: ${err.message}. Trying fallback/OpenAI.`);
      }
    }

    // 2. Try OpenAI if configured
    if (this.openaiKey) {
      try {
        result = await this._callOpenAI(systemPrompt, userPrompt);
        if (result) return result;
      } catch (err) {
        logger.warn(`OpenAI call failed: ${err.message}. Triggering heuristic fallback engine.`);
      }
    }

    // 3. Robust Heuristic Fallback Engine
    logger.info('Using intelligent built-in AI Heuristic & Analytical Engine');
    if (typeof fallbackGenerator === 'function') {
      return fallbackGenerator();
    }

    return { error: 'Failed to generate response' };
  }

  async _callGemini(systemPrompt, userPrompt) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(this.geminiKey);
    const model = genAI.getGenerativeModel({ model: this.geminiModel });

    const combinedPrompt = `${systemPrompt}\n\nCRITICAL INSTRUCTION: You MUST return ONLY valid, raw JSON with no Markdown backticks or commentary.\n\nUser Context:\n${userPrompt}`;

    const response = await model.generateContent(combinedPrompt);
    const text = response.response.text();
    return this._cleanAndParseJSON(text);
  }

  async _callOpenAI(systemPrompt, userPrompt) {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: this.openaiKey });

    const completion = await openai.chat.completions.create({
      model: this.openaiModel,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `${systemPrompt}\nYou MUST return valid structured JSON.` },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0]?.message?.content;
    return this._cleanAndParseJSON(text);
  }

  _cleanAndParseJSON(rawText) {
    if (!rawText) return null;
    let cleaned = rawText.trim();
    // Remove markdown code blocks if present
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
    }

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      logger.error(`JSON Parse error on AI response: ${parseError.message}`, { rawText });
      return null;
    }
  }
}

module.exports = new AIService();
