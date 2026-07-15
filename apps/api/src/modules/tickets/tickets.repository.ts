import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { tickets } from "../../db/schemas/tickets.schema";
import {
  AssignTicketPayload,
  NewTicket,
  TicketFiltersPayload,
} from "./tickets.types";
import { comments } from "../../db/schemas/comments.schema";
import { users } from "../../db/schemas/users.schema";
import { DbOrTransaction } from "../../types";
import { TicketStatus } from "./ticket-state-machine";

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
  if (filters.status) {
    conditions.push(eq(tickets.status, filters.status));
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

  let searchRank;
  if (filters.search) {
    conditions.push(
      sql`${tickets.searchVector} @@ websearch_to_tsquery('english', ${filters.search})`,
    );
    searchRank = sql<number>`ts_rank(${tickets.searchVector}, websearch_to_tsquery('english', ${filters.search}))`;
  }

  const sortFn = filters.sortOrder === "asc" ? asc : desc;

  const orderByClause = searchRank
    ? desc(searchRank)
    : sortFn(tickets[filters.sortBy]);

  return db
    .select()
    .from(tickets)
    .where(and(...conditions))
    .orderBy(orderByClause)
    .limit(filters.pageSize)
    .offset((filters.page - 1) * filters.pageSize);
}

export async function updateStatus(
  ticketId: string,
  status: TicketStatus,
  tx: DbOrTransaction = db,
) {
  const [ticket] = await tx
    .update(tickets)
    .set({ status })
    .where(eq(tickets.id, ticketId))
    .returning();
  return ticket;
}

export async function updateAssignment(
  ticketId: string,
  data: Pick<NewTicket, "assignedAgentId" | "assignedTeamId">,
) {
  const [ticket] = await db
    .update(tickets)
    .set(data)
    .where(eq(tickets.id, ticketId))
    .returning();
  return ticket;
}
