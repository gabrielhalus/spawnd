import type { UserProfile } from "@spawnd/shared/schemas/users";

import { queryOptions } from "@tanstack/react-query";

async function getCurrentUser(): Promise<{ user: UserProfile }> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Not authenticated: missing access token");
  }

  const res = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    throw new Error("Not authenticated: invalid token");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await res.json();
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});
