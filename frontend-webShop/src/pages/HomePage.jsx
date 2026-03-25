import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Star, Sparkles, Shirt, Zap, Fingerprint, Activity, Globe, Shield, ArrowRight } from "lucide-react";

export default function HomePage() {
    const navigate = useNavigate();

    const goToCategory = (slug) => {
        navigate(`/category/${slug}`);
    };

    return (
        <div className="flex flex-col w-full bg-background min-h-screen overflow-x-hidden">
            
            {/* HERO SECTION */}
            <section className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center py-16 md:py-24 px-6">
                <div className="z-10 space-y-6">
                    <span className="inline-flex items-center gap-2 py-1 px-3 border border-primary/30 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">
                        <Fingerprint size={12} /> Unique Pieces Only
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight text-foreground">
                        Discover Your <span className="text-primary not-italic tracking-normal drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">Identity</span>
                    </h1>
                    <p className="max-w-xs mx-auto text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-80 italic">
                        La arquitectura de tu presencia.
                    </p>
                    <Button asChild size="sm" className="bg-primary text-primary-foreground font-black px-10 rounded-none h-12 text-[10px] tracking-[0.3em] hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                        <Link to="/category/all">ENTER THE DROP</Link>
                    </Button>
                </div>
            </section>

            {/* CATEGORY GRID SECTION */}
            <section className="w-full max-w-7xl mx-auto px-6 pb-24"> {/* Más espacio abajo */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 auto-rows-fr">
       
                    {/* NEW DROP - THE JOYITA */}
                    <div className="col-span-2 row-span-2 group relative overflow-hidden border border-primary/40 bg-card/30 p-8 flex flex-col justify-end transition-all duration-500 hover:border-primary cursor-pointer shadow-sm hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]"
                         onClick={() => goToCategory('new-drop')}>
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
                            <Shirt size={180} strokeWidth={1} className="text-primary" />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-foreground mb-1">New Drop</h3>
                            <p className="text-primary font-bold uppercase text-[9px] tracking-[0.5em] mb-6">Selected Units</p>
                            
                            {/* EL BOTÓN JOYÍSIMA */}
                            <div className="flex items-center gap-2 group/btn font-black text-[10px] uppercase tracking-[0.3em] text-foreground">
                                <span className="border-b-2 border-primary pb-1 group-hover:pr-4 transition-all duration-300">Explore Collection</span>
                                <ArrowRight size={14} className="text-primary transform group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                        </div>
                    </div>

                    {/* ESSENTIALS */}
                    <div className="col-span-2 group relative overflow-hidden border border-border/50 bg-card/30 p-6 flex items-center justify-between transition-all hover:border-primary/50 cursor-pointer"
                         onClick={() => goToCategory('essentials')}>
                        <div className="space-y-1 text-foreground">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">Essentials</h3>
                            <p className="text-[9px] text-muted-foreground uppercase font-medium tracking-widest italic opacity-60">Timeless Pieces</p>
                        </div>
                        <ShoppingBag className="text-primary/30 group-hover:text-primary transition-colors" size={24} />
                    </div>

                    {/* EXTRAS */}
                    <div className="group relative overflow-hidden border border-border/50 bg-card/30 p-6 flex flex-col justify-center items-center text-center transition-all hover:border-primary/50 cursor-pointer"
                         onClick={() => goToCategory('extras')}>
                        <Star className="text-primary/30 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <h3 className="text-[10px] font-black uppercase tracking-tighter text-foreground">Extras</h3>
                    </div>

                    {/* TREND */}
                    <div className="group relative overflow-hidden border border-border/50 bg-card/30 p-6 flex flex-col justify-center items-center text-center transition-all hover:border-primary/50 cursor-pointer"
                         onClick={() => goToCategory('trend')}>
                        <Sparkles className="text-primary/30 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <h3 className="text-[10px] font-black uppercase tracking-tighter text-foreground">Trend</h3>
                    </div>

                    {/* EXPRESS SHIP */}
                    <div className="col-span-4 group relative overflow-hidden border border-primary/20 bg-primary/2 p-6 flex items-center gap-6 transition-all hover:bg-primary/4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Zap size={20} className="text-primary animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Worldwide Express Shipping</p>
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.3em] italic">Priority Node: El Salvador</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATUS FOOTER SECTION - MÁS ESPACIADO Y LIMPIO */}
            <div className="w-full border-t border-border/40 bg-card/10 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {[
                            { icon: Activity, label: "System Status", val: "Operational", color: "text-emerald-500" },
                            { icon: Globe, label: "Deployment", val: "Sonsonate, SV", color: "text-primary" },
                            { icon: Shield, label: "Security", val: "Encrypted Drop", color: "text-primary" },
                            { icon: Fingerprint, label: "Identity", val: "Verified Store", color: "text-primary" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left group">
                                <div className="p-2 border border-primary/10 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                    <item.icon size={16} className={item.color} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{item.label}</p>
                                    <p className="text-[12px] font-bold uppercase italic text-foreground tracking-tight">{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FINAL COPYRIGHT FOOTER */}
            <footer className="w-full py-12 border-t border-border/40 bg-background flex flex-col items-center justify-center gap-6 px-6 text-center">
                <div className="flex items-center gap-8 opacity-40">
                    <div className="w-16 h-1px bg-foreground"></div>
                    <span className="font-black italic text-[12px] tracking-tighter uppercase">Pibes Shop</span>
                    <div className="w-16 h-1px bg-foreground"></div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-40">
                    © 2026 / ENGINEERING TEXTILE BOUTIQUE / ALL RIGHTS RESERVED
                </p>
            </footer>
        </div>
    );
}