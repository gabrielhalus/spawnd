import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/servers")({
  component: ServersRoute,
  loader: () => ({
    crumb: "Servers",
  }),
});

function ServersRoute() {
  return <Outlet />;
}
