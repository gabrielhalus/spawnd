import type { UserProfile } from "@spawnd/shared/schemas/users";

import { useQuery } from "@tanstack/react-query";

import { userQueryOptions } from "@/lib/api";

type UseAuthReturn =
  | { user: undefined; isLoading: true; isError: false }
  | { user: null; isLoading: false; isError: true }
  | { user: UserProfile; isLoading: false; isError: false };

export function useAuth(): UseAuthReturn {
  const { data, isLoading, isError } = useQuery(userQueryOptions);

  if (isLoading) {
    return { user: undefined, isLoading: true, isError: false };
  }

  if (isError) {
    return { user: null, isLoading: false, isError: true };
  }

  // At this point, data is guaranteed to exist
  return { user: data!.user, isLoading: false, isError: false };
}
