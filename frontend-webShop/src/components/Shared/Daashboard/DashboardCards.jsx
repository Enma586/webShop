import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useFormatter } from "@/hooks/useFormatter";

export const DateRangePicker = ({ range, setRange }) => (
  <div className="flex items-center gap-2 bg-muted/5 border border-border p-1">
    <div className="flex items-center px-3 gap-2">
      <span className="text-[9px] font-black uppercase opacity-40">From:</span>
      <input type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} className="bg-transparent text-[10px] font-black uppercase outline-none text-primary cursor-pointer" />
    </div>
    <div className="w-px h-4 bg-border" />
    <div className="flex items-center px-3 gap-2">
      <span className="text-[9px] font-black uppercase opacity-40">To:</span>
      <input type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} className="bg-transparent text-[10px] font-black uppercase outline-none text-primary cursor-pointer" />
    </div>
  </div>
);

export const MetricCards = ({ total, topAssets }) => {
  const { formatCurrency } = useFormatter();
  return (
    <section className="w-full max-w-400 mx-auto px-12 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-card border-l-12 border-primary p-10 shadow-sm border-y border-r">
        <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] block mb-4">Gross_Revenue_Selected</span>
        <h2 className="text-5xl font-black text-foreground tracking-tighter italic">{formatCurrency(total)}</h2>
      </div>
      <div className="md:col-span-2 bg-card border border-border p-10 shadow-sm flex flex-col justify-center">
        <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] block mb-6">Top_Moving_Assets</span>
        <div className="grid grid-cols-3 gap-8">
          {topAssets.map((asset, i) => (
            <div key={i} className="border-l-2 border-primary/20 pl-6">
              <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1 tracking-widest">Rank_0{i+1}</p>
              <p className="text-xs font-black text-foreground uppercase truncate mb-1">{asset.name}</p>
              <p className="text-2xl font-black text-primary italic tracking-tighter">{asset.qty} <span className="text-[10px] not-italic opacity-40 uppercase">Units</span></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const RevenueStream = ({ data }) => (
  <div className="lg:col-span-2 bg-card border border-border p-10 shadow-2xl relative overflow-hidden">
    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-12 border-b border-border pb-6">Revenue_Stream_Dynamic</h3>
    <div className="h-112.5 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="date" fontSize={10} tick={{ fill: 'var(--color-muted-foreground)', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={15} />
          <YAxis fontSize={10} tick={{ fill: 'var(--color-muted-foreground)', fontWeight: 'bold' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '0px', padding: '15px' }} itemStyle={{ color: 'var(--color-primary)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }} />
          <Area type="stepAfter" dataKey="amount" stroke="var(--color-primary)" strokeWidth={5} fill="url(#colorAmount)" animationDuration={2000} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const TransactionList = ({ items }) => {
  const { formatCurrency, formatDateLiteral } = useFormatter();
  return (
    <div className="bg-card border border-border flex flex-col shadow-xl">
      <div className="p-8 border-b border-border bg-muted/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">Filtered_Transactions</h3>
      </div>
      <div className="flex-1 overflow-y-auto max-h-120 custom-scrollbar">
        {items.length > 0 ? items.map((inv, i) => (
          <div key={i} className="p-6 border-b border-border hover:bg-primary/5 transition-all group cursor-default">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-black text-primary uppercase tracking-tighter">{inv.invoice_number}</span>
              <span className="text-[11px] font-black text-foreground tracking-tighter">{formatCurrency(inv.total)}</span>
            </div>
            <p className="text-[11px] font-bold text-foreground uppercase truncate opacity-80">{inv.user?.name || 'SYSTEM_USER'}</p>
            <p className="text-[9px] text-muted-foreground font-bold mt-1 uppercase tracking-widest italic">{formatDateLiteral(inv.created_at)}</p>
          </div>
        )) : <div className="p-12 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">No_Data_In_Range</div>}
      </div>
    </div>
  );
};