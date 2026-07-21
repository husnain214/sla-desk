import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { hashPassword } from "../shared/utils/auth";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@sladesk.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";

async function seedAdmin() {
  const existing = await db.query.users.findFirst({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log(`Admin already exists: ${ADMIN_EMAIL} — skipping.`);
    process.exit(0);
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  const [admin] = await db
    .insert(users)
    .values({
      name: "Admin",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    })
    .returning();

  console.log("Seeded admin:", { id: admin.id, email: admin.email });
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Admin seed failed:", err);
  process.exit(1);
});
