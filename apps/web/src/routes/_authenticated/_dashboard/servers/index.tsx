import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/servers/")({
  component: Servers,
});

function Servers() {
  return <div>Hello "/_authenticated/_dashboard/servers/"!</div>;
}
