import * as ticketService from '../services/ticketService.js';
import { createError } from '../utils/errors.js';

/**
 * Create a new ticket
 */
export const createTicket = async (req, res, next) => {
  try {
    const ticketData = {
      customerName: req.body.customerName,
      email: req.body.email,
      subject: req.body.subject,
      description: req.body.description
    };

    const ticket = await ticketService.createTicket(ticketData);
    
    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Ticket created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tickets
 */
export const getTickets = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.status) filters.status = req.query.status;

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };

    const result = await ticketService.getTickets(filters, options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single ticket by ID
 */
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    if (error.message === 'Ticket not found') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Ticket not found',
          code: 'NOT_FOUND',
          details: {
            id: req.params.id
          }
        }
      });
    }
    next(error);
  }
};

/**
 * Update a ticket
 */
export const updateTicket = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.assignedTeam) updates.assignedTeam = req.body.assignedTeam;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.priority) updates.priority = req.body.priority;

    const ticket = await ticketService.updateTicket(req.params.id, updates);
    
    res.status(200).json({
      success: true,
      data: ticket,
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    if (error.message === 'Ticket not found') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Ticket not found',
          code: 'NOT_FOUND'
        }
      });
    }
    next(error);
  }
};

/**
 * Delete a ticket
 */
export const deleteTicket = async (req, res, next) => {
  try {
    const result = await ticketService.deleteTicket(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
      data: result
    });
  } catch (error) {
    if (error.message === 'Ticket not found') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Ticket not found',
          code: 'NOT_FOUND'
        }
      });
    }
    next(error);
  }
};

