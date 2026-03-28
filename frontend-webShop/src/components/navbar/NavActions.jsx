import { Button } from "@/components/ui/button";
import { Search, ShoppingBag } from "lucide-react";

export const NavActions = ({ count = 0 }) => (
    <div className="flex items-center gap-1 md:gap-2">
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-muted-foreground hover:text-primary border-none outline-none ring-0 shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus-visible:ring-0 transition-colors"
        >
            <Search className="h-5 w-5" />
        </Button>
        <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 text-muted-foreground hover:text-primary border-none outline-none ring-0 shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus-visible:ring-0 transition-colors"
        >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center bg-primary text-[9px] font-black text-primary-foreground shadow-lg shadow-primary/20">
                    {count}
                </span>
            )}
        </Button>
    </div>
);