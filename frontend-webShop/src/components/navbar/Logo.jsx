import { Link } from "react-router-dom";

export const Logo = () => (
    <Link to="/" className="flex items-center gap-2 group">
        <h1 className="text-2xl font-black tracking-tighter text-primary uppercase italic transition-transform group-hover:scale-105">
            PIBEs <span className="font-light not-italic text-foreground">SHOP</span>
        </h1>
    </Link>
);