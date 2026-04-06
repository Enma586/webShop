import { useEffect, useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useFormatter } from "@/hooks/useFormatter";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import AuditDetailModal from "./modals/AuditDetailFormModal";
import { Eye } from "lucide-react";

const AUDIT_FILTER_OPTIONS = [
  { value: "ALL", label: "ALL ACTIONS" },
  { value: "CREATE_SEQUENCE", label: "ONLY CREATE" },
  { value: "DATA_PATCH_EXECUTED", label: "ONLY UPDATE" },
  { value: "PURGE_SEQUENCE_COMPLETE", label: "ONLY DELETE" },
];

const AUDIT_SORT_OPTIONS = [
  { value: "date_desc", key: "NEWEST", label: "NEWEST FIRST" },
  { value: "date_asc", key: "OLDEST", label: "OLDEST FIRST" },
  { value: "action", key: "ACTION", label: "BY ACTION" },
];

export default function AuditPage() {
  const { productLogs, getProductLogs, loading } = useAdmin();
  const { formatDateLiteral, formatCurrency } = useFormatter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeSort, setActiveSort] = useState(null);

  useEffect(() => {
    getProductLogs();
  }, [getProductLogs]);

  const allLogs = useMemo(() => {
    return (Array.isArray(productLogs) ? productLogs : []).map(l => ({ ...l, _source: "product" }));
  }, [productLogs]);

  const filteredLogs = useMemo(() => {
    let data = [...allLogs];

    if (activeFilter !== "ALL") {
      data = data.filter(log => log?.action === activeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(log =>
        log?.product?.name?.toLowerCase().includes(term) ||
        log?.user?.username?.toLowerCase().includes(term) ||
        log?.action?.toLowerCase().includes(term) ||
        log?.slug?.toLowerCase().includes(term) ||
        log?.reason?.toLowerCase().includes(term)
      );
    }

    if (activeSort?.key === "NEWEST") data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    else if (activeSort?.key === "OLDEST") data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    else if (activeSort?.key === "ACTION") data.sort((a, b) => (a.action || "").localeCompare(b.action || ""));

    return data;
  }, [allLogs, searchTerm, activeFilter, activeSort]);

  const mappedData = useMemo(() => {
    return filteredLogs.map(log => {
      const productName = log?.product?.name || log?.slug || "DELETED_RESOURCE";
      const operator = log?.user?.username?.toUpperCase() || "SYSTEM_ROOT";

      let dateDisplay = "N/A";
      try {
        dateDisplay = log?.created_at ? formatDateLiteral(log.created_at) : "N/A";
      } catch (e) {
        dateDisplay = "INVALID DATE";
      }

      const actionLabel = log?.action?.replace(/_/g, " ") || "UNKNOWN";

      let statusBadge = "UNKNOWN";
      let detail = "---";

      if (log._source === "product") {
        statusBadge = log.action === "PURGE_SEQUENCE_COMPLETE" ? "DELETED"
          : log.action === "DATA_PATCH_EXECUTED" ? "UPDATED"
          : log.action === "CREATE_SEQUENCE" ? "CREATED"
          : log.action;

        if (log.action === "DATA_PATCH_EXECUTED") {
          const oldP = log.old_price ?? null;
          const newP = log.new_price ?? null;
          detail = (oldP != null && newP != null && oldP !== newP)
            ? `${formatCurrency(oldP)} -> ${formatCurrency(newP)}`
            : "METADATA_CHANGED";
        } else if (log.action === "PURGE_SEQUENCE_COMPLETE") {
          detail = "PERMANENT_REMOVAL";
        } else {
          detail = log.new_price != null ? formatCurrency(log.new_price) : "N/A";
        }
      } else {
        statusBadge = "UNKNOWN";
        detail = "---";
      }

      return {
        id: log.id,
        name: productName,
        subtitle: `LOG_${log.id}`,
        column1: dateDisplay,
        column2: operator,
        column3: actionLabel,
        status: statusBadge,
        active: !log?.action?.includes("PURGE"),
        _source: log._source,
      };
    });
  }, [filteredLogs, formatCurrency, formatDateLiteral]);

  const handleInspectLog = (id) => {
    setSelectedLogId(id);
    setSelectedSource("product");
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-400 mx-auto pt-16 px-12">
        <UniversalHeader
          title="Audit Logs"
          isAdmin={false}
          onActionClick={getProductLogs}
          onRefresh={getProductLogs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeSort={activeSort}
          onSortClick={(value) => {
            const opt = AUDIT_SORT_OPTIONS.find(o => o.value === value);
            setActiveSort(opt || null);
          }}
          filterOptions={AUDIT_FILTER_OPTIONS}
          sortOptions={AUDIT_SORT_OPTIONS}
        />
      </section>

      <section className="w-full max-w-400 mx-auto px-12 pb-24">
        <UniversalTable
          data={mappedData}
          columns={["Asset", "Time", "Operator", "Action", "Status", "Inspect"]}
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
          setSelectedSource(null);
        }}
        logId={selectedLogId}
        source={selectedSource}
      />
    </div>
  );
}
