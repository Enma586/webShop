import { Button } from "@/components/ui/button";
import { Search, ShoppingBag } from "lucide-react";

export const NavActions = () => (
    <div className="flex items-center gap-1 md:gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground shadow-lg shadow-primary/30">
                0
            </span>
        </Button>
    </div>
);