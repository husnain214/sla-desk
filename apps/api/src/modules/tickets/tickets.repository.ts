import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { tickets } from "../../db/schemas/tickets.schema";
import { NewTicket, TicketFiltersPayload } from "./tickets.types";
import { comments } from "../../db/schemas/comments.schema";
import { users } from "../../db/schemas/users.schema";

export async function createTicket(data: NewTicket) {
  const rows = await db
    .insert(tickets)
    .values({
      ...data,
    })
    .returning();

  return rows[0];
}

export async function findTicketById(id: string) {
  const rows = await db
    .select({
      ticket: tickets,
      customer: {
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      },
      comments: sql`COALESCE(json_agg(${comments}) FILTER (WHERE ${comments.id} IS NOT NULL), '[]')`,
    })
    .from(tickets)
    .leftJoin(comments, eq(comments.ticketId, tickets.id))
    .leftJoin(users, eq(users.id, tickets.customerId))
    .where(eq(tickets.id, id))
    .groupBy(tickets.id, users.id);

  if (rows.length === 0) return null;

  const { ticket, customer, comments: commentList } = rows[0];

  return {
    ...ticket,
    customer,
    comments: commentList,
  };
}

export async function findTicketsForCustomer(customerId: string) {
  return db.select().from(tickets).where(eq(tickets.customerId, customerId));
}

export async function findAllTickets(filters: TicketFiltersPayload) {
  const conditions = [];

  if (filters.priority) {
    conditions.push(eq(tickets.priority, filters.priority));
  }

  if (filters.search) {
    conditions.push(
      or(
        ilike(tickets.title, `%${filters.search}%`),
        ilike(tickets.description, `%${filters.search}%`),
      ),
    );
  }

  if (filters.assignedAgentId) {
    conditions.push(eq(tickets.assignedAgentId, filters.assignedAgentId));
  }

  if (filters.assignedTeamId) {
    conditions.push(eq(tickets.assignedTeamId, filters.assignedTeamId));
  }

  if (filters.slaBreached !== undefined) {
    conditions.push(eq(tickets.slaBreached, filters.slaBreached));
  }

  if (filters.status) {
    conditions.push(eq(tickets.status, filters.status));
  }

  const sortFn = filters.sortOrder === "asc" ? asc : desc;

  return db
    .select()
    .from(tickets)
    .where(and(...conditions))
    .orderBy(sortFn(tickets[filters.sortBy]))
    .limit(filters.pageSize)
    .offset((filters.page - 1) * filters.pageSize);
}
