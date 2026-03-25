import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Fingerprint, ChevronLeft } from "lucide-react";
import loginBg from "@/assets/login-bg.png";

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { signin, loading, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        await signin(data);
    });

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-8 font-sans antialiased transition-colors duration-500">
            
            {/* Contenedor Principal con Bordes Rectos y Verdes */}
            <div className="bg-card w-full max-w-6xl overflow-hidden shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)] flex flex-col lg:flex-row min-h-600px border border-primary/30">

                {/* --- SECCIÓN FORMULARIO (IZQUIERDA) --- */}
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
                            The Architecture of Identity / Access System
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* Separador Técnico */}
                        <div className="relative flex items-center py-2">
                            <div className="grow border-t border-primary/10"></div>
                            <span className="shrink mx-4 text-[9px] font-black text-primary uppercase tracking-[0.4em]">Authorization Required</span>
                            <div className="grow border-t border-primary/10"></div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-foreground uppercase tracking-widest ml-1">Username Node</Label>
                            <Input
                                {...register("username", { required: true })}
                                className="rounded-none border-primary/20 bg-primary/5 h-12 focus-visible:ring-1 focus-visible:ring-primary transition-all placeholder:text-muted-foreground/30 text-xs"
                                placeholder="IDENTIFIER"
                            />
                            {errors.username && <span className="text-[9px] text-destructive font-bold uppercase tracking-widest">Entry Required</span>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label className="text-[10px] font-black text-foreground uppercase tracking-widest">Access Key</Label>
                                <Link to="#" className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">Forgot Key?</Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: true })}
                                    className="rounded-none border-primary/20 bg-primary/5 h-12 focus-visible:ring-1 focus-visible:ring-primary transition-all placeholder:text-muted-foreground/30 text-xs"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <span className="text-[9px] text-destructive font-bold uppercase tracking-widest">Key Required</span>}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-14 rounded-none transition-all shadow-xl shadow-primary/10 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px]"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "AUTHORIZE ACCESS"}
                        </Button>
                    </form>

                    <div className="mt-12 text-center border-t border-primary/10 pt-8">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            New Node? <Link to="/register" className="text-primary hover:underline underline-offset-8 ml-1 transition-all">Register Identity</Link>
                        </p>
                    </div>
                </div>

                {/* --- SECCIÓN IMAGEN/ESTILO (DERECHA) --- */}
                <div className="hidden lg:flex lg:w-[55%] relative bg-card overflow-hidden">
                    <img
                        src={loginBg}
                        alt="PIBEs SHOP Identity"
                        className="w-full h-full object-cover grayscale-[0.5] contrast-125"
                    />
                    {/* Overlay Esmeralda de la Marca */}
                    <div className="absolute inset-0bg-linear-to-tr from-primary/30 via-transparent to-transparent" />

                    <div className="absolute bottom-12 left-12 right-12 space-y-4">
                        <div className="bg-card/40 backdrop-blur-md p-6 border border-primary/20 inline-block shadow-2xl">
                            <span className="flex items-center gap-2 text-primary mb-2">
                                <Fingerprint size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Identity Verified</span>
                            </span>
                            <p className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-relaxed">
                                Only authorized personnel <br /> beyond this point.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}