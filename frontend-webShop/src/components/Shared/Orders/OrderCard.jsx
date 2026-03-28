import { Package, Clock, XCircle, FileText, Loader2 } from "lucide-react";

export const OrderCard = ({ 
    order, 
    formatCurrency, 
    getStatusStyle, 
    canCancel, 
    onPrint, 
    onCancel, 
    isPrinting 
}) => {
    const isCancelled = order.status === 'cancelled';
    const cancelable = canCancel(order.created_at) && order.status === 'pending';

    return (
        <div className={`group border border-border bg-card/30 hover:border-primary/50 transition-all p-8 relative overflow-hidden ${isCancelled ? 'opacity-60' : ''}`}>
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Package size={120} />
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
                {/* Info Principal */}
                <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-black font-mono tracking-tighter text-primary">#{order.order_number}</span>
                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <OrderStat label="Invoice Total" value={formatCurrency(order.total)} isMono />
                        <OrderStat label="Log Date" value={new Date(order.created_at).toLocaleDateString('es-SV')} />
                        <OrderStat label="Protocol" value={order.payment_method?.replace('_', ' ')} />
                        <OrderStat label="Drop Point" value={order.address?.municipality?.name || "Global Node"} isTruncated />
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row items-center gap-4 lg:self-end">
                    {!isCancelled && (
                        <button 
                            onClick={() => onPrint(order.id)}
                            disabled={isPrinting}
                            className="w-full sm:w-auto h-12 px-6 border border-border bg-background hover:border-primary flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all text-foreground disabled:opacity-50 group/btn"
                        >
                            {isPrinting ? <Loader2 className="animate-spin" size={14} /> : <FileText size={14} className="group-hover/btn:text-primary" />}
                            {isPrinting ? "Generating..." : "View Invoice"}
                        </button>
                    )}

                    {cancelable && (
                        <button 
                            onClick={() => onCancel(order)}
                            className="w-full sm:w-auto h-12 px-6 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            <XCircle size={14} /> Abort Order
                        </button>
                    )}

                    {!cancelable && order.status === 'pending' && (
                        <Badge variant="warning"><Clock size={12} /> Time Lock Active</Badge>
                    )}

                    {isCancelled && (
                        <Badge variant="error"><XCircle size={12} /> Void Manifest</Badge>
                    )}
                </div>
            </div>
            
            {/* Items */}
            <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-[9px] font-black uppercase opacity-40 mb-3 tracking-[0.2em]">Item Manifest</p>
                <div className="flex flex-wrap gap-4">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="bg-muted/30 px-3 py-2 border border-border flex items-center gap-3 hover:border-primary/30 transition-colors">
                            <span className="text-[10px] font-black text-primary italic">x{item.quantity}</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-foreground">{item.product_name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Sub-componentes internos para limpieza absoluta
const OrderStat = ({ label, value, isMono, isTruncated }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black uppercase opacity-40 italic">{label}</p>
        <p className={`font-bold uppercase text-foreground ${isMono ? 'font-mono text-sm' : 'text-[11px]'} ${isTruncated ? 'truncate max-w-37.5' : ''}`}>
            {value}
        </p>
    </div>
);

const Badge = ({ children, variant }) => {
    const styles = variant === 'error' 
        ? "text-red-500/50 border-red-500/20" 
        : "text-muted-foreground border-border";
    return (
        <div className={`flex items-center gap-2 text-[9px] font-bold uppercase italic px-4 border border-dashed h-12 ${styles}`}>
            {children}
        </div>
    );
};