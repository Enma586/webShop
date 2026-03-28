import { Link } from "react-router-dom";
import { MapPin, Box, User, ReceiptText } from "lucide-react";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

export const CustomerSection = ({ onNavigate }) => {
  const customerItems = [
    { to: "/customer/addresses", icon: MapPin, label: "Shipping Nodes" },
    { to: "/customer/orders", icon: Box, label: "Order Manifest" },
    { to: "/customer/invoices", icon: ReceiptText, label: "Invoices" },
  ];

  return (
    <SidebarGroup className="mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
      <SidebarGroupLabel className="text-[11px] font-black uppercase tracking-[0.4em] text-primary px-6 mb-4 group-data-[collapsible=icon]:hidden">
        User Terminal
      </SidebarGroupLabel>
      <SidebarMenu className="px-3 group-data-[collapsible=icon]:px-0 gap-2">
        {customerItems.map((item) => (
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