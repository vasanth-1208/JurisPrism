import { db } from "./index";
import { hashPassword } from "../auth/password";
import { User } from "@/types";

export const DEMO_USER_ID = "usr-demo-001";
export const DEMO_USER_EMAIL = "demo@jurisprism.law";
export const DEMO_USER_PASSWORD = "DemoPass123!";

export async function ensureSeedData() {
  const existingUser = db.findUserByEmail(DEMO_USER_EMAIL);
  if (!existingUser) {
    const passwordHash = await hashPassword(DEMO_USER_PASSWORD);
    const demoUser: User = {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      name: "Alex Morgan",
      passwordHash,
      role: "demo",
      createdAt: new Date().toISOString(),
    };
    db.createUser(demoUser);
  }
}
