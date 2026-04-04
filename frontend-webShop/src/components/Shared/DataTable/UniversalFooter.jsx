import { Clock, Server } from "lucide-react";

export function UniversalFooter({ count, isAdmin }) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <footer className="w-full pt-8 border-t border-border/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/40">
            {isAdmin ? "Total Assets" : "In Collection"}: <span className="text-primary font-mono">{count.toString().padStart(3, '0')}</span>
          </div>
          <div className="h-3 w-px bg-border/30 hidden md:block" />
          <div className="flex items-center gap-2 text-foreground/30">
            <Clock size={10} />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em]">{timestamp}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-foreground/30">
            <Server size={10} />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em]">
              {isAdmin ? "Admin_Terminal_v3" : "Member_Access_v3"}
            </span>
          </div>
          <div className="h-3 w-px bg-border/30" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary">Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
