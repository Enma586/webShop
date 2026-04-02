import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { AuthLayout } from "../layouts/AuthLayout";

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/login");
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async (values) => {
        const success = await signup(values);
        if (success) navigate("/login");
    });

    return (
        <AuthLayout 
            subtitle="Create New Identity / Network Registration"
            bannerIcon={UserPlus}
            bannerTitle="Node Protocol 2.0"
            bannerText={<>Start your journey into the <br /> <span className="text-primary">Engineering Textile Boutique</span>.</>}
        >
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
        </AuthLayout>
    );
}