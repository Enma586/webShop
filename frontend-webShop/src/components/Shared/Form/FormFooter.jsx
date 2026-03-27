export const FormFooter = ({ onAbort, loading, abortText = "ABORT_PATCH", commitText = "EXECUTE_PATCH", isEdit = false }) => (
  <div className="col-span-12 grid grid-cols-2 border-t border-border h-20">
    <button 
      type="button" 
      onClick={onAbort}
      disabled={loading}
      className="flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] border-r border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-none disabled:opacity-50"
    >
      {abortText}
    </button>
    <button 
      type="submit"
      disabled={loading}
      className="flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] bg-foreground text-background hover:bg-primary hover:text-white transition-none disabled:opacity-50"
    >
      {loading ? "SYNCING..." : (isEdit ? commitText : "COMMIT_ENTRY")}
    </button>
  </div>
);