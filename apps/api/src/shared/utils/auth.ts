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

export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader
    .split(";")
    .reduce<Record<string, string>>((cookies, cookie) => {
      const [name, ...value] = cookie.trim().split("=");

      if (!name) return cookies;

      cookies[name] = decodeURIComponent(value.join("="));
      return cookies;
    }, {});
}
