import * as tagsRepository from "./tags.repository";
import * as ticketsService from "../tickets/tickets.service";
import { JwtPayload } from "../auth/auth.types";

export async function createTag(name: string) {
  return tagsRepository.insertTag(name);
}

export async function listTags() {
  return tagsRepository.findAllTags();
}

export async function tagTicket(
  ticketId: string,
  tagId: string,
  requestingUser: JwtPayload,
) {
  await ticketsService.getTicketById(ticketId, requestingUser);
  return tagsRepository.attachTagToTicket(ticketId, tagId);
}

export async function untagTicket(
  ticketId: string,
  tagId: string,
  requestingUser: JwtPayload,
) {
  await ticketsService.getTicketById(ticketId, requestingUser);
  return tagsRepository.detachTagFromTicket(ticketId, tagId);
}
