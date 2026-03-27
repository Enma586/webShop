export const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div className="grid gap-2 text-left w-full">
    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
      {Icon && <Icon size={12} />} {label}
    </label>
    <input 
      {...props}
      className="bg-transparent border border-border p-4 text-sm font-bold uppercase tracking-widest focus:border-primary outline-none text-foreground transition-none disabled:opacity-50 disabled:bg-muted/10 disabled:cursor-not-allowed w-full placeholder:text-muted-foreground/30"
    />
    {error && <span className="text-[9px] text-destructive font-bold tracking-tighter">ERROR_SEQUENCE: {error}</span>}
  </div>
);