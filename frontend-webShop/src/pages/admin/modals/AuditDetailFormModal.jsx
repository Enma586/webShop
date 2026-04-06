import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { UniversalModal } from "@/components/Shared/Modals/UniversalModal";
import { FormSection } from "@/components/Shared/Form";
import { useFormatter } from "@/hooks/useFormatter";
import { User, Clock, Database, ArrowRight, ShieldAlert } from "lucide-react";

function PriceChangeRow({ before, after }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 bg-primary/5 border border-primary/20">
      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest w-24">Price Change</span>
      <span className="text-xs font-mono text-muted-foreground line-through decoration-red-500/60">${Number(before).toFixed(2)}</span>
      <ArrowRight size={12} className="text-primary" />
      <span className="text-xs font-mono text-primary font-bold">${Number(after).toFixed(2)}</span>
    </div>
  );
}

export default function AuditDetailModal({ isOpen, onClose, logId, source }) {
  const { productLogs, inventoryLogs } = useAdmin();
  const { formatDateLiteral } = useFormatter();
  const [log, setLog] = useState(null);

  useEffect(() => {
    if (logId && isOpen) {
      const found = source === "inventory" 
        ? inventoryLogs.find(l => l.id === logId) 
        : productLogs.find(l => l.id === logId);
      setLog(found || null);
    }
  }, [logId, isOpen, source, productLogs, inventoryLogs]);

  if (!log) return null;

  const isPriceChange = log.action === "DATA_PATCH_EXECUTED" && log.old_price !== log.new_price;

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title={`AUDIT LOG #${log.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="p-8 space-y-8 bg-background">
        <section className="space-y-6">
          <FormSection number="01" title="EVENT DETAILS" />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Database size={10}/> Asset</label>
              <p className="text-sm font-black uppercase italic">{log.product?.name || log.slug || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Clock size={10}/> Timestamp</label>
              <p className="text-sm font-black uppercase italic">{formatDateLiteral(log.created_at)}</p>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-[9px] font-black text-muted-foreground uppercase block mb-2">Action Executed</label>
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {log.action?.replace(/_/g, " ")}
            </span>
          </div>
        </section>

        {isPriceChange && (
          <section className="space-y-4">
            <FormSection number="02" title="FINANCIAL DATA PATCH" />
            <PriceChangeRow before={log.old_price} after={log.new_price} />
          </section>
        )}

        <section className="space-y-4">
          <FormSection number={isPriceChange ? "03" : "02"} title="OPERATOR" />
          <div className="flex items-center gap-4 p-4 border border-border bg-muted/5">
            <div className="size-10 bg-primary/10 flex items-center justify-center border border-primary/20">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-black uppercase">{log.user?.username || "SYSTEM"}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{log.user?.email || "internal@system.sh"}</p>
            </div>
          </div>
        </section>

        <div className="pt-4 flex items-center gap-2 opacity-40">
          <ShieldAlert size={12} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Authentic Historic Record - Immutable</span>
        </div>
      </div>
    </UniversalModal>
  );
}