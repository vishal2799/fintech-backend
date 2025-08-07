import { Request, Response } from 'express';
import { SupportTicketService } from './supportTicket.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { RESPONSE } from '../../constants/responseMessages';

export const createSupportTicket = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const userId = req.user!.id;
  const tenantId = req.user!.tenantId;

  const ticket = await SupportTicketService.createTicket(userId, tenantId, data);

  return successHandler(res, {
    data: ticket,
    ...RESPONSE.TICKET.CREATED,
  });
});

export const listMySupportTickets = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const tickets = await SupportTicketService.listMyTickets(userId);

  return successHandler(res, {
    data: tickets,
    ...RESPONSE.TICKET.FETCHED,
  });
});

export const listDistributorsSupportTickets = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const tickets = await SupportTicketService.listTicketsUnderMyRetailers(userId);

  return successHandler(res, {
    data: tickets,
    ...RESPONSE.TICKET.FETCHED,
  });
});

export const getSupportTicketThread = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const ticketId = req.params.ticketId;

  console.log(ticketId, 'ff')

  const thread = await SupportTicketService.getTicketThread(ticketId, userId);

  return successHandler(res, {
    data: thread,
    ...RESPONSE.TICKET.FETCHED,
  });
});

export const addSupportTicketReply = asyncHandler(async (req: Request, res: Response) => {
  // const data = (req as any).validated;
  const data = req.body;
  const userId = req.user!.id;
  const ticketId = req.params.ticketId;

  const reply = await SupportTicketService.addReply(ticketId, userId, data.body, data.attachmentUrl);

  return successHandler(res, {
    data: reply,
    ...RESPONSE.TICKET.REPLIED,
  });
});

export const updateSupportTicketStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const ticketId = req.params.id;

  const updated = await SupportTicketService.updateStatus(ticketId, data.status);

  return successHandler(res, {
    data: updated,
    ...RESPONSE.TICKET.STATUS_UPDATED,
  });
});

export const assignSupportTicket = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const ticketId = req.params.id;

  const updated = await SupportTicketService.assignTicket(ticketId, data.assignedToId);

  return successHandler(res, {
    data: updated,
    ...RESPONSE.TICKET.ASSIGNED,
  });
});

export const listTenantSupportTickets = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;

  const tickets = await SupportTicketService.listAllTicketsForTenant(tenantId);

  return successHandler(res, {
    data: tickets,
    ...RESPONSE.TICKET.FETCHED,
  });
});

export const listAssignedSupportTickets = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const tickets = await SupportTicketService.listAssignedTickets(userId);

  return successHandler(res, {
    data: tickets,
    ...RESPONSE.TICKET.FETCHED,
  });
});
