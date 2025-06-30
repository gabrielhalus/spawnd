import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DataTable } from "@/components/ui/data-table";
import { getAllUsersQueryOptions } from "@/lib/queries/user";

import { columns } from "./-components/columns";

export const Route = createFileRoute("/_authenticated/_dashboard/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isPending, data } = useQuery(getAllUsersQueryOptions);

  return (
    <div className="border-y">
      <DataTable columns={columns} isPending={isPending} data={data} />
    </div>
  );
}
