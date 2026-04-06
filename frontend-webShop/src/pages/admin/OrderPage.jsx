import { RefreshCcw } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useOrder } from "@/context/OrderContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import OrderFormModal from "./modals/OrderFormModal";

const ORDER_FILTER_OPTIONS = [
  { value: "ALL", label: "ALL_ORDERS" },
  { value: "PENDING", label: "ONLY_PENDING" },
  { value: "COMPLETED", label: "ONLY_COMPLETED" },
  { value: "CANCELLED", label: "ONLY_CANCELLED" },
];

const ORDER_SORT_OPTIONS = [
  { value: "date_desc", key: "NEWEST", label: "NEWEST_FIRST" },
  { value: "date_asc", key: "OLDEST", label: "OLDEST_FIRST" },
  { value: "total_desc", key: "HIGHEST", label: "HIGHEST_TOTAL" },
  { value: "total_asc", key: "LOWEST", label: "LOWEST_TOTAL" },
];

export default function OrderPage() {
  const { orders, getOrders } = useOrder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeSort, setActiveSort] = useState(null);

  useEffect(() => { getOrders(); }, [getOrders]);

  const processedOrders = useMemo(() => {
    let result = [...(orders || [])];

    if (activeFilter !== "ALL") {
      result = result.filter(o => o.status?.toLowerCase() === activeFilter.toLowerCase());
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(o =>
        o.order_number?.toLowerCase().includes(term) ||
        o.user?.name?.toLowerCase().includes(term) ||
        o.payment_method?.toLowerCase().includes(term)
      );
    }

    if (activeSort?.key === "NEWEST") result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (activeSort?.key === "OLDEST") result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (activeSort?.key === "HIGHEST") result.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
    if (activeSort?.key === "LOWEST") result.sort((a, b) => parseFloat(a.total) - parseFloat(b.total));

    return result;
  }, [orders, searchTerm, activeFilter, activeSort]);

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
      <section className="w-full max-w-400 mx-auto pt-16 px-12">
        <UniversalHeader
          title="Sales"
          isAdmin={false}
          onRefresh={getOrders}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeSort={activeSort}
          onSortClick={(value) => {
            const opt = ORDER_SORT_OPTIONS.find(o => o.value === value);
            setActiveSort(opt || null);
          }}
          filterOptions={ORDER_FILTER_OPTIONS}
          sortOptions={ORDER_SORT_OPTIONS}
        />
      </section>

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
