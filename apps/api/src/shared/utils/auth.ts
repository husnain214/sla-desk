import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
}

export async function comparePassword(password: string, passwordHash: string) {
  const matches = await bcrypt.compare(password, passwordHash);
  return matches;
}
