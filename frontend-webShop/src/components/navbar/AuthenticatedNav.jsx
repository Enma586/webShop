import { Link } from "react-router-dom";
import { LayoutDashboard, Package, Heart, ShoppingBag } from "lucide-react";

export const AuthenticatedNav = ({ role }) => {
    const links = role === 'admin' 
        ? [
            { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Inventory', to: '/admin/inventory', icon: Package }
          ]
        : [
            { name: 'My Orders', to: '/orders', icon: ShoppingBag },
            { name: 'Favorites', to: '/favorites', icon: Heart }
          ];

    return (
        <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
                <Link 
                    key={link.to} 
                    to={link.to} 
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                </Link>
            ))}
        </div>
    );
};