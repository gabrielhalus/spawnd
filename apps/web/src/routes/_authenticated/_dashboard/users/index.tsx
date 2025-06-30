import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DataTable } from "@/components/ui/data-table";
import { getAllUsersQueryOptions } from "@/lib/queries/user";

import { columns } from "./-components/columns";

export const Route = createFileRoute("/_authenticated/_dashboard/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isPending, error, data } = useQuery(getAllUsersQueryOptions);

  if (error)
    return error.message;

  if (isPending)
    return "loading...";

  return (
    <div className="border-y">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
