import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useNavbar } from "@/hooks/useNavbar";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";

import { SidebarBrand } from "./SidebarBrand";
import { AdminSection } from "./AdminSection";
import { CollectionsSection } from "./CollectionsSection";
import { CustomerSection } from "./CustomerSection";

export function AppSidebar() {
  const { categories } = useCategories();
  const { isAuthenticated, user } = useNavbar();
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const isAdmin = user?.role === 'admin';

  const organizedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    
    const parents = categories.filter(cat => cat.parent_id === null);
    
    return parents.map(parent => {
      const children = categories.filter(child => child.parent_id === parent.id);
      return {
        ...parent,
        displayChildren: children.length > 0 ? children : [{ ...parent, isMain: true }]
      };
    });
  }, [categories]);

  const handleNavigation = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-background transition-all duration-300">
      <SidebarBrand onNavigate={handleNavigation} />
      
      <SidebarContent className="overflow-y-auto overflow-x-hidden custom-scrollbar bg-background pt-6">
        
        {/* PROTOCOLO DE CONTROL: Solo para Administradores */}
        {isAuthenticated && isAdmin && (
          <AdminSection onNavigate={handleNavigation} />
        )}

        {/* TERMINAL DE USUARIO: Para cualquier usuario logueado */}
        {isAuthenticated && (
          <CustomerSection onNavigate={handleNavigation} />
        )}
        
        {/* CATÁLOGO DE ACTIVOS: Visible para todos */}
        <CollectionsSection 
          categories={organizedCategories} 
          locationPath={location.pathname} 
          onNavigate={handleNavigation} 
        />
        
      </SidebarContent>
    </Sidebar>
  );
}