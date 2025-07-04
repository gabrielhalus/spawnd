import { Link } from "@tanstack/react-router";
import { Box, Calendar, DatabaseBackup, Home, Server, Users } from "lucide-react";
import React from "react";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      icon: Home,
      href: "/",
    },
    {
      title: "Servers",
      icon: Server,
      href: "/servers",
    },
    {
      title: "Schedules",
      icon: Calendar,
      href: "/schedules",
    },
    {
      title: "Backups",
      icon: DatabaseBackup,
      href: "/backups",
    },
    {
      title: "Users",
      icon: Users,
      href: "/users",
    },
  ],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Box className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Spawnd.</span>
                  <span className="truncate text-xs">Minecraft Server Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
