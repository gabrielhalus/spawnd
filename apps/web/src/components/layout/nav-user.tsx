import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

import { LogoutButton } from "@/components/layout/logout-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { generateAvatarFallback } from "@/helpers/generate-avatar-fallback";
import { useAuth } from "@/hooks/use-auth";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, isLoading, isError } = useAuth();

  if (isError) {
    return "not logged in";
  }

  if (isLoading) {
    return "pending";
  }

  const avatarFallback = !user.avatar ? generateAvatarFallback(user.name) : undefined;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg overflow-visible">
                {user.avatar && (
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover h-8 w-8 rounded-lg"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar && (
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover h-8 w-8 rounded-lg"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/profile">
                <DropdownMenuItem>
                  <UserRound />
                  Your profile
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <LogoutButton variant="dropdown" />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
