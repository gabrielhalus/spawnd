import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/schedules")({
  component: SchedulesRoute,
  loader: () => ({
    crumb: "Schedules",
  }),
});

function SchedulesRoute() {
  return <Outlet />;
}
