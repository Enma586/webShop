import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, ShieldCheck, Eye, EyeOff, Cpu } from "lucide-react";

export default function ProfileEditModal({ isOpen, onClose }) {
    const { profile, getProfile, updateProfile } = useUser();
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const isAdmin = profile?.role === 'admin';

    useEffect(() => {
        let isMounted = true;
        if (isOpen) {
            const loadData = async () => {
                setFetching(true);
                try {
                    const res = await getProfile();
                    const userData = res?.data || res;
                    if (userData && isMounted) {
                        setValue("name", userData.name || "");
                        setValue("email", userData.email || "");
                        setValue("username", userData.username || "");
                        setValue("role", userData.role || "");
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    if (isMounted) setFetching(false);
                }
            };
            loadData();
        } else {
            reset();
        }
        return () => { isMounted = false; };
    }, [isOpen]);

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);
        const success = await updateProfile(formData);
        setLoading(false);
        if (success) onClose();
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-md p-4" onClick={onClose}>
            <div className="bg-card w-full max-w-lg border border-primary/20 shadow-2xl relative overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 border-b border-primary/10 flex justify-between items-center bg-muted/5">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary italic">Identity Update</span>
                            {isAdmin && (
                                <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 border border-primary/20">
                                    <Cpu size={8} className="text-primary" />
                                    <span className="text-[7px] font-black text-primary uppercase tracking-widest">Root_Access</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter italic">Edit Profile</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-all border-none outline-none ring-0 bg-transparent">
                        <X size={20} />
                    </button>
                </div>

                {fetching ? (
                    <div className="p-24 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 italic">Syncing Node...</span>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-foreground">Identity Name</Label>
                            <Input {...register("name", { required: true })} className="rounded-none border-none bg-primary/5 focus-visible:ring-0 h-12 text-xs uppercase font-bold outline-none ring-0 shadow-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 opacity-50">
                                <Label className="text-[10px] font-black uppercase tracking-widest">Username</Label>
                                <Input {...register("username")} readOnly className="rounded-none border-none bg-transparent h-12 text-xs font-bold cursor-not-allowed outline-none ring-0 shadow-none uppercase" />
                            </div>
                            <div className="space-y-2 opacity-50">
                                <Label className="text-[10px] font-black uppercase tracking-widest">Role</Label>
                                <Input {...register("role")} readOnly className="rounded-none border-none bg-transparent h-12 text-xs font-black cursor-not-allowed outline-none ring-0 shadow-none uppercase text-primary" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-foreground">Access Email</Label>
                            <Input {...register("email", { required: true })} type="email" className="rounded-none border-none bg-primary/5 focus-visible:ring-0 h-12 text-xs font-bold outline-none ring-0 shadow-none" />
                        </div>

                        <div className="pt-4 border-t border-primary/10">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 mb-4 block">Security_Override (Optional)</span>
                            <div className="space-y-4">
                                <div className="space-y-2 relative">
                                    <Label className="text-[10px] font-black uppercase tracking-widest">New Access Key</Label>
                                    <div className="relative">
                                        <Input {...register("password")} type={showPass ? "text" : "password"} placeholder="••••••••" className="rounded-none border-none bg-primary/5 focus-visible:ring-0 h-12 text-xs font-bold outline-none ring-0 shadow-none pr-10" />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors">
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest">Confirm Key</Label>
                                    <Input {...register("password_confirmation", { validate: value => !watch('password') || value === watch('password') || "Mismatch" })} type={showPass ? "text" : "password"} placeholder="••••••••" className="rounded-none border-none bg-primary/5 focus-visible:ring-0 h-12 text-xs font-bold outline-none ring-0 shadow-none" />
                                    {errors.password_confirmation && <span className="text-[8px] text-destructive font-black uppercase tracking-widest mt-1 block">{errors.password_confirmation.message}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button type="button" onClick={onClose} className="flex-1 bg-muted/10 text-[10px] font-black uppercase tracking-widest h-12 border-none outline-none ring-0">Abort</button>
                            <button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest h-12 shadow-lg shadow-primary/20 border-none outline-none ring-0 flex items-center justify-center disabled:opacity-50">
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sync Changes"}
                            </button>
                        </div>
                    </form>
                )}
                
                <div className="bg-muted/10 p-4 border-t border-primary/5 flex items-center gap-2 justify-center">
                    <ShieldCheck size={12} className="text-primary/40" />
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Identity_Verified_v3.0</span>
                </div>
            </div>
        </div>
    );
}