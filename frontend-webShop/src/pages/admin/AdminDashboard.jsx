import { useEffect, useState } from "react";
import { useInvoice } from "@/context/InvoiceContext"; // Verifica que el path sea correcto
import { useAuth } from "@/context/AuthContext";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { 
  DateRangePicker, 
  MetricCards, 
  RevenueStream, 
  TransactionList 
} from "@/components/Shared/Daashboard/DashboardCards";
import { Loader2, Terminal, RefreshCcw, DownloadCloud } from "lucide-react";

export default function AdminDashboard() {
  // SOLUCIÓN AL ERROR: Usamos fetchInvoices que es el nombre real en tu Provider
  const { invoices = [], fetchInvoices, loading } = useInvoice();
  const { user } = useAuth();
  
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Hook que procesa los datos para los gráficos y métricas
  const stats = useDashboardStats(invoices, dateRange);

  // EFECTO DE CARGA: Línea 16 corregida
  useEffect(() => { 
    if (user?.role && typeof fetchInvoices === 'function') {
      fetchInvoices(user.role); 
    }
  }, [user, fetchInvoices]);

  const handleManualRefresh = () => {
    if (user?.role) fetchInvoices(user.role);
  };

  const exportCSV = () => {
    if (!stats.filtered?.length) return;
    const headers = "INVOICE,CLIENT,DATE,TOTAL\n";
    const rows = stats.filtered.map(inv => (
      `${inv.invoice_number},${inv.user?.name || 'N/A'},${inv.created_at.split('T')[0]},${inv.total}`
    )).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `REVENUE_REPORT_${dateRange.from}_TO_${dateRange.to}.csv`;
    link.click();
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary gap-4">
        <Loader2 className="animate-spin" size={40} />
        <span className="font-black uppercase text-[10px] tracking-[0.5em]">Syncing_Financial_Node...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      
      {/* HEADER SECTION */}
      <section className="w-full max-w-400 mx-auto pt-16 px-12">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-border/40 pb-12 gap-8">
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,255,65,0.3)]" />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary/50">
                <Terminal size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Status: Operational</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                Analytics <span className="text-primary/40">Terminal</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <DateRangePicker range={dateRange} setRange={setDateRange} />
            <div className="flex gap-2">
              <button 
                onClick={handleManualRefresh}
                className="h-10 w-10 border border-border flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                title="REFRESH_DATA"
              >
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              </button>
              <button 
                onClick={exportCSV} 
                className="h-10 bg-primary text-black font-black text-[9px] uppercase tracking-[0.2em] px-6 hover:bg-white transition-all flex items-center gap-2"
              >
                <DownloadCloud size={16} />
                Export_Logs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC CARDS */}
      <div className="w-full max-w-400 mx-auto px-12 mt-10">
        <MetricCards 
          total={stats.totalRevenue || 0} 
          topAssets={stats.topAssets || []} 
        />
      </div>

      {/* ANALYTICS GRID */}
      <section className="w-full max-w-400 mx-auto px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* GRÁFICA: Solo carga si hay datos procesados */}
        <div className="lg:col-span-2 min-h-450px">
          {stats.chartData?.length > 0 ? (
            <RevenueStream data={stats.chartData} />
          ) : (
            <div className="h-full w-full border border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center opacity-30">
              <Terminal size={40} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting_Data_Stream...</p>
            </div>
          )}
        </div>

        {/* LISTADO DE TRANSACCIONES */}
        <div className="lg:col-span-1">
          <TransactionList items={stats.filtered || []} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-border/40 bg-secondary/5 py-10 px-12 mt-auto">
        <UniversalFooter count={stats.filtered?.length || 0} isAdmin={true} />
      </footer>
    </div>
  );
}