import { Database } from "lucide-react";
import { UniversalRow } from "./UniversalRow";

export function UniversalTable({ 
  data = [], 
  columns = [], 
  onDelete, 
  onEdit, 
  isAdmin = false,
  showDelete = true,
  editIcon = null 
}) {
  return (
    <div className="w-full bg-background border border-border overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/5 border-b border-border">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`p-6 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/60 border-r border-border last:border-r-0
                    ${index === 0 ? "text-left" : "text-center"} 
                    ${index === columns.length - 1 ? "text-right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((item) => (
                <UniversalRow 
                  key={item.id} 
                  item={item} 
                  onDelete={onDelete} 
                  onEdit={onEdit} 
                  isAdmin={isAdmin}
                  showDelete={showDelete}
                  editIcon={editIcon}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-40 text-center">
                  <div className="flex flex-col items-center justify-center opacity-20 text-foreground">
                    <Database className="mb-4" size={48} strokeWidth={1} />
                    <p className="text-[11px] font-black uppercase tracking-[1em]">Void_Database</p>
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