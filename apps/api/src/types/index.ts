import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../db";

export type AppInstance = FastifyInstance<any, any, any, any, ZodTypeProvider>;

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbOrTransaction = typeof db | Transaction;
