import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/backups/")({
  component: backups,
});

function backups() {
  return <div>Hello "/_authenticated/_dashboard/backups/"!</div>;
}
