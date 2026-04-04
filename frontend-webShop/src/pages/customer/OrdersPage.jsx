import { useEffect, useMemo, useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { useInvoice } from "@/context/InvoiceContext";
import { useAuth } from "@/context/AuthContext";
import { useFormatter } from "@/hooks/useFormatter";
import { Terminal, ShieldCheck, AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { OrderCard } from "@/components/Shared/Orders/OrderCard";
import ConfirmCancelModal from "@/components/Shared/Modals/ConfirmCancelModal";

export default function MyOrdersPage() {
    const { orders, getUserOrders, updateStatus, loading: ordersLoading } = useOrder();
    const { fetchInvoices, printInvoice } = useInvoice();
    const { user } = useAuth();
    const { formatCurrency } = useFormatter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [printingId, setPrintingId] = useState(null);

    useEffect(() => {
        if (user?.role) {
            getUserOrders();
            fetchInvoices(user.role);
        }
    }, [user?.role, getUserOrders, fetchInvoices]);

    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [orders]);

    const handlePrint = async (id) => {
        setPrintingId(id);
        await printInvoice(id);
        setPrintingId(null);
    };

    if (ordersLoading && orders.length === 0) return <LoadingState />;

    return (
        <div className="max-w-350 mx-auto px-6 py-20 min-h-screen space-y-16">
            <PageHeader user={user} onRefresh={() => { getUserOrders(); fetchInvoices(user.role); }} />

            {sortedOrders.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {sortedOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            formatCurrency={formatCurrency}
                            getStatusStyle={getStatusStyle}
                            canCancel={canCancel}
                            onPrint={handlePrint}
                            onCancel={(ord) => { setSelectedOrder(ord); setIsModalOpen(true); }}
                            isPrinting={printingId === order.id}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}

            <ConfirmCancelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={async () => {
                    await updateStatus(selectedOrder.id, "cancelled");
                    setIsModalOpen(false);
                }}
                orderNumber={selectedOrder?.order_number}
            />
        </div>
    );
}
const PageHeader = ({ user, onRefresh }) => (
    <header className="space-y-4">
        <div className="flex items-center gap-3 text-primary"><Terminal size={14} /><span className="text-[9px] font-black uppercase tracking-[0.5em]">Logistics / Order History</span></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="text-6xl font-black uppercase tracking-tighter italic text-foreground">My Manifests</h1>
            <div className="flex items-center gap-3">
                <button
                    onClick={onRefresh}
                    className="h-10 px-5 border border-border bg-muted/5 text-foreground hover:bg-foreground hover:text-background font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-2"
                    title="Refresh data"
                >
                    <RefreshCcw size={14} strokeWidth={3} />
                    Refresh
                </button>

                <div className="flex items-center gap-2 px-4 h-10 bg-primary/10 border border-primary/20 rounded-sm">
                    <ShieldCheck size={12} className="text-primary" />
                    <span className="text-[10px] font-mono uppercase font-bold text-primary">
                        Role: {user?.role}
                    </span>
                </div>
            </div>
        </div>
    </header>
);

const LoadingState = () => (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <span className="font-black uppercase tracking-[0.4em] text-[10px]">Syncing Manifest Grid...</span>
    </div>
);

const EmptyState = () => (
    <div className="py-40 border border-dashed border-border flex flex-col items-center justify-center space-y-6 opacity-30">
        <AlertCircle size={48} strokeWidth={1} />
        <div className="text-center space-y-2">
            <p className="text-[12px] font-black uppercase tracking-[0.5em]">No Manifests Detected</p>
            <p className="text-[10px] uppercase italic text-foreground">Database contains no records for this node.</p>
        </div>
    </div>
);

// Lógica de utilidad (puedes moverlas a un archivo /utils si quieres)
const canCancel = (date) => (new Date() - new Date(date)) / (1000 * 60 * 60) < 1;
const getStatusStyle = (s) => {
    const styles = {
        pending: "border-amber-500/20 text-amber-500 bg-amber-500/5",
        completed: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5",
        cancelled: "border-red-500/20 text-red-500 bg-red-500/5",
        shipped: "border-blue-500/20 text-blue-500 bg-blue-500/5",
    };
    return styles[s.toLowerCase()] || "border-border text-muted-foreground";
};