import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "jurisprism-secure-jwt-key-32-chars-minimum-length-key";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const DEFAULT_EXPIRATION = "7d";

export interface JWTPayloadData {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function signToken(payload: JWTPayloadData): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(DEFAULT_EXPIRATION)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayloadData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}
