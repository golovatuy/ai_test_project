import { body, validationResult, query, param } from 'express-validator';
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from '../utils/constants.js';

/**
 * Validation middleware for ticket creation
 */
export const validateTicketCreation = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ max: 100 })
    .withMessage('Customer name cannot exceed 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters')
];

/**
 * Validation middleware for ticket queries
 */
export const validateTicketQuery = [
  query('category')
    .optional()
    .isIn(TICKET_CATEGORIES)
    .withMessage(`Invalid category. Must be one of: ${TICKET_CATEGORIES.join(', ')}`),
  
  query('priority')
    .optional()
    .isIn(TICKET_PRIORITIES)
    .withMessage(`Invalid priority. Must be one of: ${TICKET_PRIORITIES.join(', ')}`),
  
  query('status')
    .optional()
    .isIn(TICKET_STATUSES)
    .withMessage(`Invalid status. Must be one of: ${TICKET_STATUSES.join(', ')}`),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'priority', 'category', 'status'])
    .withMessage('Invalid sortBy. Must be one of: createdAt, priority, category, status'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sortOrder. Must be asc or desc'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Validation middleware for ticket updates
 */
export const validateTicketUpdate = [
  body('status')
    .optional()
    .isIn(TICKET_STATUSES)
    .withMessage(`Invalid status. Must be one of: ${TICKET_STATUSES.join(', ')}`),
  
  body('assignedTeam')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned team cannot exceed 100 characters'),
  
  body('category')
    .optional()
    .isIn(TICKET_CATEGORIES)
    .withMessage(`Invalid category. Must be one of: ${TICKET_CATEGORIES.join(', ')}`),
  
  body('priority')
    .optional()
    .isIn(TICKET_PRIORITIES)
    .withMessage(`Invalid priority. Must be one of: ${TICKET_PRIORITIES.join(', ')}`)
];

/**
 * Validation middleware for ticket ID param
 */
export const validateTicketId = [
  param('id')
    .notEmpty()
    .withMessage('Ticket ID is required')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid ticket ID format')
];

/**
 * Middleware to check validation results
 */
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().reduce((acc, error) => {
      const field = error.path || error.param;
      acc[field] = error.msg;
      return acc;
    }, {});

    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errorDetails
      }
    });
  }
  next();
};

