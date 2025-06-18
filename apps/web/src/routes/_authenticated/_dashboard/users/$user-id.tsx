import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/users/$user-id",
)({
  component: RouteComponent,
  loader: ctx => ({
    crumb: ctx.params["user-id"],
  }),
});

function RouteComponent() {
  const { "user-id": userId } = Route.useParams();
  return (
    <div>
      Hello "/_authenticated/_dashboard/users/$user-id"!
    </div>
  );
}
