export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  tickets: {
    all: (filters?: Record<string, unknown>) => ["tickets", filters] as const,
    detail: (id: string) => ["tickets", id] as const,
    history: (id: string) => ["tickets", id, "history"] as const,
  },
};
