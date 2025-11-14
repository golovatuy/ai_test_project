import OpenAI from 'openai';
import logger from '../utils/logger.js';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../utils/constants.js';

// Temporarily commented out OpenAI initialization for testing without API key
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

/**
 * Process ticket with AI to categorize, prioritize, and summarize
 * @param {Object} ticketData - Ticket data (customerName, email, subject, description)
 * @returns {Promise<Object>} AI processing results
 */
export const processTicketWithAI = async (ticketData) => {
  // Temporarily skip AI processing if API key is not available
  if (!process.env.OPENAI_API_KEY) {
    logger.warn('OPENAI_API_KEY not set, skipping AI processing and using defaults');
    return {
      category: 'General Inquiry',
      priority: 'Medium',
      summary: null,
      aiConfidence: null,
      aiProcessingError: 'AI service disabled: OPENAI_API_KEY not configured',
      aiProcessedAt: null
    };
  }

  // Initialize OpenAI client only if API key is available
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const prompt = `Analyze the following support ticket and provide:
1. Category (one of: ${TICKET_CATEGORIES.join(', ')})
2. Priority (one of: ${TICKET_PRIORITIES.join(', ')})
3. A concise 2-3 sentence summary

Ticket Subject: ${ticketData.subject}
Ticket Description: ${ticketData.description}

Return your response as JSON with this exact structure:
{
  "category": "category_name",
  "priority": "priority_level",
  "summary": "2-3 sentence summary here",
  "confidence": 0.95
}`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a support ticket triage system. Analyze tickets and categorize, prioritize, and summarize them accurately.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 300
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from AI');
    }

    const aiResult = JSON.parse(responseText);

    // Validate and sanitize AI response
    const category = TICKET_CATEGORIES.includes(aiResult.category)
      ? aiResult.category
      : 'General Inquiry';
    
    const priority = TICKET_PRIORITIES.includes(aiResult.priority)
      ? aiResult.priority
      : 'Medium';
    
    const summary = aiResult.summary?.substring(0, 500) || '';
    const confidence = Math.max(0, Math.min(1, aiResult.confidence || 0.5));

    return {
      category,
      priority,
      summary,
      aiConfidence: confidence,
      aiProcessedAt: new Date()
    };
  } catch (error) {
    logger.error(`AI processing error: ${error.message}`, { error });
    
    // Return defaults on AI failure
    return {
      category: 'General Inquiry',
      priority: 'Medium',
      summary: null,
      aiConfidence: null,
      aiProcessingError: `AI service error: ${error.message}`,
      aiProcessedAt: null
    };
  }
};

