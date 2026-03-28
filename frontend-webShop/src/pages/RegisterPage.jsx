import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ChevronLeft, UserPlus } from "lucide-react";
import loginBg from "@/assets/login-bg.png"; 

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async (values) => {
        const success = await signup(values);
        if (success) {
            navigate("/login");
        }
    });

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-8 font-sans antialiased transition-colors duration-500">
            <div className="bg-card w-full max-w-6xl overflow-hidden shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)] flex flex-col lg:flex-row min-h-162.5 border border-primary/30">
                <div className="w-full lg:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-card border-r border-primary/10">
                    <div className="mb-8 text-center lg:text-left space-y-4">
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
                            Create New Identity / Network Registration
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="relative flex items-center py-1">
                            <div className="grow border-t border-primary/10"></div>
                            <span className="shrink mx-4 text-[9px] font-black text-primary uppercase tracking-[0.4em]">New Node Data</span>
                            <div className="grow border-t border-primary/10"></div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-foreground uppercase tracking-widest ml-1">Full Name</Label>
                            <Input
                                {...register("name", { required: true })}
                                className="rounded-none border-primary/20 bg-primary/5 h-11 focus-visible:ring-1 focus-visible:ring-primary transition-all text-xs"
                                placeholder="NAME SURNAME"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-foreground uppercase tracking-widest ml-1">Username</Label>
                                <Input
                                    {...register("username", { required: true })}
                                    className="rounded-none border-primary/20 bg-primary/5 h-11 focus-visible:ring-1 focus-visible:ring-primary transition-all text-xs"
                                    placeholder="IDENTIFIER"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-foreground uppercase tracking-widest ml-1">Email Node</Label>
                                <Input
                                    type="email"
                                    {...register("email", { required: true })}
                                    className="rounded-none border-primary/20 bg-primary/5 h-11 focus-visible:ring-1 focus-visible:ring-primary transition-all text-xs"
                                    placeholder="CORE@NODE.COM"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-foreground uppercase tracking-widest ml-1">Security Key</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: true })}
                                    className="rounded-none border-primary/20 bg-primary/5 h-11 pr-12 focus-visible:ring-1 focus-visible:ring-primary transition-all text-xs"
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
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-14 rounded-none transition-all shadow-xl shadow-primary/10 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "REGISTER IDENTITY"}
                        </Button>
                    </form>

                    <div className="mt-10 text-center border-t border-primary/10 pt-6">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            Already authorized? <Link to="/login" className="text-primary hover:underline underline-offset-8 ml-1 transition-all">Login Node</Link>
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex lg:w-[55%] relative bg-card overflow-hidden">
                    <img 
                        src={loginBg} 
                        alt="PIBEs SHOP Identity" 
                        className="w-full h-full object-cover grayscale-[0.3] contrast-125"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-12 left-12 right-12">
                        <div className="bg-card/40 backdrop-blur-md p-6 border border-primary/20 inline-block shadow-2xl">
                            <span className="flex items-center gap-2 text-primary mb-2">
                                <UserPlus size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Protocol 2.0</span>
                            </span>
                            <p className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-relaxed">
                                Start your journey into the <br /> 
                                <span className="text-primary">Engineering Textile Boutique</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}