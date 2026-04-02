import { Link } from "react-router-dom";
import { MapPin, Box, ChevronDown } from "lucide-react";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const CustomerSection = ({ onNavigate }) => {
  const customerItems = [
    { to: "/customer/addresses", icon: MapPin, label: "Shipping Nodes" },
    { to: "/customer/orders", icon: Box, label: "Order Manifest" },
  ];

  return (
    <Collapsible className="group/collapsible">
      <SidebarGroup className="animate-in fade-in slide-in-from-left-4 duration-700 group-data-[collapsible=icon]:p-0">
        <SidebarGroupLabel asChild className="group-data-[collapsible=icon]:hidden">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-primary px-6 mb-2 hover:bg-primary/5 py-4 transition-colors">
            User Terminal
            <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" size={14} />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarGroupContent>
            {/* Ajuste de padding lateral para centrado en modo icono */}
            <SidebarMenu className="px-3 group-data-[collapsible=icon]:px-0 gap-2">
              {customerItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={item.label} className="h-12 group-data-[collapsible=icon]:justify-center">
                    <Link to={item.to} onClick={onNavigate} className="flex items-center w-full px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                      <item.icon className="size-5 text-primary shrink-0" />
                      {/* Ocultar margen y texto al colapsar */}
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