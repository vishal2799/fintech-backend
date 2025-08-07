import { supportTickets, supportReplies, users } from '../../db/schema';
import { eq, and, or, asc, inArray, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';

export const SupportTicketService = {
  // Create a support ticket
  async createTicket(userId: string, tenantId: string, input: {
    category: string;
    subject: string;
    description: string;
    attachmentUrl?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) {
    const id = uuidv4();

    const [ticket] = await db.insert(supportTickets).values({
      id,
      tenantId,
      userId,
      subject: input.subject,
      category: input.category,
      description: input.description,
      attachmentUrl: input.attachmentUrl,
      status: 'OPEN',
      priority: input.priority || 'MEDIUM',
    }).returning();

    return ticket;
  },

  // List tickets for a given user (Retailer or Distributor)
  async listMyTickets(userId: string) {
    return db.query.supportTickets.findMany({
      where: eq(supportTickets.userId, userId),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });
  },

async listTicketsUnderMyRetailers(distributorId: string) {
  // 1. Get IDs of users whose parentId is this distributor
  const childUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.parentId, distributorId));

  const retailerIds = childUsers.map(u => u.id);
  if (retailerIds.length === 0) return [];

  // 2. Fetch tickets where userId is one of those retailerIds
  const tickets = await db
    .select()
    .from(supportTickets)
    .where(inArray(supportTickets.userId, retailerIds))
    .orderBy(desc(supportTickets.createdAt));

  return tickets;
},

  // Get full ticket with replies (for viewing thread)
  async getTicketThread(ticketId: string, userId: string) {
    const ticket = await db.query.supportTickets.findFirst({
  where: eq(supportTickets.id, ticketId),
});

if (!ticket) throw new AppError(ERRORS.TICKET_NOT_FOUND);
// if (ticket.userId !== userId && !ticket.assignedTo)
//   throw new AppError(ERRORS.UNAUTHORIZED);

// Fetch replies manually
const replies = await db.query.supportReplies.findMany({
  where: eq(supportReplies.ticketId, ticketId),
  orderBy: (replies, { asc }) => [asc(replies.createdAt)],
});

// Fetch users for each reply (optional, for enriched UI)
const userIds = [...new Set(replies.map(r => r.userId))];
const usersMap = new Map(
  (await db.query.users.findMany({
    where: (users, { inArray }) => inArray(users.id, userIds),
  })).map(u => [u.id, u])
);

// Attach user to each reply
const repliesWithUsers = replies.map(r => ({
  ...r,
  user: usersMap.get(r.userId),
}));

// Get ticket user as well
const ticketUser = await db.query.users.findFirst({
  where: eq(users.id, ticket.userId),
});

return {
  ...ticket,
  user: ticketUser,
  replies: repliesWithUsers,
};

    // const ticket = await db.query.supportTickets.findFirst({
    //   where: eq(supportTickets.id, ticketId),
    //   with: {
    //     replies: {
    //       orderBy: () => [asc(supportReplies.createdAt)],
    //       with: {
    //         user: true,
    //       },
    //     },
    //     user: true,
    //   },
    // });

    // if (!ticket) throw new AppError(ERRORS.TICKET_NOT_FOUND);
    // if (ticket.userId !== userId && !ticket.assignedTo)
    //   throw new AppError(ERRORS.UNAUTHORIZED);

    // return ticket;
  },

  // Add a reply
  async addReply(ticketId: string, userId: string, body: string, attachmentUrl?: string) {
    const [reply] = await db.insert(supportReplies).values({
      id: uuidv4(),
      ticketId,
      userId,
      message: body,
      attachmentUrl,
    }).returning();

    return reply;
  },

  // Change ticket status (e.g., by support employee)
  async updateStatus(ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED') {
    const [updated] = await db.update(supportTickets)
      .set({ status })
      .where(eq(supportTickets.id, ticketId))
      .returning();

    if (!updated) throw new AppError(ERRORS.TICKET_NOT_FOUND);
    return updated;
  },

  // Assign ticket to support employee or higher role
  async assignTicket(ticketId: string, assignedToId: string) {
    const [updated] = await db.update(supportTickets)
      .set({ assignedTo: assignedToId })
      .where(eq(supportTickets.id, ticketId))
      .returning();

    if (!updated) throw new AppError(ERRORS.TICKET_NOT_FOUND);
    return updated;
  },

  // List all tickets for tenant (for WL Admin or Super Admin)
  async listAllTicketsForTenant(tenantId: string) {
    return db.query.supportTickets.findMany({
      where: eq(supportTickets.tenantId, tenantId),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      with: {
        user: true,
      },
    });
  },

  // List tickets assigned to a specific user (e.g., support staff or distributor)
  async listAssignedTickets(userId: string) {
    return db.query.supportTickets.findMany({
      where: eq(supportTickets.assignedTo, userId),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      with: {
        user: true,
      },
    });
  }
};
