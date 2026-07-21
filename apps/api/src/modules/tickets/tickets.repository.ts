import { and, asc, desc, eq, getColumns, sql } from "drizzle-orm";
import { db } from "../../db";
import { tickets } from "../../db/schemas/tickets.schema";
import { NewTicket, TicketFiltersPayload } from "./tickets.types";
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

export async function findTicketById(
  id: string,
  includeInternalComments: boolean,
) {
  const ticket = await db.query.tickets.findFirst({
    where: { id },
    with: {
      customer: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignedAgent: {
        columns: {
          id: true,
          name: true,
        },
      },
      comments: {
        ...(!includeInternalComments && { where: { isInternal: false } }),
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      attachments: true,
      tags: true,
    },
  });

  if (!ticket) return null;

  return ticket;
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
    const matchExpr = sql`(
    setweight(to_tsvector('english', ${tickets.title}), 'A') ||
    setweight(to_tsvector('english', coalesce(${tickets.description}, '')), 'B')
  )`;

    conditions.push(
      sql`${matchExpr} @@ websearch_to_tsquery('english', ${filters.search})`,
    );
    searchRank = sql<number>`ts_rank(${matchExpr}, websearch_to_tsquery('english', ${filters.search}))`;
  }

  const sortFn = filters.sortOrder === "asc" ? asc : desc;

  const orderByClause = searchRank
    ? desc(searchRank)
    : sortFn(tickets[filters.sortBy]);

  return db
    .select({
      ...getColumns(tickets),
      tags: sql<{ id: string; name: string }[]>`
        COALESCE(
          (SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
           FROM ticket_tags tt
           JOIN tags t ON t.id = tt.tag_id
           WHERE tt.ticket_id = ${tickets.id}),
          '[]'
        )
      `,
    })
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
