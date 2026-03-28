import { useEffect, useState } from "react";
import { useInvoice } from "@/context/InvoiceContext";
import { useAuth } from "@/context/AuthContext"; // Importante para el rol
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DateRangePicker, MetricCards, RevenueStream, TransactionList } from "@/components/Shared/Daashboard/DashboardCards";

export default function AdminDashboard() {
  // 1. Cambiamos getInvoices por fetchInvoices
  const { invoices, fetchInvoices, loading } = useInvoice();
  const { user } = useAuth();
  
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // 2. Ejecutamos el fetch usando el rol del admin
  useEffect(() => { 
    if (user?.role) {
      fetchInvoices(user.role); 
    }
  }, [user?.role, fetchInvoices]);

  const stats = useDashboardStats(invoices || [], dateRange);

  const exportCSV = () => {
    if (!stats.filtered || stats.filtered.length === 0) return;
    
    const headers = "ID_INVOICE,CLIENT,DATE,TOTAL_USD\n";
    const rows = stats.filtered.map(inv => 
      `${inv.invoice_number},${inv.user?.name || 'GUEST'},${inv.created_at},${inv.total}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LOG_${dateRange.from}_to_${dateRange.to}.csv`;
    link.click();
  };

  // 3. Protección contra nulos antes de renderizar componentes que dependen de stats
  if (loading && (!invoices || invoices.length === 0)) {
    return <div className="flex items-center justify-center min-h-screen bg-background text-primary font-black uppercase text-xs tracking-[0.4em]">Syncing Financial Core...</div>;
  }

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-400 mx-auto pt-16 px-12">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-border pb-12 gap-8">
          <div className="relative pl-6">
            <div className="absolute left-0 top-1 bottom-1 w-2px bg-primary" />
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground leading-none italic">
                Analytics <span className="text-primary/60">System</span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Node: {user?.name} / Role: {user?.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DateRangePicker range={dateRange} setRange={setDateRange} />
            <button 
              onClick={exportCSV} 
              className="h-10 bg-background text-foreground border border-border font-black text-[9px] uppercase tracking-[0.2em] px-6 hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
            >
              Export CSV
            </button>
          </div>
        </div>
      </section>

      {/* Pasamos los datos calculados por el hook de stats */}
      <MetricCards 
        total={stats?.totalRevenue || 0} 
        topAssets={stats?.topAssets || []} 
      />

      <section className="w-full max-w-400 mx-auto px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
           <RevenueStream data={stats?.chartData || []} />
        </div>
        <div className="lg:col-span-1">
           <TransactionList items={stats?.filtered || []} />
        </div>
      </section>

      <footer className="w-full border-t border-border bg-muted/5 py-10 px-12 mt-auto">
        <UniversalFooter count={stats?.filtered?.length || 0} isAdmin={true} />
      </footer>
    </div>
  );
}