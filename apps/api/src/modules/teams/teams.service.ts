import * as teamsRepository from "./teams.repository";
import { AppError } from "../../shared/errors/app-error";
import type { CreateTeamPayload } from "@myapp/shared";

export async function createTeam(payload: CreateTeamPayload) {
  return teamsRepository.insertTeam(payload);
}

export async function listTeams() {
  return teamsRepository.findAllTeams();
}

export async function deleteTeamById(id: string) {
  const team = await teamsRepository.findTeamById(id);
  if (!team) throw new AppError("Team not found", 404);
  return teamsRepository.deleteTeam(id);
}
