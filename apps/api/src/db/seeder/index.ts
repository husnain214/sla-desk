import { seedAdmin } from "./admin";
import { seedTags } from "./tags";

async function seed() {
  await seedAdmin();
  await seedTags();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeder failed:", err);
  process.exit(1);
});
