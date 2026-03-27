import { Button } from "@/components/ui/button";
import { Search, ShoppingBag } from "lucide-react";

export const NavActions = ({ count = 0 }) => (
    <div className="flex items-center gap-1">
        <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-primary rounded-none border-none bg-transparent hover:bg-transparent transition-colors shadow-none focus-visible:ring-0"
        >
            <Search className="h-5 w-5" />
        </Button>
        <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-muted-foreground hover:text-primary rounded-none border-none bg-transparent hover:bg-transparent transition-colors shadow-none focus-visible:ring-0"
        >
            <ShoppingBag className="h-5 w-5" />
            {/* El badge ahora es cuadrado para seguir tu estética industrial */}
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center bg-primary text-[9px] font-black text-primary-foreground shadow-lg shadow-primary/20">
                {count}
            </span>
        </Button>
    </div>
);