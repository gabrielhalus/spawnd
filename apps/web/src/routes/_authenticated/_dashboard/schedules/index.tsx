import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/schedules/")({
  component: Schedules,
});

function Schedules() {
  return <div>Hello "/_authenticated/_dashboard/schedules/"!</div>;
}
