import logger from '../utils/logger.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack, url: req.url });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.reduce((acc, msg, index) => {
          const field = Object.keys(err.errors)[index];
          acc[field] = msg;
          return acc;
        }, {})
      }
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid ticket ID format',
        code: 'VALIDATION_ERROR',
        details: {
          id: err.value
        }
      }
    });
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code || 'ERROR',
        details: err.details || {}
      }
    });
  }

  // Default 500 server error
  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }
    }
  });
};

