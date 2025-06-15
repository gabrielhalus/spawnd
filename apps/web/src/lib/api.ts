import type { UserProfile } from "@spawnd/shared/schemas/users";

import { queryOptions } from "@tanstack/react-query";

export const fetchAuthenticated = async (input: RequestInfo, init?: RequestInit) => {
  const accessToken = localStorage.getItem("accessToken");

  const headers = new Headers(init?.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(input, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const newAccessToken = (await refreshRes.json()).accessToken;
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        headers.set("Authorization", `Bearer ${newAccessToken}`);
      }

      res = await fetch(input, {
        ...init,
        headers,
      });
    }
  }

  return res;
};

async function getCurrentUser(): Promise<{ user: UserProfile }> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Not authenticated: missing access token");
  }

  const res = await fetchAuthenticated("/api/auth/profile")

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
