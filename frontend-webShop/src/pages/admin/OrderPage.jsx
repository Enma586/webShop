import { useEffect, useState, useMemo } from "react";
import { useOrder } from "@/context/OrderContext";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import OrderFormModal from "./modals/OrderFormModal";

const OrderFilters = ({ filters, setFilters }) => (
  <div className="flex flex-col md:flex-row items-end gap-6 bg-muted/5 border border-border p-8 mb-8">
    <div className="flex flex-col gap-2">
      <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Date Range</span>
      <div className="flex items-center gap-2">
        <input type="date" value={filters.from} onChange={(e) => setFilters({...filters, from: e.target.value})} className="bg-transparent border border-border px-3 py-2 text-[10px] font-black uppercase outline-none text-primary focus:border-primary/50" />
        <span className="text-[9px] font-black opacity-20">TO</span>
        <input type="date" value={filters.to} onChange={(e) => setFilters({...filters, to: e.target.value})} className="bg-transparent border border-border px-3 py-2 text-[10px] font-black uppercase outline-none text-primary focus:border-primary/50" />
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Min Amount USD</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary">$</span>
        <input type="number" value={filters.minAmount} onChange={(e) => setFilters({...filters, minAmount: e.target.value})} placeholder="0.00" className="bg-transparent border border-border pl-7 pr-3 py-2 text-[10px] font-black uppercase outline-none text-foreground w-32 focus:border-primary/50" />
      </div>
    </div>

    <button onClick={() => setFilters({ from: "", to: "", minAmount: "" })} className="h-9 px-6 border border-primary/20 text-primary text-[9px] font-black uppercase hover:bg-primary hover:text-primary-foreground transition-all ml-auto">
      Reset Log Filters
    </button>
  </div>
);

export default function OrderPage() {
  const { orders, getOrders } = useOrder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    minAmount: ""
  });

  useEffect(() => { getOrders(); }, [getOrders]);

  const processedOrders = useMemo(() => {
    let result = [...(orders || [])];

    if (filters.from && filters.to) {
      const start = new Date(filters.from);
      const end = new Date(filters.to);
      end.setHours(23, 59, 59, 999);
      result = result.filter(o => {
        const d = new Date(o.created_at);
        return d >= start && d <= end;
      });
    }

    if (filters.minAmount) {
      result = result.filter(o => parseFloat(o.total) >= parseFloat(filters.minAmount));
    }

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [orders, filters]);

  const mappedData = useMemo(() => {
    return processedOrders.map(o => ({
      id: o.id,
      name: o.order_number,
      subtitle: o.user?.name?.toUpperCase() || "UNKNOWN USER",
      column2: `$${parseFloat(o.total).toFixed(2)}`,
      column3: `${o.items?.length || 0} ITEMS`,
      column4: o.address?.department?.name?.toUpperCase() || "N/A",
      column5: o.payment_method?.replace('_', ' ').toUpperCase() || 'TRANSFER',
      column6: new Date(o.created_at).toLocaleDateString('es-SV', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }),
      status: o.status.toUpperCase(),
      active: o.status === 'completed',
    }));
  }, [processedOrders]);

  const handleEdit = (id) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <header className="w-full max-w-400 mx-auto pt-16 px-12 mb-12">
        <div className="relative pl-6 mb-12">
          <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary" />
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
            Sales <span className="text-primary/60">Log</span>
          </h1>
        </div>

        <OrderFilters filters={filters} setFilters={setFilters} />
      </header>

      <section className="w-full max-w-400 mx-auto px-12 pb-24">
        <UniversalTable 
          data={mappedData} 
          columns={["Order Ref", "Total", "Items", "Region", "Method", "Date", "Status", "Inspect"]} 
          isAdmin={true} 
          showDelete={false} 
          onEdit={handleEdit} 
        />
      </section>

      <footer className="w-full border-t border-border bg-muted/5 py-10 px-12 mt-auto">
        <UniversalFooter count={mappedData.length} isAdmin={true} />
      </footer>

      <OrderFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedOrderId(null); }} 
        orderId={selectedOrderId} 
      />
    </div>
  );
}