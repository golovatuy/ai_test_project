/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate ticket form data
 */
export const validateTicketForm = (data) => {
  const errors = {};

  if (!data.customerName || data.customerName.trim().length === 0) {
    errors.customerName = 'Customer name is required';
  } else if (data.customerName.length > 100) {
    errors.customerName = 'Customer name cannot exceed 100 characters';
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please provide a valid email address';
  } else if (data.email.length > 255) {
    errors.email = 'Email cannot exceed 255 characters';
  }

  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = 'Subject is required';
  } else if (data.subject.length > 200) {
    errors.subject = 'Subject cannot exceed 200 characters';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  } else if (data.description.length > 5000) {
    errors.description = 'Description cannot exceed 5000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

