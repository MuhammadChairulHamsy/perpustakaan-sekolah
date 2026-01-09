import * as React from "react";
import { Link } from "react-router-dom";
import {
  Warehouse,
  LayoutDashboard,
  Thermometer,
  Droplets,
  Video,
  Package,
  HeartPulse,
  Bell,
  FileText,
  Settings,
  Camera,
  File,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
// import { NavUser } from "@/components/nav-user";
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
      title: "Suhu Kandang",
      url: "/SuhuKandang",
      icon: Thermometer,
    },
    {
      title: "Kelembapan",
      url: "/monitoringKelembapan",
      icon: Droplets,
    },
    {
      title: "Live Kamera",
      url: "/livekamera",
      icon: Video,
    },
    {
      title: "Stok Kambing",
      url: "/stokkambing",
      icon: Package,
    },
    {
      title: "Kondisi Kambing",
      url: "/kondisikambing",
      icon: HeartPulse,
    },
    {
      title: "Notifikasi",
      url: "/notifikasi",
      icon: Bell,
    },
    {
      title: "Laporan",
      url: "/laporan",
      icon: FileText,
    },
    {
      title: "pengaturan",
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-8 w-8 rounded-xl flex items-center justify-center shrink-0">
                  <Warehouse className="text-primary-foreground" size={22} />
                  </div>
                  <div className="flex flex-col">
                    {" "}
                    <h1 className="font-bold text-sidebar-foreground text-lg leading-tight truncate">
                      Hikma Aqiqah
                    </h1>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      Monitoring System
                    </p>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
    </Sidebar>
  );
}