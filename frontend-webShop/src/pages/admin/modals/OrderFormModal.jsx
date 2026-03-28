import { useEffect, useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { UniversalModal } from "@/components/Shared/Modals/UniversalModal";
import { FormSection } from "@/components/Shared/Form";
import { Package, User, MapPin, CreditCard, Receipt, Lock } from "lucide-react";

export default function OrderFormModal({ isOpen, onClose, orderId }) {
  const { getOrder, updateStatus, loading } = useOrder();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId && isOpen) {
      const load = async () => { 
        const data = await getOrder(orderId, true);
        setOrder(data); 
      };
      load();
    } else if (!isOpen) setOrder(null);
  }, [orderId, isOpen]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    await updateStatus(orderId, newStatus);
    const updated = await getOrder(orderId, true);
    setOrder(updated);
  };

  const isLocked = order?.status === 'completed' || order?.status === 'cancelled';

  if (!order && isOpen) return null;

  return (
    <UniversalModal 
      isOpen={isOpen} onClose={onClose} 
      title={`ORDER INSPECTION ${order?.order_number?.replace(/_/g, ' ')}`}
      subtitle={`DATA INTEGRITY CHECK FOR ID ${orderId}`}
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-background">
        <div className="lg:col-span-7 p-8 md:p-12 border-r border-border space-y-10">
          <div>
            <FormSection number="01" title="ORDER ITEMS MANIFEST" />
            <div className="space-y-4 mt-6">
              {order?.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center border border-border p-4 bg-muted/5">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Package className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">{item.product_name?.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">QTY: {item.quantity} // UNIT: ${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-primary">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between p-4 border-t-2 border-primary bg-primary/5">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Invoice Value</span>
              <span className="text-lg font-black text-primary">${parseFloat(order?.total).toFixed(2)}</span>
            </div>
          </div>

          <div>
            <FormSection number="02" title="LOGISTICS & DESTINATION" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><User size={12}/> Customer Entity</label>
                <p className="text-sm font-bold uppercase">{order?.user?.name?.replace(/_/g, ' ')}</p>
                <p className="text-xs text-muted-foreground font-mono italic">{order?.user?.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><MapPin size={12}/> Delivery Node</label>
                <p className="text-xs font-bold uppercase">{order?.address?.department?.name?.replace(/_/g, ' ')}, {order?.address?.municipality?.name?.replace(/_/g, ' ')}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed uppercase">{order?.address?.address_details?.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 bg-muted/10 space-y-10">
          <div>
            <FormSection number="03" title="CONTROL STATUS OVERRIDE" />
            <div className="space-y-6 mt-6">
              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><CreditCard size={12}/> Payment Method</label>
                <div className="p-4 border border-border bg-background text-xs font-black uppercase text-primary tracking-widest italic">
                  {order?.payment_method?.replace(/_/g, ' ') || 'TRANSFER PENDING'}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-widest">
                  Operation Status {isLocked && <Lock size={10} className="text-red-500" />}
                </label>
                <select 
                  value={order?.status} 
                  onChange={handleStatusChange} 
                  disabled={loading || isLocked} 
                  className={`w-full p-4 text-sm font-black uppercase outline-none appearance-none border
                    ${isLocked ? 'bg-muted/50 border-border cursor-not-allowed opacity-60' : 'bg-background border-primary/40 focus:border-primary cursor-pointer'}`}
                >
                  <option value="processing">PROCESSING ORDER</option>
                  <option value="completed">COMPLETED GENERATED INVOICE</option>
                  <option value="cancelled">CANCELLED VOID</option>
                </select>
                {isLocked && <p className="text-[9px] text-red-500 font-bold uppercase mt-2 italic tracking-widest">** STATUS LOCKED: FINALIZED TRANSACTION **</p>}
              </div>

              {order?.invoice && (
                <div className="mt-8 p-4 border border-green-500/30 bg-green-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="text-green-500 size-5" />
                    <div>
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Invoice Generated</p>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase italic">REF: {order.invoice.invoice_number?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 flex border-t border-border h-20">
          <button 
            onClick={onClose} 
            className="w-full flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] bg-foreground text-background hover:bg-primary hover:text-white outline-none transition-none"
          >
            Close Inspection Terminal
          </button>
        </div>
      </div>
    </UniversalModal>
  );
}