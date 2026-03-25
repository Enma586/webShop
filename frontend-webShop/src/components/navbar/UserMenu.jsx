import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, ShieldCheck } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = ({ user, logout }) => {
    
    // Función para manejar el cierre de sesión de forma limpia
    const handleLogout = () => {
        // Aquí puedes añadir un console.log para debuggear si el token se va
        console.log("Terminating Node Session...");
        logout(); // Esta es la función que viene del AuthContext
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-none border border-primary/20 p-0 hover:border-primary transition-all">
                    <Avatar className="h-full w-full rounded-none">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary/5 text-primary font-black uppercase text-xs rounded-none">
                            {user?.username?.substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            
            {/* Ajustamos el diseño a bordes rectos (Boutique Style) */}
            <DropdownMenuContent className="w-64 mt-2 rounded-none border-primary/30 bg-card shadow-2xl p-2" align="end">
                <DropdownMenuLabel className="flex flex-col py-4 px-3 border-b border-primary/10 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary italic mb-1">Authenticated Node</span>
                    <span className="text-sm font-black text-foreground truncate uppercase tracking-tighter italic">
                        {user?.name || user?.username}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                        <ShieldCheck size={10} className="text-primary" />
                        <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest italic opacity-60">
                            Access Level: {user?.role || 'Member'}
                        </span>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuItem className="py-3 px-3 cursor-pointer focus:bg-primary/10 rounded-none transition-colors group">
                    <User className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary" /> 
                    <span className="text-[10px] font-black uppercase tracking-widest">Profile Node</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="py-3 px-3 cursor-pointer focus:bg-primary/10 rounded-none transition-colors group">
                    <Settings className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary" /> 
                    <span className="text-[10px] font-black uppercase tracking-widest">System Config</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-primary/10 my-2" />
                
                {/* Botón de Salida con la función corregida */}
                <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="py-3 px-3 cursor-pointer text-destructive focus:bg-destructive/10 rounded-none font-black uppercase text-[10px] tracking-[0.3em] transition-all"
                >
                    <LogOut className="mr-3 h-4 w-4" /> 
                    Terminate Session
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};