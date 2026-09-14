import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionUser = await getUserFromRequest(req);
  if (!sessionUser) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = db.findUserById(sessionUser.userId);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
