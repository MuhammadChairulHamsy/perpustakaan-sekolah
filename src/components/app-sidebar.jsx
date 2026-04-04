import * as React from "react";
import { Link } from "react-router-dom";
import {
  Library,
  LayoutDashboard,
  BookOpen,
  BookImage,
  User,
  FileText,
  ChartBar,
  Wallet,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { MenuItem } from "./menu-item";
import { useAuth } from "../context/AuthContext";

export function AppSidebar({ ...props }) {
  const { user } = useAuth();

  const isStaff = ["Admin", "Pustakawan", "Asisten"].includes(user?.role);
  const navigationData = {
    main: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "E-Katalog",
        url: "/katalog",
        icon: BookImage,
      },
    ],
    management: [
      {
        title: "Koleksi Buku",
        url: "/buku",
        icon: BookOpen,
      },
      {
        title: "Data Siswa",
        url: "/siswa",
        icon: User,
      },
      isStaff
        ? {
            title: "Transaksi Pinjaman",
            url: "/kelola-pinjaman",
            icon: FileText,
          }
        : {
            title: "Transaksi Pinjaman",
            url: "/pinjaman-user",
            icon: FileText,
          },
      {
        title: "Keuangan & Denda",
        url: "/keuangan",
        icon: Wallet,
      },
    ],
    system: [
      {
        title: "Laporan Analitik",
        url: "/laporan",
        icon: ChartBar,
      },
      {
        title: "Pengaturan",
        url: "/pengaturan",
        icon: Settings,
      },
    ],
  };
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50"
      {...props}
    >
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className=" hover:bg-transparent"
            >
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="bg-primary shadow-lg shadow-primary/20 h-9 w-9 rounded-xl flex items-center justify-center shrink-0">
                  <Library className="text-primary-foreground" size={20} />
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="font-bold text-sidebar-foreground text-base leading-none">
                    Pusat Perpustakaan
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-medium text-slate-300">
                    Perpustakaan Sekolah
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/300 mb-2">
            Ringkasan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.main.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/300 mb-2 mt-2">
            Manajemen Operasional
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.management.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/300 mb-2">
            Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.system.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
