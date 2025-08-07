import { Router } from 'express';
// import { upload } from '@/middlewares/multer';
import * as SupportTicketController from './supportTicket.controller';
import {
  createTicketSchema,
//   getTicketsSchema,
  replyToTicketSchema,
  updateTicketStatusSchema,
  assignTicketSchema,
} from './supportTicket.schema';
import { requireAuth } from '../../middlewares/requireAuth';
import { validate } from '../../middlewares/validate';

const router = Router();

router.use(requireAuth);

// 📌 Create a new ticket
router.post(
  '/',
//   upload.single('file'),
  validate(createTicketSchema),
  SupportTicketController.createSupportTicket
);

// 📌 Get tickets (user or admin view)
router.get(
  '/my',
//   validate(getTicketsSchema),
  SupportTicketController.listMySupportTickets
);

router.get(
  '/distributors',
//   validate(getTicketsSchema),
  SupportTicketController.listDistributorsSupportTickets
);

router.get(
  '/:ticketId',
//   upload.single('file'),
  SupportTicketController.getSupportTicketThread
);

// 📌 Add a reply to a ticket
router.post(
  '/:ticketId/reply',
//   upload.single('file'),
  // validate(replyToTicketSchema),
  SupportTicketController.addSupportTicketReply
);

// 📌 Update status (Open, In Progress, Closed)
router.patch(
  '/:ticketId/status',
  validate(updateTicketStatusSchema),
  SupportTicketController.updateSupportTicketStatus
);

// 📌 Assign ticket to employee/distributor/etc.
router.patch(
  '/:ticketId/assign',
  validate(assignTicketSchema),
  SupportTicketController.assignSupportTicket
);

export default router;
