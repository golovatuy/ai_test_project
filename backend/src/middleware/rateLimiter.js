import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10;

/**
 * Rate limiter for ticket creation endpoint
 */
export const ticketCreationLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: {
    success: false,
    error: {
      message: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      details: {
        retryAfter: Math.ceil(windowMs / 1000)
      }
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: windowMs * 6, // 6 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false
});

