import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useCategory } from "@/context/CategoryContext";
import { useAuth } from "@/context/AuthContext";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { SidebarBrand } from "./SidebarBrand";
import { AdminSection } from "./AdminSection";
import { CollectionsSection } from "./CollectionsSection";
import { CustomerSection } from "./CustomerSection";

export function AppSidebar() {
  const { categories, getCategories } = useCategory();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
  }, []);

  const organizedCategories = useMemo(() => {
    const data = Array.isArray(categories) ? categories : [];
    
    // Filtramos categorías vacías o corruptas para evitar espacios en blanco
    const validData = data.filter(cat => cat?.name && cat.name.trim() !== "");
    if (validData.length === 0) return [];
    
    const parents = validData.filter(cat => !cat.parent_id);
    
    return parents.map(parent => {
      const children = validData.filter(child => child.parent_id === parent.id);
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
      
      <SidebarContent className="overflow-y-auto overflow-x-hidden custom-scrollbar bg-background pt-2">
        {/* Bloque de Administración: Se expande/colapsa internamente */}
        {isAuthenticated && isAdmin && (
          <AdminSection onNavigate={handleNavigation} />
        )}

        {/* Bloque de Usuario: Se expande/colapsa internamente */}
        {isAuthenticated && (
          <CustomerSection onNavigate={handleNavigation} />
        )}
        
        {/* Bloque de Colecciones: Se expande/colapsa internamente */}
        <CollectionsSection 
          categories={organizedCategories} 
          locationPath={location.pathname} 
          onNavigate={handleNavigation} 
        />
      </SidebarContent>
    </Sidebar>
  );
}