import { Link } from "react-router-dom";
import { User, Package, PlusCircle, BookCheck, ChartNoAxesCombined, Logs, ChevronDown } from "lucide-react";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const AdminSection = ({ onNavigate }) => {
  const adminItems = [
    { to: "/admin/users", icon: User, label: "Users" },
    { to: "/admin/products", icon: Package, label: "Inventory" },
    { to: "/admin/categories", icon: PlusCircle, label: "Category" },
    { to: "/admin/orders", icon: BookCheck, label: "Orders" },
    { to: "/admin/dashboard", icon: ChartNoAxesCombined, label: "Account" },
    { to: "/admin/logs", icon: Logs, label: "Logs" }
  ];

  return (
    <Collapsible className="group/collapsible">
      <SidebarGroup className="animate-in fade-in slide-in-from-left-4 duration-500 group-data-[collapsible=icon]:p-0">
        <SidebarGroupLabel asChild className="group-data-[collapsible=icon]:hidden">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-primary px-6 mb-2 hover:bg-primary/5 py-4 transition-colors">
            Control Protocol
            <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" size={14} />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 group-data-[collapsible=icon]:px-0 gap-2">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={item.label} className="h-12 group-data-[collapsible=icon]:justify-center">
                    <Link to={item.to} onClick={onNavigate} className="flex items-center w-full px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                      <item.icon className="size-5 text-primary shrink-0" />
                      <span className="ml-4 font-black uppercase tracking-widest text-[11px] group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};