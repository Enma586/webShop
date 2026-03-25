import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useNavbar } from "@/hooks/useNavbar";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";

// Importación de los componentes que creamos arriba
import { SidebarBrand } from "./SidebarBrand";
import { AdminSection } from "./AdminSection";
import { CollectionsSection } from "./CollectionsSection";

export function AppSidebar() {
  const { categories } = useCategories();
  const { isAuthenticated, user } = useNavbar();
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const isAdmin = user?.role === 'admin';

  // Lógica para organizar padres e hijos
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
        {/* Sección Admin se muestra solo si es Admin */}
        {isAuthenticated && isAdmin && (
          <AdminSection onNavigate={handleNavigation} />
        )}
        
        {/* Sección de Colecciones */}
        <CollectionsSection 
          categories={organizedCategories} 
          locationPath={location.pathname} 
          onNavigate={handleNavigation} 
        />
      </SidebarContent>
    </Sidebar>
  );
}