import type { UserProfile } from "@spawnd/shared/schemas/users";

import { fetchAuthenticated } from "@/lib/api/http";

export async function getAllUsers(): Promise<UserProfile[]> {
  const res = await fetchAuthenticated("/api/users");
  if (!res.ok) {
    throw new Error("Failed to get users");
  }
  return res.json().then(data => data.users);
}

export async function deleteUser({ id }: { id: string }): Promise<UserProfile> {
  const res = await fetchAuthenticated(`/api/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
}
