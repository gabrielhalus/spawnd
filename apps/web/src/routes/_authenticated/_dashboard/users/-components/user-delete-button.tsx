import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { TimeoutButton } from "@/components/ui/timeout-button";
import { deleteUser } from "@/lib/api/user";
import { getAllUsersQueryOptions } from "@/lib/queries/user";

export function UserDeleteButton({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteUser,
    onError: () => {
      toast.error("Failed to delete user");
    },
    onSuccess: () => {
      toast.success("Successfully deleted user");

      queryClient.setQueryData(
        getAllUsersQueryOptions.queryKey,
        (existingUsers) => {
          if (!existingUsers)
            return [];
          return existingUsers.filter(user => user.id !== id);
        },
      );
    },
  });

  return (
    <TimeoutButton
      variant="destructive"
      size="sm"
      className="rounded-sm"
      noExpansion
      timeout={2000}
      onClick={() => mutation.mutate({ id })}
    >
      <Trash2 className="h-4 w-4" />
      Delete user
    </TimeoutButton>
  );
}
