import type { UserProfile } from "@spawnd/shared/schemas/users";

import { queryOptions } from "@tanstack/react-query";

async function getCurrentUser(): Promise<{ user: UserProfile }> {
  const res = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!res.ok) {
    throw new Error("server error");
  }

  return await res.json();
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});
