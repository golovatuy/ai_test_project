import Ticket from '../models/Ticket.js';
import { processTicketWithAI } from './aiService.js';
import { CATEGORY_TO_TEAM } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Create a new ticket and process it with AI
 * @param {Object} ticketData - Ticket data
 * @returns {Promise<Object>} Created ticket
 */
export const createTicket = async (ticketData) => {
  try {
    // Create ticket with status "Processing"
    const ticket = new Ticket({
      ...ticketData,
      status: 'Processing'
    });
    
    await ticket.save();
    logger.info(`Ticket created: ${ticket._id}`);

    // Process with AI
    try {
      const aiResults = await processTicketWithAI(ticketData);
      
      // Update ticket with AI results
      ticket.category = aiResults.category;
      ticket.priority = aiResults.priority;
      ticket.summary = aiResults.summary;
      ticket.aiConfidence = aiResults.aiConfidence;
      ticket.aiProcessedAt = aiResults.aiProcessedAt;
      ticket.assignedTeam = CATEGORY_TO_TEAM[aiResults.category];
      ticket.status = 'New';
      
      if (aiResults.aiProcessingError) {
        ticket.aiProcessingError = aiResults.aiProcessingError;
      }
      
      await ticket.save();
      logger.info(`Ticket processed with AI: ${ticket._id}`);
    } catch (aiError) {
      logger.error(`AI processing failed for ticket ${ticket._id}: ${aiError.message}`);
      // Ticket remains with default values and status "Processing"
    }

    return ticket;
  } catch (error) {
    logger.error(`Error creating ticket: ${error.message}`);
    throw error;
  }
};

/**
 * Get all tickets with optional filters
 * @param {Object} filters - Query filters
 * @param {Object} options - Query options (sort, pagination)
 * @returns {Promise<Object>} Tickets and pagination info
 */
export const getTickets = async (filters = {}, options = {}) => {
  try {
    const {
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query = Ticket.find(filters);
    
    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    query.sort(sort);
    
    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).limit(Math.min(limit, 100));
    
    const [tickets, totalItems] = await Promise.all([
      query.exec(),
      Ticket.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      tickets,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    logger.error(`Error getting tickets: ${error.message}`);
    throw error;
  }
};

/**
 * Get a single ticket by ID
 * @param {String} ticketId - Ticket ID
 * @returns {Promise<Object>} Ticket
 */
export const getTicketById = async (ticketId) => {
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  } catch (error) {
    logger.error(`Error getting ticket ${ticketId}: ${error.message}`);
    throw error;
  }
};

/**
 * Update a ticket
 * @param {String} ticketId - Ticket ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated ticket
 */
export const updateTicket = async (ticketId, updates) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    logger.info(`Ticket updated: ${ticketId}`);
    return ticket;
  } catch (error) {
    logger.error(`Error updating ticket ${ticketId}: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a ticket
 * @param {String} ticketId - Ticket ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteTicket = async (ticketId) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    logger.info(`Ticket deleted: ${ticketId}`);
    return { id: ticketId };
  } catch (error) {
    logger.error(`Error deleting ticket ${ticketId}: ${error.message}`);
    throw error;
  }
};

