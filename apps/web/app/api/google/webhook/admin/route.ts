import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { withError } from "@/utils/middleware";
import { isAdmin } from "@/utils/admin";
import { processHistoryForUser } from "@/app/api/google/webhook/route";

export const GET = withError(async (request: Request) => {
  const session = await auth();
  if (!session?.user.email)
    return NextResponse.json({ error: "Not authenticated" });
  if (!isAdmin(session.user.email))
    return NextResponse.json({ error: "Not authorized" });

  const { searchParams } = new URL(request.url);
  const emailAddress = searchParams.get("email");
  const historyId = searchParams.get("historyId");

  if (!emailAddress || !historyId)
    return NextResponse.json({ error: "Missing email or historyId" });

  return await processHistoryForUser({
    emailAddress,
    historyId: parseInt(historyId),
  });
});