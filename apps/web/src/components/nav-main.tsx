import type { LucideIcon } from "lucide-react";

import { Link, useLocation } from "@tanstack/react-router";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavMain({ items }: { items: { title: string; icon: LucideIcon; href: string }[] }) {
  const location = useLocation();
  const isActive = (href: string) => location.pathname === href;

  return (
    <SidebarMenu>
      {items.map(item => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive(item.href)}>
            <Link to={item.href}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
