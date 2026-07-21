import { db } from "..";
import { env } from "../../config/env";
import { hashPassword } from "../../shared/utils/auth";
import { users } from "../schemas/users.schema";

const ADMIN_EMAIL = env.ADMIN_EMAIL;
const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

export async function seedAdmin() {
  const existing = await db.query.users.findFirst({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log(`Admin already exists: ${ADMIN_EMAIL} — skipping.`);
    return;
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
}
