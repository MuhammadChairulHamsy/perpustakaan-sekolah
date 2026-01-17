import * as React from "react";
import { Link } from "react-router-dom";
import {
  Library,
  LayoutDashboard,
  BookOpen,
  User,
  FileText,
  ChartBar,
  Settings,
  Camera,
  File,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Buku",
      url: "/buku",
      icon: BookOpen,
    },
    {
      title: "Siswa",
      url: "/siswa",
      icon: User,
    },
    {
      title: "Pinjaman",
      url: "/pinjaman",
      icon: FileText,
    },
    {
      title: "Laporan",
      url: "/laporan",
      icon: ChartBar,
    },
    {
      title: "Pengaturan",
      url: "/pengaturan",
      icon: Settings,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: Camera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: File,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-sidebar pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="bg-sidebar data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard" >
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-8 w-8 rounded-xl flex items-center justify-center shrink-0">
                  <Library className="text-primary-foreground" size={22} />
                  </div>
                  <div className="flex flex-col">
                    {" "}
                    <h1 className="font-bold text-sidebar-foreground text-lg leading-tight truncate">
                      Pusat Perpustakaan
                    </h1>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      Perpustakaan Sekolah
                    </p>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-sidebar">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}