import { db } from "..";
import { tags } from "../schemas/tags.schema";

const DEFAULT_TAGS = [
  "Hardware",
  "Software",
  "Billing",
  "Account Access",
  "Bug",
  "Feature Request",
  "Network",
  "Onboarding",
];

export async function seedTags() {
  for (const name of DEFAULT_TAGS) {
    await db.insert(tags).values({ name }).onConflictDoNothing();
  }
  console.log(`Seeded ${DEFAULT_TAGS.length} tags (existing ones skipped).`);
}
