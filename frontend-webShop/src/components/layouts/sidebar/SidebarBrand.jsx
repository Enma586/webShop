import { Link } from "react-router-dom";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Terminal } from "lucide-react";

export const SidebarBrand = ({ onNavigate }) => (
  <SidebarHeader className="h-20 flex items-center justify-center border-b border-border/5 bg-background p-0">
    <Link 
      to="/" 
      onClick={onNavigate} 
      className="flex items-center justify-center w-full h-full transition-all hover:opacity-80"
    >
      <div className="flex items-center justify-center w-10 h-10 border border-primary/20 bg-primary/5 transition-all">
        <Terminal className="w-5 h-5 text-primary stroke-[3px]" />
      </div>
    </Link>
  </SidebarHeader>
);