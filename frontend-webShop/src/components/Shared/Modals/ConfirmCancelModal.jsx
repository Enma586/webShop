export default function ConfirmCancelModal({ isOpen, onClose, onConfirm, orderNumber }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-border p-8 max-w-md w-full relative overflow-hidden">
        {/* Línea decorativa superior estilo terminal */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 bg-red-600/10 mb-6 border border-red-600/20">
            <span className="text-red-600 text-2xl font-black font-mono">!</span>
          </div>
          
          <h3 className="text-xl font-black text-foreground tracking-tighter uppercase italic">
            Abort Order Protocol
          </h3>
          
          <p className="text-muted-foreground mt-4 text-[11px] font-mono leading-relaxed uppercase tracking-tight">
            You are about to terminate order <span className="text-primary font-black">#{orderNumber}</span>. 
            This action will de-authorize the manifest and release reserved assets.
          </p>
        </div>
        
        <div className="mt-10 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 h-12 bg-muted/20 text-muted-foreground border border-border font-black text-[10px] tracking-widest transition-all uppercase hover:bg-muted/40"
          >
            Maintain Order
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 h-12 bg-red-600 text-white font-black text-[10px] tracking-widest shadow-lg shadow-red-600/20 transition-all uppercase hover:bg-red-700"
          >
            Abort Manifest
          </button>
        </div>

        <p className="text-[7px] text-center mt-6 font-mono opacity-30 uppercase tracking-[0.3em]">
          ** System Overwrite: Action is Final **
        </p>
      </div>
    </div>
  );
}