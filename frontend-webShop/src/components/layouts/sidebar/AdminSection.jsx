import { Link } from "react-router-dom";
import { LayoutDashboard, Package, PlusCircle, BookCheck, ChartNoAxesCombined, Logs} from "lucide-react";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

export const AdminSection = ({ onNavigate }) => {
  const adminItems = [
    { to: "/admin/users", icon: LayoutDashboard, label: "Users" },
    { to: "/admin/products", icon: Package, label: "Inventory" },
    { to: "/admin/categories", icon: PlusCircle, label: "Category" },
    { to: "/admin/orders", icon: BookCheck, label: "Orders" },
    {to : "/admin/dashboard", icon: ChartNoAxesCombined, label: "Account"},
    {to : "/admin/logs", icon: Logs, label: "Logs"}
    
    
  ];

  return (
    <SidebarGroup className="mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <SidebarGroupLabel className="text-[11px] font-black uppercase tracking-[0.4em] text-primary px-6 mb-4 group-data-[collapsible=icon]:hidden">
        Control Protocol
      </SidebarGroupLabel>
      <SidebarMenu className="px-3 group-data-[collapsible=icon]:px-0 gap-2">
        {adminItems.map((item) => (
          <SidebarMenuItem key={item.to}>
            <SidebarMenuButton asChild tooltip={item.label} className="h-14">
              <Link to={item.to} onClick={onNavigate} className="flex items-center w-full px-3">
                <item.icon className="size-6 text-primary shrink-0" />
                <span className="ml-4 font-black uppercase tracking-widest group-data-[collapsible=icon]:hidden text-[13px]">
                  {item.label}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};