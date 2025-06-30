import type { UserProfile } from "@spawnd/shared/schemas/users";
import type { Row } from "@tanstack/react-table";

import { Copy, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TimeoutButton } from "@/components/ui/timeout-button";
import { fetchAuthenticated } from "@/lib/api";
import { toast } from "sonner";

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
          onClick={() => navigator.clipboard.writeText(user.id)}
        >
          <Copy className="h-4 w-4" />
          Copy user ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <TimeoutButton
          variant="destructive"
          size="sm"
          className="rounded-sm"
          noExpansion
          timeout={2000}
          onClick={async () => {
            const res = await fetchAuthenticated(`/api/users/${user.id}`, {
              method: "DELETE",
            });
            res.ok ? toast.success("User deleted") : toast.error("Failed to delete user");
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete user
        </TimeoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
