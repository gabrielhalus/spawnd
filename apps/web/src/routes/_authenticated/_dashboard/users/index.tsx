import type { UserProfile } from "@spawnd/shared/schemas/users";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DataTable } from "@/components/ui/data-table";
import { fetchAuthenticated } from "@/lib/api";

import { columns } from "./-components/columns";

export const Route = createFileRoute("/_authenticated/_dashboard/users/")({
  component: RouteComponent,
});

const getUsers = async (): Promise<{ users: UserProfile[] }> => {
  const res = await fetchAuthenticated("/api/users");
  if (!res.ok)
    throw new Error("Server error");
  return res.json();
};

function RouteComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-users"],
    queryFn: getUsers,
  });

  if (error)
    return error.message;

  if (isPending)
    return "loading...";

  return (
    <div className="border-y">
      <DataTable columns={columns} data={data.users} />
    </div>
  );
}
