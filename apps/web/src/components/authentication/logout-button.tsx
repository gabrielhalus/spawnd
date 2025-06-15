import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { fetchAuthenticated } from "@/lib/api";

type Variant = "button" | "dropdown";

type CommonProps = {
  variant?: Variant;
  className?: string;
};

export function LogoutButton({ variant = "button", className }: CommonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleLogout() {
    const res = await fetchAuthenticated("/api/auth/logout", { method: "POST" });

    const json = await res.json();

    if (json.success) {
      localStorage.removeItem("accessToken");
      queryClient.removeQueries({ queryKey: ["get-current-user"] });
      navigate({ to: "/login" });
    }
  }

  const content = (
    <>
      <LogOut />
      Sign out
    </>
  );

  if (variant === "dropdown") {
    return (
      <DropdownMenuItem onClick={handleLogout} className={className}>
        {content}
      </DropdownMenuItem>
    );
  }

  return (
    <Button onClick={handleLogout} className={className}>
      {content}
    </Button>
  );
}
