import { Database } from "lucide-react";
import { UniversalRow } from "./UniversalRow";

export function UniversalTable({ 
  data = [], 
  columns = ["Resource", "Value", "Status", "Execute"], 
  onDelete, 
  onEdit, 
  isAdmin = false 
}) {
  return (
    <div className="w-full bg-background border border-border rounded-none shadow-none overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed md:table-auto">
          <thead>
            {/* Cabecera con un fondo sutil para diferenciarla */}
            <tr className="bg-muted/5 border-b border-border">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`p-6 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/60
                    ${index !== columns.length - 1 ? "border-r border-border" : ""} 
                    ${index === 0 ? "w-[40%]" : "text-center"} 
                    ${index === columns.length - 1 ? "text-right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Cuerpo de la tabla con líneas de separación horizontales */}
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((item) => (
                <UniversalRow 
                  key={item.id} 
                  item={item} 
                  onDelete={onDelete} 
                  onEdit={onEdit} 
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-40 text-center">
                  <div className="flex flex-col items-center justify-center opacity-20 text-foreground">
                    <Database className="mb-4" size={48} strokeWidth={1} />
                    <p className="text-[11px] font-black uppercase tracking-[1em]">Void_Database</p>
                    <span className="text-[9px] font-mono tracking-widest mt-2 uppercase">System_Standby</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}