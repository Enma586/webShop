import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const NavActions = () => {
    const { cartCount, openCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleOpenCart = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        openCart();
    };

    return (
        <div className="flex items-center gap-1 md:gap-2">
            <Button 
                onClick={handleOpenCart}
                variant="ghost" 
                size="icon" 
                className="relative"
            >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {cartCount}
                    </span>
                )}
            </Button>
        </div>
    );
};