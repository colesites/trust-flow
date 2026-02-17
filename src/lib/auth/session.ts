import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() }).catch(() => null);
}

export async function requireServerSession(nextPath = "/dashboard") {
  const session = await getServerSession();

  if (!session?.user || !session?.session) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}
