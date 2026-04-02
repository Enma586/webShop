import { Edit3, Trash2, Eye, Printer } from "lucide-react";
import { getInvoicePdfRequest } from "@/api/order";

export function UniversalRow({ item, onDelete, onEdit, isAdmin, showDelete, editIcon }) {
  const formattedId = item.id ? item.id.toString().padStart(4, '0') : "0000";
  
  // Extraemos el valor del stock si existe en el objeto (asumiendo que la prop se llama 'stock')
  const isLowStock = item.stock !== undefined && item.stock <= 10;
  const isOutOfStock = item.stock !== undefined && item.stock === 0;

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

  // Lógica de colores de estado
  const statusColor = (item.status === 'COMPLETED' || item.status === 'ACTIVE') ? 'text-primary' : 
                     (item.status === 'CANCELLED' || isOutOfStock ? 'text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-foreground');

  return (
    <tr className={`group transition-all duration-300 border-b border-border last:border-0 
      ${isLowStock ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-muted/40'}`}>
      
      <td className="p-6 border-r border-border">
        <div className="flex items-center gap-6">
          {item.image && (
            <div className={`w-10 h-10 bg-muted border border-border transition-all duration-700 
              ${isLowStock ? 'grayscale-0 border-red-500/50' : 'grayscale group-hover:grayscale-0'}`}>
              <img src={getImageUrl(item.image)} className="w-full h-full object-cover" alt="" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className={`text-[12px] font-black uppercase tracking-wider truncate ${isLowStock ? 'text-red-500' : ''}`}>
              {item.name}
            </span>
            <span className="text-[8px] font-mono text-muted-foreground tracking-widest uppercase">
              {item.subtitle || `SYS_UID_${formattedId}`}
            </span>
          </div>
        </div>
      </td>

      {extraColumns.map((val, idx) => {
        // Detectamos si esta celda es la que muestra el número de stock
        // Si el valor es igual al stock del item y es bajo, le ponemos rojo
        const isStockCell = val === item.stock;
        
        return (
          <td key={idx} className={`p-6 text-center font-mono text-[11px] border-r border-border uppercase tracking-widest
            ${(isStockCell && isLowStock) ? 'text-red-500 font-black animate-pulse' : 'text-foreground'}`}>
            {val || "---"}
            {isStockCell && isLowStock && <span className="block text-[7px] mt-1 font-black">CRITICAL_STOCK</span>}
          </td>
        );
      })}

      <td className="p-6 text-center border-r border-border">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[10px] font-black uppercase tracking-tighter ${statusColor}`}>
            {isOutOfStock ? "OUT_OF_STOCK" : (item.status || "UNKNOWN")}
          </span>
          <div className={`h-2px w-8 ${isLowStock ? 'bg-red-500 shadow-[0_0_5px_red]' : (item.active ? 'bg-primary' : 'bg-border')}`} />
        </div>
      </td>

      <td className="p-6 text-right">
        <div className="flex justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
          {isAdmin ? (
            <>
              {item.status === 'COMPLETED' && (
                <button 
                  onClick={() => handlePrint(item.id)} 
                  className="p-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  <Printer size={14} strokeWidth={3} />
                </button>
              )}
              <button 
                onClick={() => onEdit(item.id)} 
                className={`p-2.5 bg-secondary/50 border border-border transition-all
                  ${isLowStock ? 'hover:bg-red-500 hover:text-white' : 'hover:bg-foreground hover:text-background'}`}
              >
                {editIcon ? editIcon : <Edit3 size={14} strokeWidth={3} />}
              </button>
              {showDelete && (
                <button 
                  onClick={() => onDelete(item.id, item.name)} 
                  className="p-2.5 bg-secondary/50 border border-border hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={14} strokeWidth={3} />
                </button>
              )}
            </>
          ) : (
            <button className={`flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2.5 transition-all
              ${isLowStock ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-foreground text-background hover:bg-primary'}`}>
              <Eye size={12} /> Inspect
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}