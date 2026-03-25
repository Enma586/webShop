import { Edit3, Trash2, Eye } from "lucide-react";

export function UniversalRow({ item, onDelete, onEdit, isAdmin }) {
  const formattedId = item.id ? item.id.toString().padStart(4, '0') : "0000";

  // Lógica de detección de Stock (Mantenemos tu lógica de Regex)
  const numericMatch = item.status && typeof item.status === 'string' 
    ? item.status.match(/\d+/) 
    : null;
  const hasStockValue = numericMatch !== null;
  const stockCount = hasStockValue ? parseInt(numericMatch[0]) : null;
  
  // CRÍTICO: Aseguramos que detecte el 0 correctamente
  const isOutOfStock = hasStockValue && stockCount === 0;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  const imageUrl = getImageUrl(item.image);

  return (
    <tr className="group hover:bg-muted/40 transition-all duration-300 border-b border-border last:border-0">
      <td className="p-6 border-r border-border">
        <div className="flex items-center gap-6">
          {imageUrl && (
            <div className="w-12 h-12 bg-muted border border-border overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shrink-0">
              <img src={imageUrl} className="w-full h-full object-cover" alt={item.name} />
            </div>
          )}
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-[13px] font-black uppercase tracking-wider text-foreground truncate">
              {item.name}
            </span>
            <span className="text-[8px] font-mono text-muted-foreground tracking-[0.2em] uppercase">
              SYS_UID_{formattedId}
            </span>
          </div>
        </div>
      </td>

      <td className="p-6 text-center font-mono text-[11px] border-r border-border text-foreground">
        {item.value || "---"}
      </td>

      {/* SECCIÓN DE STOCK: Aquí forzamos el Rojo si es 0 */}
      <td className="p-6 text-center border-r border-border">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors
            ${isOutOfStock ? 'text-red-600 dark:text-red-500' : 'text-foreground'}`}>
            {item.status || "UNKNOWN"}
          </span>
          <div className={`h-2px transition-all duration-500 
            ${isOutOfStock ? 'bg-red-600 w-12' : 'bg-primary w-8'}`} 
          />
        </div>
      </td>

      <td className="p-6 text-right">
        <div className="flex justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
          {isAdmin ? (
            <>
              {/* EDIT BUTTON: Fondo sutil, hover Negro (Modo Claro) o Blanco (Modo Oscuro) */}
              <button 
                onClick={() => onEdit(item.id)} 
                className="p-2.5 bg-secondary/50 text-foreground border border-border hover:bg-foreground hover:text-background transition-all active:scale-95"
              >
                <Edit3 size={14} strokeWidth={3} />
              </button>

              {/* DELETE BUTTON: Fondo sutil, hover Rojo Destructivo */}
              <button 
                onClick={() => onDelete(item.id, item.name)} 
                className="p-2.5 bg-secondary/50 text-foreground border border-border hover:bg-red-600 hover:text-white transition-all active:scale-95"
              >
                <Trash2 size={14} strokeWidth={3} />
              </button>
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