import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Fingerprint } from "lucide-react";
import { AuthLayout } from "../layouts/AuthLayout";

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { signin, loading, isAuthenticated, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        await signin(data);
    });

    return (
        <AuthLayout 
            subtitle="The Architecture of Identity / Access System"
            bannerIcon={Fingerprint}
            bannerTitle="Identity Verified"
            bannerText={<>Only authorized personnel <br /> beyond this point.</>}
        >
            <form onSubmit={onSubmit} className="space-y-5">
                <div className="relative flex items-center py-2">
                    <div className="grow border-t border-primary/10"></div>
                    <span className="shrink mx-4 text-[9px] font-black text-primary uppercase tracking-[0.4em]">Authorization Required</span>
                    <div className="grow border-t border-primary/10"></div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-foreground uppercase tracking-widest ml-1">Username Node</Label>
                    <Input
                        {...register("username", { required: true })}
                        className="rounded-none border-primary/20 bg-primary/5 h-12 focus-visible:ring-1 focus-visible:ring-primary transition-all text-xs"
                        placeholder="IDENTIFIER"
                    />
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
                            className="rounded-none border-primary/20 bg-primary/5 h-12 pr-12 focus-visible:ring-1 focus-visible:ring-primary transition-all text-xs"
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
        </AuthLayout>
    );
}