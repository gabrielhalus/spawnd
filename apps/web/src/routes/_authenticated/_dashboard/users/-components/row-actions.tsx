import type { UserProfile } from "@spawnd/shared/schemas/users";
import type { Row } from "@tanstack/react-table";

import { Copy, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserDeleteButton } from "./user-delete-button";

export function RowActions({ row }: { row: Row<UserProfile> }) {
  const user = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(user.id);
            toast.success("User ID copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4" />
          Copy user ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <UserDeleteButton id={user.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
