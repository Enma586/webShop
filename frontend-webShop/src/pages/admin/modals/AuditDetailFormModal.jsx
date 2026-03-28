import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { UniversalModal } from "@/components/Shared/Modals/UniversalModal";
import { FormSection } from "@/components/Shared/Form";
import { useFormatter } from "@/hooks/useFormatter";
import { 
  ShieldAlert, 
  User, 
  Database, 
  Clock, 
  ArrowRight, 
  Terminal, 
  Activity,
  History
} from "lucide-react";

export default function AuditDetailModal({ isOpen, onClose, logId }) {
  const { productLogs } = useAdmin();
  const { formatDateLiteral, formatCurrency } = useFormatter();
  const [log, setLog] = useState(null);

  useEffect(() => {
    if (logId && isOpen) {
      const found = productLogs.find(l => l.id === logId);
      setLog(found);
    } else if (!isOpen) setLog(null);
  }, [logId, isOpen, productLogs]);

  if (!log && isOpen) return null;

  const rawData = log?.old_data ? (typeof log.old_data === 'string' ? JSON.parse(log.old_data) : log.old_data) : null;

  return (
    <UniversalModal 
      isOpen={isOpen} onClose={onClose} 
      title={`LOG.INSPECTION_ID_${log?.id}`}
      subtitle={`SYSTEM_SNAPSHOT_FOR_RECORD_${logId}`}
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-background">
        
        {/* Columna Izquierda: Información del Evento */}
        <div className="lg:col-span-7 p-8 md:p-12 border-r border-border space-y-10">
          <div>
            <FormSection number="01" title="EVENT_IDENTIFICATION" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-widest">
                  <Database size={12}/> Asset_Name
                </label>
                <p className="text-sm font-black uppercase italic">{log?.product?.name || log?.slug || "RECURSO_ELIMINADO"}</p>
                <p className="text-[10px] text-primary font-mono font-bold tracking-tighter">REF_ID: {log?.product_id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-widest">
                  <Clock size={12}/> Temporal_Stamp
                </label>
                <p className="text-sm font-black uppercase italic">{formatDateLiteral(log?.created_at)}</p>
                <p className="text-[10px] text-muted-foreground font-mono">UTC: {log?.created_at}</p>
              </div>
            </div>
          </div>

          <div>
            <FormSection number="02" title="DELTA_SHIFT_ANALYSIS" />
            <div className="mt-6 p-6 border-2 border-primary/20 bg-primary/5 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase">Previous_Value</p>
                  <p className="text-2xl font-black text-muted-foreground line-through decoration-1">{formatCurrency(log?.old_price)}</p>
                </div>
                <ArrowRight className="text-primary" size={24} />
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-primary uppercase">Post_Commit_Value</p>
                  <p className="text-2xl font-black text-primary italic underline underline-offset-8 decoration-4">{formatCurrency(log?.new_price)}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <FormSection number="03" title="RESPONSIBLE_ENTITY" />
            <div className="flex items-center gap-6 mt-6 p-6 border border-border bg-muted/5">
              <div className="size-12 bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">Authorized_Operator</p>
                <p className="text-sm font-black uppercase">{log?.user?.username || "SYSTEM_ROOT"}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{log?.user?.email || "internal_task@domain.sv"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Metadatos y Acción */}
        <div className="lg:col-span-5 p-8 md:p-12 bg-muted/10 space-y-10">
          <div>
            <FormSection number="04" title="SYSTEM_PROTOCOL_ACTION" />
            <div className="space-y-6 mt-6">
              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 italic">
                  <Activity size={12}/> Protocol_Type
                </label>
                <div className="p-4 border border-primary/30 bg-primary/10 text-xs font-black uppercase text-primary tracking-widest italic">
                  {log?.action?.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 italic">
                  <Terminal size={12}/> Raw_Data_Snapshot
                </label>
                <div className="p-4 bg-black border border-primary/10 font-mono text-[9px] text-primary/80 overflow-y-auto max-h-62.5 custom-scrollbar">
                  {rawData ? (
                    <pre className="whitespace-pre-wrap break-all leading-tight">
                      {JSON.stringify(rawData, null, 2)}
                    </pre>
                  ) : (
                    <p className="italic opacity-50 text-center py-4">NO_METADATA_AVAILABLE</p>
                  )}
                </div>
              </div>

              <div className="mt-8 p-4 border border-primary/20 bg-primary/5 flex items-center gap-3">
                <ShieldAlert className="text-primary size-5" />
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Integrity_Seal_Active</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Non-Editable Historic Record</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="col-span-12 flex items-center justify-center border-t border-border h-20">
          <button onClick={onClose} className="w-full h-full font-black uppercase tracking-[0.3em] text-[11px] text-muted-foreground hover:bg-muted transition-none">
            EXIT_INSPECTION_TERMINAL
          </button>
        </div>
      </div>
    </UniversalModal>
  );
}