import { defineRelations } from "drizzle-orm";
import { users } from "./schemas/users.schema";
import { teams } from "./schemas/teams.schema";
import { tickets } from "./schemas/tickets.schema";
import { comments } from "./schemas/comments.schema";
import { attachments } from "./schemas/attatchments.schema";
import { ticketStatusHistory } from "./schemas/ticket-status-history.schema";
import { tags, ticketTags } from "./schemas/tags.schema";
import { cannedReplies } from "./schemas/canned-replies.schema";

export const relations = defineRelations(
  {
    users,
    teams,
    tickets,
    comments,
    attachments,
    ticketStatusHistory,
    tags,
    ticketTags,
    cannedReplies,
  },
  (r) => ({
    users: {
      team: r.one.teams({
        from: r.users.teamId,
        to: r.teams.id,
      }),
      ticketsAsCustomer: r.many.tickets({
        from: r.users.id,
        to: r.tickets.customerId,
      }),
      ticketsAsAgent: r.many.tickets({
        from: r.users.id,
        to: r.tickets.assignedAgentId,
      }),
      comments: r.many.comments(),
      cannedReplies: r.many.cannedReplies(),
    },

    teams: {
      users: r.many.users(),
      tickets: r.many.tickets(),
    },

    tickets: {
      customer: r.one.users({
        from: r.tickets.customerId,
        to: r.users.id,
      }),
      assignedAgent: r.one.users({
        from: r.tickets.assignedAgentId,
        to: r.users.id,
      }),
      team: r.one.teams({
        from: r.tickets.assignedTeamId,
        to: r.teams.id,
      }),
      comments: r.many.comments(),
      attachments: r.many.attachments(),
      statusHistory: r.many.ticketStatusHistory(),
      tags: r.many.tags({
        from: r.tickets.id.through(r.ticketTags.ticketId),
        to: r.tags.id.through(r.ticketTags.tagId),
      }),
    },

    comments: {
      ticket: r.one.tickets({
        from: r.comments.ticketId,
        to: r.tickets.id,
      }),
      author: r.one.users({
        from: r.comments.authorId,
        to: r.users.id,
      }),
    },

    attachments: {
      ticket: r.one.tickets({
        from: r.attachments.ticketId,
        to: r.tickets.id,
      }),
    },

    ticketStatusHistory: {
      ticket: r.one.tickets({
        from: r.ticketStatusHistory.ticketId,
        to: r.tickets.id,
      }),
    },

    tags: {
      tickets: r.many.tickets({
        from: r.tags.id.through(r.ticketTags.tagId),
        to: r.tickets.id.through(r.ticketTags.ticketId),
      }),
    },

    cannedReplies: {
      createdBy: r.one.users({
        from: r.cannedReplies.createdById,
        to: r.users.id,
      }),
    },
  }),
);
