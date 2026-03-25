import { Link } from "react-router-dom";
import { SidebarHeader } from "@/components/ui/sidebar";

export const SidebarBrand = ({ onNavigate }) => (
  <SidebarHeader className="h-100px border-b border-border/40 flex items-center px-6 bg-background group-data-[collapsible=icon]:justify-center">
    <Link to="/" onClick={onNavigate} className="flex flex-col group-data-[collapsible=icon]:hidden">
      <span className="font-black italic text-primary uppercase text-2xl md:text-3xl tracking-tighter truncate leading-none">
        PB<br/><span className="text-foreground">SHOP</span>
      </span>
    </Link>
  </SidebarHeader>
);