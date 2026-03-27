import { useEffect, useState, useMemo } from "react";
import { useOrder } from "@/context/OrderContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import OrderFormModal from "./modals/OrderFormModal";

export default function OrderPage() {
  const { orders, getOrders } = useOrder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => { 
    getOrders(); 
  }, [getOrders]);

  const processedOrders = useMemo(() => {
    let result = [...(orders || [])];

    if (searchTerm) {
      result = result.filter(o => 
        o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "ALL") {
      result = result.filter(o => o.status.toUpperCase() === filterType);
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'total') { aVal = parseFloat(aVal); bVal = parseFloat(bVal); }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [orders, searchTerm, filterType, sortConfig]);

  const mappedData = useMemo(() => {
    return processedOrders.map(o => ({
      id: o.id,
      name: o.order_number,
      subtitle: o.user?.name?.toUpperCase() || "UNKNOWN_USER",
      column2: `$${parseFloat(o.total).toFixed(2)}`,
      column3: `${o.items?.length || 0} ITEMS`,
      column4: o.address?.department?.name?.toUpperCase() || "N/A",
      column5: o.payment_method?.replace('_', ' ').toUpperCase() || 'TRANSFER',
      column6: new Date(o.created_at).toLocaleDateString('es-SV', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      status: o.status.toUpperCase(),
      active: o.status === 'completed',
    }));
  }, [processedOrders]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleEdit = (id) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-1600px mx-auto pt-12 md:pt-16 px-8 md:px-12">
        <UniversalHeader 
          title="Sales_Log" 
          subtitle="TRANSACTION_MONITOR // V3.0"
          isAdmin={false} // Desactiva el botón de agregar heredado del layout de admin
          showAction={false} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onFilterChange={setFilterType}
          onSortClick={handleSort}
          activeSort={sortConfig}
        />
      </section>

      <section className="w-full max-w-1600px mx-auto px-8 md:px-12 pb-24">
        <UniversalTable 
          data={mappedData} 
          columns={["Order_Ref", "Total", "Items", "Region", "Method", "Date", "Status", "Inspect"]} 
          isAdmin={true} 
          showDelete={false} 
          onEdit={handleEdit} 
        />
      </section>

      <footer className="w-full border-t border-border bg-muted/5 py-10 mt-auto px-12">
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