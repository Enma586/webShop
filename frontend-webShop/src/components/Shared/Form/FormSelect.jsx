export const FormSelect = ({ label, icon: Icon, children, ...props }) => (
  <div className="grid gap-2 text-left w-full">
    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
      {Icon && <Icon size={12} />} {label}
    </label>
    <div className="relative">
      <select 
        {...props}
        className="bg-background border border-border p-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-primary cursor-pointer text-foreground appearance-none w-full disabled:opacity-50 transition-none"
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
        ▼
      </div>
    </div>
  </div>
);