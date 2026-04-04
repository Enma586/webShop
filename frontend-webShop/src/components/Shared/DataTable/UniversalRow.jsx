import { Edit3, Trash2, Eye, Printer } from "lucide-react";
import { getInvoicePdfRequest } from "@/api/order";

export function UniversalRow({ item, index, onDelete, onEdit, isAdmin, showDelete, editIcon }) {
  const formattedId = item.id ? item.id.toString().padStart(4, '0') : "0000";
  const isLowStock = item.stock !== undefined && item.stock <= 10 && item.stock > 0;
  const isOutOfStock = item.stock !== undefined && item.stock === 0;
  const isEven = index % 2 === 0;

  const extraColumns = Object.keys(item)
    .filter(key => key.startsWith('column'))
    .sort()
    .map(key => item[key]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  const handlePrint = async (id) => {
    try {
      const res = await getInvoicePdfRequest(id);
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.error("PRINT_ERROR:", error);
    }
  };

  const getStatusConfig = (status) => {
    const map = {
      COMPLETED: { color: "text-primary", bg: "bg-primary/10 border-primary/20", dot: "bg-primary" },
      ACTIVE: { color: "text-primary", bg: "bg-primary/10 border-primary/20", dot: "bg-primary" },
      PENDING: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
      PROCESSING: { color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", dot: "bg-blue-500" },
      CANCELLED: { color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-500" },
      CRITICAL: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
      DEPLETED: { color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-500" },
    };
    return map[status] || { color: "text-foreground", bg: "bg-muted border-border", dot: "bg-border" };
  };

  const statusConfig = getStatusConfig(item.status);

  return (
    <tr className={`group transition-all duration-200 border-b border-border/50 last:border-0
      ${isEven ? "bg-transparent" : "bg-muted/[0.02]"}
      ${isLowStock ? 'hover:bg-red-500/5' : 'hover:bg-muted/30'}`}>

      <td className="p-5 border-r border-border/50">
        <div className="flex items-center gap-5">
          {item.image && (
            <div className={`w-10 h-10 bg-muted border border-border/50 overflow-hidden transition-all duration-500 shrink-0
              ${isLowStock ? 'grayscale-0 border-red-500/30' : 'grayscale group-hover:grayscale-0 group-hover:border-primary/30'}`}>
              <img src={getImageUrl(item.image)} className="w-full h-full object-cover" alt="" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className={`text-[12px] font-black uppercase tracking-wider truncate transition-colors
              ${isLowStock ? 'text-red-500' : 'text-foreground group-hover:text-primary'}`}>
              {item.name}
            </span>
            <span className="text-[8px] font-mono text-muted-foreground tracking-widest uppercase">
              {item.subtitle || `SYS_UID_${formattedId}`}
            </span>
          </div>
        </div>
      </td>

      {extraColumns.map((val, idx) => {
        const isStockCell = val === item.stock;
        return (
          <td key={idx} className={`p-5 text-center font-mono text-[11px] border-r border-border/50 uppercase tracking-widest transition-colors
            ${(isStockCell && isLowStock) ? 'text-red-500 font-black' : 'text-foreground/70 group-hover:text-foreground'}`}>
            {val || "---"}
            {isStockCell && isLowStock && (
              <span className="block text-[7px] mt-1 font-black text-red-500/70 uppercase tracking-widest">Low Stock</span>
            )}
          </td>
        );
      })}

      <td className="p-5 text-center border-r border-border/50">
        <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 border ${statusConfig.bg} ${statusConfig.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {isOutOfStock ? "OUT_OF_STOCK" : (item.status || "UNKNOWN")}
        </span>
      </td>

      <td className="p-5 text-right pr-6">
        <div className="flex justify-end gap-1.5 md:opacity-0 group-hover:opacity-100 transition-all duration-200">
          {isAdmin ? (
            <>
              {item.status === 'COMPLETED' && (
                <button
                  onClick={() => handlePrint(item.id)}
                  className="p-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all active:scale-95"
                  title="Print Invoice"
                >
                  <Printer size={14} strokeWidth={3} />
                </button>
              )}
              <button
                onClick={() => onEdit(item.id)}
                className={`p-2.5 border border-border/50 transition-all active:scale-95
                  ${isLowStock
                    ? 'bg-secondary/30 hover:bg-red-500 hover:text-white hover:border-red-500'
                    : 'bg-secondary/30 hover:bg-foreground hover:text-background hover:border-foreground'}`}
                title="Edit"
              >
                {editIcon ? editIcon : <Edit3 size={14} strokeWidth={3} />}
              </button>
              {showDelete && (
                <button
                  onClick={() => onDelete(item.id, item.name)}
                  className="p-2.5 bg-secondary/30 border border-border/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
                  title="Delete"
                >
                  <Trash2 size={14} strokeWidth={3} />
                </button>
              )}
            </>
          ) : (
            <button className={`flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2.5 transition-all active:scale-95
              ${isLowStock ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-foreground text-background hover:bg-primary'}`}>
              <Eye size={12} /> Inspect
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
