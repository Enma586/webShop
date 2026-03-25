import { Link } from "react-router-dom";

export const GuestNav = () => (
    <div className="hidden lg:flex items-center gap-8">
        {["Home", "Catalog", "About"].map((item) => (
            <Link 
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
                className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
                {item}
            </Link>
        ))}
    </div>
);