import { Link } from "react-router-dom";
import { LayoutGrid, ChevronDown, ChevronRight, Tag } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

export const CollectionsSection = ({ categories, locationPath, onNavigate }) => (
  <Collapsible className="group/collapsible-main">
    <SidebarGroup className="animate-in fade-in slide-in-from-left-4 duration-1000 group-data-[collapsible=icon]:p-0">
      <SidebarGroupLabel asChild className="group-data-[collapsible=icon]:hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-foreground/50 px-6 mb-2 hover:bg-primary/5 py-4 transition-colors">
          Collections
          <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible-main:rotate-180" size={14} />
        </CollapsibleTrigger>
      </SidebarGroupLabel>

      <CollapsibleContent>
        <SidebarGroupContent>
          <SidebarMenu className="px-3 group-data-[collapsible=icon]:px-0 gap-2">
            {categories.map((category) => (
              <Collapsible key={category.id} className="group/collapsible-item">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={category.name} className="h-12 w-full group-data-[collapsible=icon]:justify-center">
                      <LayoutGrid className="size-5 text-primary shrink-0" />
                      <span className="ml-4 font-black uppercase tracking-widest group-data-[collapsible=icon]:hidden text-[11px] truncate">
                        {category.name}
                      </span>
                      <ChevronRight className="ml-auto w-3 h-3 transition-transform duration-200 group-data-[state=open]/collapsible-item:rotate-90 group-data-[collapsible=icon]:hidden text-primary" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSub className="ml-7 border-l-2 border-primary/20 pl-4 my-2 flex flex-col gap-3">
                      {category.displayChildren.map((sub, index) => (
                        <SidebarMenuSubItem key={`${category.id}-${index}`}>
                          <Link 
                            to={`/category/${sub.slug}`} 
                            onClick={onNavigate} 
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 hover:text-primary ${
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
        </SidebarGroupContent>
      </CollapsibleContent>
    </SidebarGroup>
  </Collapsible>
);