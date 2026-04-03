import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAddresses } from "@/context/AddressContext";
import { useFormatter } from "@/hooks/useFormatter";
import { useLocationForm } from "@/hooks/useLocationForm";
import { LocationFields } from "@/components/Shared/Address/LocationFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Terminal, CreditCard, Banknote, Wallet, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
    const { cart, cartTotal, createOrder, loading: cartLoading } = useCart();
    const { addresses, departments, getAddresses, getDepartments, getDistricts } = useAddresses();
    const { formatCurrency } = useFormatter();
    const navigate = useNavigate();

    // Estados para distritos
    const [districts, setDistricts] = useState([]);
    const [fetchingDistricts, setFetchingDistricts] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const { formData, setFormData, municipalities, setMunicipalities, fetchingMunis, handleDeptChange, handleInputChange } = useLocationForm({
        department_id: "", municipality_id: "", district_id: "", address: "", phone: "", payment_method: "transfer", notes: ""
    });

    useEffect(() => { getAddresses(); getDepartments(); }, []);

    // Cargar distritos cuando cambie el municipio
    useEffect(() => {
        const loadDistricts = async () => {
            if (formData.municipality_id) {
                setFetchingDistricts(true);
                const data = await getDistricts(formData.municipality_id);
                setDistricts(data);
                setFetchingDistricts(false);
            } else {
                setDistricts([]);
            }
        };
        loadDistricts();
    }, [formData.municipality_id]);

    const handleSelectAddress = async (addr) => {
        setSelectedAddressId(addr.id);
        await handleDeptChange(addr.department_id);
        setFormData(prev => ({ 
            ...prev, 
            department_id: addr.department_id, 
            municipality_id: addr.municipality_id, 
            district_id: addr.district_id, // Añadido distrito
            address: addr.address_line, 
            phone: addr.phone 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (await createOrder({ ...formData, address_id: selectedAddressId })) navigate("/customer/orders");
    };

    if (cart.length === 0) return null;

    return (
        <div className="w-full max-w-350 mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 text-foreground bg-background transition-colors">
            <div className="lg:col-span-7 space-y-12">
                <div className="flex items-center gap-3 text-primary"><Terminal size={14} /><span className="text-[9px] font-black uppercase">Logistics Terminal V2.0</span></div>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter">Checkout Protocol</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <button key={addr.id} type="button" onClick={() => handleSelectAddress(addr)} className={`p-5 border text-left transition-all relative ${selectedAddressId === addr.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card/30"}`}>
                            {selectedAddressId === addr.id && <CheckCircle2 size={14} className="absolute top-3 right-3 text-primary" />}
                            {/* Ajuste visual para mostrar Distrito */}
                            <p className="text-[10px] font-black uppercase">{addr.district?.name} / {addr.municipality?.name}</p>
                            <p className="text-[9px] font-mono text-muted-foreground uppercase mt-1 truncate">{addr.address_line}</p>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Pasamos los nuevos props a LocationFields */}
                    <LocationFields 
                        departments={departments} 
                        municipalities={municipalities} 
                        districts={districts}
                        formData={formData} 
                        onDeptChange={handleDeptChange} 
                        onMuniChange={handleInputChange} 
                        onDistChange={handleInputChange}
                        loadingMunis={fetchingMunis} 
                        loadingDistricts={fetchingDistricts}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input name="phone" value={formData.phone} onChange={handleInputChange} required className="h-12 font-mono uppercase bg-background" placeholder="SECURE PHONE" />
                        <Input name="address" value={formData.address} onChange={handleInputChange} required className="h-12 font-mono uppercase bg-background" placeholder="STREET, HOUSE #" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['transfer', 'card', 'cash'].map((m) => (
                            <label key={m} className={`flex flex-col items-center p-5 border cursor-pointer gap-2 ${formData.payment_method === m ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card/10'}`}>
                                {m === 'transfer' ? <Banknote size={20} /> : m === 'card' ? <CreditCard size={20} /> : <Wallet size={20} />}
                                <span className="text-[9px] font-black uppercase">{m === 'card' ? 'Credit Card' : m}</span>
                                <input type="radio" name="payment_method" value={m} checked={formData.payment_method === m} onChange={handleInputChange} className="hidden" />
                            </label>
                        ))}
                    </div>

                    <Button disabled={cartLoading} className="w-full h-20 bg-foreground text-background font-black uppercase tracking-[0.5em] hover:bg-primary transition-all flex justify-between px-10">
                        {cartLoading ? <Loader2 className="animate-spin" /> : "Authorize Purchase"}<ArrowRight size={18} />
                    </Button>
                </form>
            </div>

            <div className="lg:col-span-5 bg-muted/5 dark:bg-zinc-900/20 border p-8 space-y-8 h-fit">
                <h3 className="text-xs font-black uppercase border-b pb-4">Manifest Summary</h3>
                <div className="space-y-4 max-h-75 overflow-auto pr-2">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-[11px] uppercase"><p>{item.name}</p><strong>{formatCurrency(item.price * item.quantity)}</strong></div>
                    ))}
                </div>
                <div className="border-t pt-6 flex justify-between"><span className="text-xs font-black uppercase">Total</span><span className="text-3xl font-black text-primary italic">{formatCurrency(cartTotal)}</span></div>
            </div>
        </div>
    );
}