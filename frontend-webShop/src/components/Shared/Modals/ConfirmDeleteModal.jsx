export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName, title = "Confirm Deletion" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background border border-border p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-6">
            <span className="text-red-500 text-3xl font-bold">!</span>
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tighter uppercase">{title}</h3>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            You are about to permanently remove <span className="text-foreground font-bold">{itemName}</span> from the core database.
          </p>
        </div>
        
        <div className="mt-10 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 font-bold text-xs tracking-widest transition-all uppercase"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-xs tracking-widest shadow-lg shadow-red-600/20 transition-all uppercase"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}