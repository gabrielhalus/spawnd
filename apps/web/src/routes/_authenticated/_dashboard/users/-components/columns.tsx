import type { UserProfile } from "@spawnd/shared/schemas/users";
import type { ColumnDef } from "@tanstack/react-table";

import { Link } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarFallback } from "@/helpers/generate-avatar-fallback";

import { RowActions } from "./row-actions";

export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      const avatarFallback = !user.avatar ? generateAvatarFallback(user.name) : undefined;

      return (
        <Link to="/users/$user-id" params={{ "user-id": user.id }} className="flex items-center gap-2">
          {/* TODO: make this a component */}
          <Avatar className="h-8 w-8 overflow-visible">
            {user.avatar && (
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="object-cover h-8 w-8 rounded-full"
                style={{ objectFit: "cover" }}
              />
            )}
            <AvatarFallback className="h-8 w-8 rounded-full">{avatarFallback}</AvatarFallback>
          </Avatar>
          {user.name}
        </Link>
      );
    },
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
