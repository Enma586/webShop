import { Edit3, Trash2, Eye, Printer } from "lucide-react";
import { getInvoicePdfRequest } from "@/api/order";

export function UniversalRow({ item, onDelete, onEdit, isAdmin, showDelete }) {
  const formattedId = item.id ? item.id.toString().padStart(4, '0') : "0000";
  
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
      const printWindow = window.open(fileURL);

    } catch (error) {
      console.error("PRINT_ERROR:", error);
    }
  };

  const statusColor = item.status === 'COMPLETED' || item.status === 'ACTIVE' ? 'text-primary' : 
                     (item.status === 'CANCELLED' || item.status === 'OUT_OF_STOCK' ? 'text-red-500' : 'text-foreground');

  return (
    <tr className="group hover:bg-muted/40 transition-all duration-300 border-b border-border last:border-0">
      <td className="p-6 border-r border-border">
        <div className="flex items-center gap-6">
          {item.image && (
            <div className="w-10 h-10 bg-muted border border-border grayscale group-hover:grayscale-0 transition-all duration-700">
              <img src={getImageUrl(item.image)} className="w-full h-full object-cover" alt="" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-black uppercase tracking-wider truncate">{item.name}</span>
            <span className="text-[8px] font-mono text-muted-foreground tracking-widest uppercase">
              {item.subtitle || `SYS_UID_${formattedId}`}
            </span>
          </div>
        </div>
      </td>

      {extraColumns.map((val, idx) => (
        <td key={idx} className="p-6 text-center font-mono text-[11px] border-r border-border text-foreground uppercase tracking-widest">
          {val || "---"}
        </td>
      ))}

      <td className="p-6 text-center border-r border-border">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[10px] font-black uppercase tracking-tighter ${statusColor}`}>
            {item.status || "UNKNOWN"}
          </span>
          <div className={`h-2px w-8 ${item.active ? 'bg-primary' : 'bg-border'}`} />
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
                className="p-2.5 bg-secondary/50 border border-border hover:bg-foreground hover:text-background transition-all"
              >
                <Edit3 size={14} strokeWidth={3} />
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
            <button className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2.5 bg-foreground text-background hover:bg-primary transition-all">
              <Eye size={12} /> Inspect
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}