export const FormFooter = ({ loading, commitText = "EXECUTE PATCH", isEdit = false }) => (
  <div className="col-span-12 flex border-t border-border h-20">
    <button 
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] bg-foreground text-background hover:bg-primary hover:text-white disabled:opacity-50 outline-none"
    >
      {loading ? "SYNCING..." : (isEdit ? commitText : "COMMIT ENTRY")}
    </button>
  </div>
);