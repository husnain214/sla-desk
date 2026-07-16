import { describe, it, expect } from "vitest";
import { calculateSlaDueAt } from "../../src/modules/tickets/sla";

describe("calculateSlaDueAt", () => {
  it("adds 1 hour for urgent priority", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    const result = calculateSlaDueAt("urgent", from);
    expect(result.toISOString()).toBe("2026-01-01T01:00:00.000Z");
  });

  it("adds 72 hours for low priority", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    const result = calculateSlaDueAt("low", from);
    expect(result.toISOString()).toBe("2026-01-04T00:00:00.000Z");
  });
});
