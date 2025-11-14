import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred';
    const errorCode = error.response?.data?.error?.code || 'UNKNOWN_ERROR';
    const errorDetails = error.response?.data?.error?.details || {};

    return Promise.reject({
      message: errorMessage,
      code: errorCode,
      details: errorDetails,
      status: error.response?.status
    });
  }
);

/**
 * Create a new ticket
 * @param {Object} ticketData - Ticket data
 * @returns {Promise<Object>} Created ticket
 */
export const createTicket = async (ticketData) => {
  return apiClient.post('/tickets', ticketData);
};

/**
 * Get all tickets with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Tickets and pagination
 */
export const getTickets = async (params = {}) => {
  return apiClient.get('/tickets', { params });
};

/**
 * Get a single ticket by ID
 * @param {String} ticketId - Ticket ID
 * @returns {Promise<Object>} Ticket
 */
export const getTicketById = async (ticketId) => {
  return apiClient.get(`/tickets/${ticketId}`);
};

/**
 * Update a ticket
 * @param {String} ticketId - Ticket ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated ticket
 */
export const updateTicket = async (ticketId, updates) => {
  return apiClient.put(`/tickets/${ticketId}`, updates);
};

/**
 * Delete a ticket
 * @param {String} ticketId - Ticket ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteTicket = async (ticketId) => {
  return apiClient.delete(`/tickets/${ticketId}`);
};

export default apiClient;

