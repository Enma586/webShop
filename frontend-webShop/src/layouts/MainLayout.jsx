import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/layouts/sidebar/Sidebar"; 
import { useNavbar } from "@/hooks/useNavbar";
import { SidebarTrigger, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"; 
import { NavActions } from "@/components/navbar/NavActions";
import { UserMenu } from "@/components/navbar/UserMenu";
import { ThemeToggle } from "@/components/Shared/DarkMode/ThemeToggle"; // Importar el toggle
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/navbar/SearchBar";
import { useEffect } from "react";

export default function MainLayout() {
  const { isAuthenticated, user, logout, cartCount } = useNavbar();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isTryingAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAuthenticated && !isAdmin && isTryingAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isAdmin, isTryingAdmin, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-background">
        <header className="h-20 w-full border-b border-border/40 bg-background flex items-center justify-between px-10 z-50 sticky top-0">
          <Link to="/" className="font-black italic text-primary uppercase text-3xl tracking-tighter hover:opacity-80 transition-opacity">
            PIBES SHOP
          </Link>
          <div className="flex items-center gap-6">
            <SearchBar className="max-w-sm w-full" />
            <ThemeToggle />
            <Button onClick={() => navigate("/login")} variant="ghost" className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground h-12">
              Login
            </Button>
            <Button asChild className="bg-primary text-primary-foreground text-[12px] font-black uppercase tracking-[0.3em] rounded-none px-10 h-12">
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 w-full bg-background"><Outlet /></main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-background m-0! p-0! rounded-none! border-none shadow-none outline-none">
          <header className="flex h-17.5 shrink-0 items-center justify-between border-b border-border/40 bg-background px-8 sticky top-0 z-30 w-full">
            <div className="flex items-center gap-0">
              <SidebarTrigger className="h-14 w-14 text-primary hover:bg-primary/5 transition-all rounded-none [&_svg]:size-8" />
              <div className="h-6 w-1px bg-border/40 mx-4" />
              <div className="flex flex-col">
                <span className="text-[20px] font-black uppercase tracking-[0.4em] text-foreground leading-none">
                  Pibes Shop <span className="text-primary italic">{isAdmin ? 'Terminal' : ''}</span>
                </span>
                {!isAdmin && (
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    Official Member Access
                  </span>
                )}
              </div>
            </div>

            <SearchBar className="max-w-md w-full mx-8" />

            <div className="flex items-center gap-4">
              <NavActions count={cartCount} />
              <div className="h-8 w-1px bg-border/40 mx-2" />
              <ThemeToggle /> {/* Toggle en vista autenticada */}
              <div className="h-8 w-1px bg-border/40 mx-2" />
              <UserMenu user={user} logout={logout} />
            </div>
          </header>

          <main className="flex-1 w-full bg-background overflow-y-auto custom-scrollbar">
             <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}