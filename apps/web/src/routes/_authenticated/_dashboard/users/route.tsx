import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/users")({
  component: UsersRoute,
  loader: () => ({
    crumb: "Users",
  }),
});

function UsersRoute() {
  return <Outlet />;
}
