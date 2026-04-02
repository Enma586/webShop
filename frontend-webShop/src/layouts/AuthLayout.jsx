import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import loginBg from "@/assets/login-bg.png";

export const AuthLayout = ({ children, title, subtitle, bannerIcon: Icon, bannerTitle, bannerText }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-8 font-sans antialiased">
            <div className="bg-card w-full max-w-6xl overflow-hidden shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)] flex flex-col lg:flex-row min-h-162.5 border border-primary/30">
                
                {/* LADO IZQUIERDO: FORMULARIO */}
                <div className="w-full lg:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-card border-r border-primary/10">
                    <div className="mb-10 text-center lg:text-left space-y-4">
                        <Button 
                            onClick={() => navigate("/")} 
                            variant="ghost" 
                            className="text-[9px] font-black uppercase tracking-[0.3em] gap-2 p-0 h-auto hover:bg-transparent hover:text-primary transition-colors"
                        >
                            <ChevronLeft size={12} /> Return to Store
                        </Button>
                        
                        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                            PIBEs <span className="text-primary not-italic">SHOP</span>
                        </h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] italic opacity-70">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </div>

                {/* LADO DERECHO: VISUAL (REUTILIZABLE) */}
                <div className="hidden lg:flex lg:w-[55%] relative bg-card overflow-hidden">
                    <img
                        src={loginBg}
                        alt="System Identity"
                        className="w-full h-full object-cover grayscale-[0.5] contrast-125"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/30 via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12">
                        <div className="bg-card/40 backdrop-blur-md p-6 border border-primary/20 inline-block shadow-2xl">
                            <span className="flex items-center gap-2 text-primary mb-2">
                                <Icon size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{bannerTitle}</span>
                            </span>
                            <p className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-relaxed">
                                {bannerText}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};