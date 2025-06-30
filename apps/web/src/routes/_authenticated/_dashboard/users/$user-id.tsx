import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { fetchAuthenticated } from "@/lib/api";

import { UserCard } from "./-components/user-card";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/users/$user-id",
)({
  component: RouteComponent,
  loader: ctx => ({
    crumb: ctx.params["user-id"],
  }),
});

const fetchUser = async (userId: string) => {
  const response = await fetchAuthenticated(`/api/users/${userId}`);
  return response.json();
};

function RouteComponent() {
  const { "user-id": userId } = Route.useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["get-user", userId],
    queryFn: () => fetchUser(userId),
  });

  if (isPending)
    return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    );
  }

  return (
    <div>
      <UserCard user={data.user} />
    </div>
  );
}
