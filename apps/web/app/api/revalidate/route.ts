import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { parseAppEnv } from "@/lib/env";
import { resolveRevalidationTargets, type RevalidatePayload } from "@/lib/revalidate";

export async function POST(request: NextRequest) {
  const env = parseAppEnv();
  const authHeader = request.headers.get("authorization");
  const providedSecret =
    request.nextUrl.searchParams.get("secret") ??
    authHeader?.replace(/^Bearer\s+/i, "");

  if (!env.revalidateSecret || providedSecret !== env.revalidateSecret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as RevalidatePayload;
  const slug =
    typeof payload.slug === "string" ? payload.slug : payload.slug?.current;

  const targets = resolveRevalidationTargets({
    ...payload,
    slug,
  });

  for (const target of targets) {
    revalidatePath(target);
  }

  return NextResponse.json({ revalidated: targets, type: payload._type ?? "unknown" });
}
