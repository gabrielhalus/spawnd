import type { UserProfile } from "@spawnd/shared/schemas/users";
import type { ColumnDef } from "@tanstack/react-table";

import { RowActions } from "./row-actions";

export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const timestamp = Number(row.getValue("createdAt"));
      const createdAt = new Date(timestamp);
      return Number.isNaN(createdAt.getTime()) ? <>Invalid date</> : <>{createdAt.toLocaleDateString()}</>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
