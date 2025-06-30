import type { UserProfile } from "@spawnd/shared/schemas/users";

import { fetchAuthenticated } from "@/lib/api/http";

export async function getCurrentUser(): Promise<{ user: UserProfile }> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Not authenticated: missing access token");
  }

  const res = await fetchAuthenticated("/api/auth/profile");

  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    throw new Error("Not authenticated: invalid token");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await res.json();
}
