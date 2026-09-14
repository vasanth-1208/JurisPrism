import { NextRequest } from "next/server";
import { verifyToken, JWTPayloadData } from "./jwt";

export const AUTH_COOKIE_NAME = "jurisprism_session";

export async function getUserFromRequest(request: NextRequest): Promise<JWTPayloadData | null> {
  // 1. Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const user = await verifyToken(token);
    if (user) return user;
  }

  // 2. Check HTTP-only cookie
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (cookie?.value) {
    return verifyToken(cookie.value);
  }

  return null;
}
