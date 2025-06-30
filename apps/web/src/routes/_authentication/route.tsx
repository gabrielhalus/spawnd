import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/queries/auth";

export const Route = createFileRoute("/_authentication")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      await queryClient.fetchQuery(userQueryOptions);
      return redirect({ to: "/" });
    } catch {

    }
  },
  component: AuthenticationLayout,
});

function AuthenticationLayout() {
  return <Outlet />;
}
