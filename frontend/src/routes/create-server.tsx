import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-server")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/create-server"!</div>;
}
