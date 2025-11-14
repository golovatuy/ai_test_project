/**
 * Create a custom error object
 */
export const createError = (message, statusCode = 500, code = 'ERROR', details = {}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

