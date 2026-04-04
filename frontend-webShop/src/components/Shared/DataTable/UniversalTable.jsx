import { Database, Inbox } from "lucide-react";
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
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted/80 backdrop-blur-sm border-b border-border">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`p-5 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/50 border-r border-border/50 last:border-r-0 whitespace-nowrap
                    ${index === 0 ? "text-left pl-6" : "text-center"}
                    ${index === columns.length - 1 ? "text-right pr-6" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, idx) => (
                <UniversalRow
                  key={item.id}
                  item={item}
                  index={idx}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  isAdmin={isAdmin}
                  showDelete={showDelete}
                  editIcon={editIcon}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-6 opacity-15 text-foreground">
                    <div className="relative">
                      <Inbox size={56} strokeWidth={1} />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-border" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-[1em]">No Records</p>
                      <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-foreground/50">Database is empty</p>
                    </div>
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
