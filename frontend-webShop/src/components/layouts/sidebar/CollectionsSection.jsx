import { Link } from "react-router-dom";
import { LayoutGrid, ChevronRight, Tag } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export const CollectionsSection = ({ categories, locationPath, onNavigate }) => (
  <SidebarGroup>
    <SidebarGroupLabel className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/50 px-6 mb-4 group-data-[collapsible=icon]:hidden">
      Collections
    </SidebarGroupLabel>
    <SidebarMenu className="px-3 group-data-[collapsible=icon]:px-0 gap-2">
      {categories.map((category) => (
        <Collapsible key={category.id} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={category.name} className="h-14 w-full">
                <LayoutGrid className="size-6 text-primary shrink-0" />
                <span className="ml-4 font-black uppercase tracking-widest group-data-[collapsible=icon]:hidden text-[13px] truncate">
                  {category.name}
                </span>
                <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden text-primary" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
              <SidebarMenuSub className="ml-9 border-l-2 border-primary/20 pl-4 my-2 flex flex-col gap-3">
                {category.displayChildren.map((sub, index) => (
                  <SidebarMenuSubItem key={`${category.id}-${index}`}>
                    <Link 
                      to={`/category/${sub.slug}`} 
                      onClick={onNavigate} 
                      className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 hover:text-primary ${
                        locationPath.includes(sub.slug) ? 'text-primary' : 'text-foreground/60'
                      }`}
                    >
                      <Tag className="size-3 opacity-50" />
                      <span>{sub.isMain ? `All ${sub.name}` : sub.name}</span>
                    </Link>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  </SidebarGroup>
);