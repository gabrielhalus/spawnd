import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

type Variant = "button" | "dropdown";

type CommonProps = {
  variant?: Variant;
  className?: string;
}

export function LogoutButton({ variant = "button", className }: CommonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleLogout() {
    const res = await fetch("/api/auth/logout", { method: "POST" });

    const responseJson = await res.json();

    if (responseJson.success) {
      localStorage.removeItem("accessToken");
      queryClient.removeQueries({ queryKey: ['get-current-user'] });
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
    )
  }

  return (
    <Button onClick={handleLogout} className={className}>
      {content}
    </Button>
  )
}