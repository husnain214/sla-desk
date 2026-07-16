import { describe, it, expect } from "vitest";
import { canTransition } from "../../src/modules/tickets/ticket-state-machine";

describe("canTransition", () => {
  it("allows open -> pending", () => {
    expect(canTransition("open", "pending")).toBe(true);
  });

  it("allows pending -> resolved", () => {
    expect(canTransition("pending", "resolved")).toBe(true);
  });

  it("allows resolved -> open (reopen)", () => {
    expect(canTransition("resolved", "open")).toBe(true);
  });

  it("rejects open -> closed (skipping states)", () => {
    expect(canTransition("open", "closed")).toBe(false);
  });

  it("rejects any transition out of closed", () => {
    expect(canTransition("closed", "open")).toBe(false);
    expect(canTransition("closed", "pending")).toBe(false);
  });
});
