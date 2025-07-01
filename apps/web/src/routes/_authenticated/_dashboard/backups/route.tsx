import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/backups")({
  component: backupsRoute,
  loader: () => ({
    crumb: "Backups",
  }),
});

function backupsRoute() {
  return <Outlet />;
}
