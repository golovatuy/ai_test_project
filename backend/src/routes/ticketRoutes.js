import express from 'express';
import * as ticketController from '../controllers/ticketController.js';
import {
  validateTicketCreation,
  validateTicketQuery,
  validateTicketUpdate,
  validateTicketId,
  checkValidation
} from '../middleware/validator.js';
import { ticketCreationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/',
  ticketCreationLimiter,
  validateTicketCreation,
  checkValidation,
  ticketController.createTicket
);

router.get(
  '/',
  validateTicketQuery,
  checkValidation,
  ticketController.getTickets
);

router.get(
  '/:id',
  validateTicketId,
  checkValidation,
  ticketController.getTicketById
);

router.put(
  '/:id',
  validateTicketId,
  validateTicketUpdate,
  checkValidation,
  ticketController.updateTicket
);

router.delete(
  '/:id',
  validateTicketId,
  checkValidation,
  ticketController.deleteTicket
);

export default router;

