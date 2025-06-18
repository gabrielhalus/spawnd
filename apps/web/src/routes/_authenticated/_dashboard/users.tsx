import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/users")({
  component: UsersLayout,
  loader: () => ({
    crumb: "Users",
  }),
});

function UsersLayout() {
  return <Outlet />;
}
