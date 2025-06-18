import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/users/$user-id",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { "user-id": userId } = Route.useParams();
  return (
    <div>
      Hello "/_authenticated/_dashboard/users/$user-id"!
      {userId}
    </div>
  );
}
