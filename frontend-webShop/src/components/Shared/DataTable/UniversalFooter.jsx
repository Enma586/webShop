export function UniversalFooter({ count, isAdmin }) {
  return (
    <footer className="w-full pt-10 border-t border-border/10 flex justify-between items-center opacity-40">
      <div className="text-[9px] font-black uppercase tracking-[0.4em]">
        {isAdmin ? "Total_Assets_Logged" : "Available_In_Collection"}: <span className="text-primary">{count}</span>
      </div>
      <div className="flex gap-6">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em]">{isAdmin ? "Admin_Terminal_v3" : "Member_Access_v3"}</span>
        <div className="h-3 w-1px bg-border" />
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary">Status: Operational</span>
      </div>
    </footer>
  );
}