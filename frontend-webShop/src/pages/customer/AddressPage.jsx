import { useEffect } from "react";
import { useAddresses } from "@/context/AddressContext";
import { useLocationForm } from "@/hooks/useLocationForm";
import { LocationFields } from "@/components/Shared/Address/LocationFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Trash2, CheckCircle2, Terminal, Loader2, Plus } from "lucide-react";

export default function AddressPage() {
    const { addresses, departments, loading, getAddresses, getDepartments, createAddress, deleteAddress } = useAddresses();
    const { formData, setFormData, municipalities, setMunicipalities, fetchingMunis, handleDeptChange, handleInputChange } = useLocationForm({
        department_id: "", municipality_id: "", address_line: "", phone: "", is_default: false
    });

    useEffect(() => {
        getAddresses();
        getDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (await createAddress(formData)) {
            setFormData({ department_id: "", municipality_id: "", address_line: "", phone: "", is_default: false });
            setMunicipalities([]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary"><Terminal size={14} /><span className="text-[9px] font-black uppercase tracking-[0.5em]">Logistics / Network Nodes</span></div>
                <h1 className="text-6xl font-black uppercase tracking-tighter italic">Shipping Nodes</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-8 bg-muted/10 p-10 border border-border">
                    <LocationFields departments={departments} municipalities={municipalities} formData={formData} onDeptChange={handleDeptChange} onMuniChange={handleInputChange} fetchingMunis={fetchingMunis} />
                    <div className="space-y-4">
                        <Input name="address_line" value={formData.address_line} onChange={handleInputChange} placeholder="COLONIA, CALLE, NÚMERO..." required className="h-12 font-mono text-xs uppercase" />
                        <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+503 XXXX-XXXX" required className="h-12 font-mono text-xs" />
                    </div>
                    <Button disabled={loading} className="w-full bg-foreground text-background font-black uppercase text-xs h-16">{loading ? <Loader2 className="animate-spin" /> : "Execute Registration"}</Button>
                </form>

                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="p-8 border border-border bg-muted/5 flex flex-col justify-between group hover:border-primary/50 transition-all">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2"><MapPin size={14} className="text-primary" /><span className="text-[11px] font-black uppercase">{addr.municipality?.name} / {addr.department?.name}</span></div>
                                    {addr.is_default && <CheckCircle2 size={12} className="text-emerald-500" />}
                                </div>
                                <p className="text-[10px] font-mono text-muted-foreground uppercase">{addr.address_line}</p>
                            </div>
                            <div className="mt-8 flex justify-between items-end">
                                <p className="text-[9px] font-black opacity-40 font-mono">{addr.phone}</p>
                                <button onClick={() => deleteAddress(addr.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}