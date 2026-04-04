import { useEffect, useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useFormatter } from "@/hooks/useFormatter";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import AuditDetailModal from "./modals/AuditDetailFormModal";
import { Eye } from "lucide-react";

export default function AuditPage() {
  const { productLogs, getProductLogs, loading } = useAdmin();
  const { formatDateLiteral, formatCurrency } = useFormatter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  useEffect(() => {
    getProductLogs();
  }, [getProductLogs]);

  const filteredLogs = useMemo(() => {
    const data = Array.isArray(productLogs) ? productLogs : [];
    if (!searchTerm) return data;

    return data.filter(log =>
      log?.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log?.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log?.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log?.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productLogs, searchTerm]);

  const mappedData = useMemo(() => {
    return filteredLogs.map(log => {
      const productName = log?.product?.name || log?.slug || "RECURSO_ELIMINADO";
      const operator = log?.user?.username?.toUpperCase() || "SYSTEM_ROOT";
      const actionLabel = (log?.action || "UNKNOWN_ACTION").replace(/_/g, ' ');

      let dateDisplay = "N/A";
      try {
        dateDisplay = log?.created_at ? formatDateLiteral(log.created_at) : "N/A";
      } catch (e) {
        dateDisplay = "INVALID_DATE";
      }

      const oldP = log?.old_price ?? 0;
      const newP = log?.new_price ?? 0;
      
      const priceDelta = oldP !== newP
        ? `${formatCurrency(oldP)}->${formatCurrency(newP)}`
        : "ESTABLE";

      return {
        id: log?.id || Math.random(),
        name: productName,
        subtitle: dateDisplay, 
        column1: dateDisplay,  
        column2: operator,     
        column3: actionLabel,  
        status: priceDelta,    
        active: !log?.action?.includes('PURGE'),
      };
    });
  }, [filteredLogs, formatCurrency, formatDateLiteral]);

  const handleInspectLog = (id) => {
    setSelectedLogId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-400 mx-auto pt-16 px-12">
        <UniversalHeader
          title="Audit Logs"
          subtitle="SECURITY_AUDIT_TRAIL_V3.0"
          isAdmin={false}
          onActionClick={getProductLogs}
          onRefresh={getProductLogs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          actionLabel="REFRESH_SYNC"
        />
      </section>

      <section className="w-full max-w-400 mx-auto px-12 pb-24">
        <UniversalTable
          data={mappedData}
          columns={["Asset", "Time", "Operator", "Action", "Delta", "Inspect"]}
          isAdmin={true}
          loading={loading}
          onEdit={handleInspectLog}
          onDelete={null}
          showDelete={false} 
          editIcon={<Eye size={14} strokeWidth={3} />} 
        />
      </section>

      <footer className="w-full border-t border-border bg-muted/5 py-10 px-12 mt-auto">
        <UniversalFooter count={mappedData.length} isAdmin={true} />
      </footer>

      <AuditDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLogId(null);
        }}
        logId={selectedLogId}
      />
    </div>
  );
}