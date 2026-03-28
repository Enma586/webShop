import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, ShieldCheck } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileEditModal from "@/components/profile/ProfileEditModal";

export const UserMenu = ({ user, logout }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="relative h-10 w-10 p-0 border-none outline-none ring-0 ring-offset-0 shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-95 transition-all"
                    >
                        <Avatar className="h-9 w-9 border-none outline-none ring-0 shadow-none">
                            <AvatarImage src={user?.avatar} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-[10px] border-none flex items-center justify-center">
                                {user?.username?.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                    className="w-64 mt-2 rounded-none border-primary/30 bg-card shadow-2xl p-2 outline-none ring-0" 
                    align="end"
                >
                    <DropdownMenuLabel className="flex flex-col py-4 px-3 border-b border-primary/10 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary italic mb-1 text-center">Authenticated Node</span>
                        <span className="text-sm font-black text-foreground truncate uppercase tracking-tighter italic text-center">
                            {user?.name || user?.username}
                        </span>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <ShieldCheck size={10} className="text-primary" />
                            <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest italic opacity-60">
                                Access: {user?.role || 'Member'}
                            </span>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuItem 
                        onClick={() => setIsProfileOpen(true)}
                        className="py-3 px-3 cursor-pointer focus:bg-primary/10 rounded-none border-none outline-none transition-colors group"
                    >
                        <User className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary" /> 
                        <span className="text-[10px] font-black uppercase tracking-widest">Profile Node</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-primary/10 my-2" />
                    
                    <DropdownMenuItem 
                        onClick={() => logout()} 
                        className="py-3 px-3 cursor-pointer text-destructive focus:bg-destructive/10 rounded-none font-black uppercase text-[10px] tracking-[0.3em] border-none outline-none transition-all"
                    >
                        <LogOut className="mr-3 h-4 w-4" /> 
                        Terminate Session
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProfileEditModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
        </>
    );
};