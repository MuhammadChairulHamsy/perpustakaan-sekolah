import { Link, useLocation } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export const MenuItem = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.url;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={`transition-all duration-200 hover:bg-primary/10 ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-sidebar-foreground/70"
        }`}
      >
        <Link to={item.url} className="flex items-center gap-3">
          <item.icon
            className={`${isActive ? "text-primary" : "hover:text-primary"} transition-colors`}
            size={18}
          />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
