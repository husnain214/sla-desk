import { app } from "../../src/app";
import { setupRealtime } from "../../src/realtime";

let initialized = false;

if (!initialized) {
  await setupRealtime(app);
  initialized = true;
}

export { app };
