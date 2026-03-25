import { X, Cpu } from "lucide-react";
import { useEffect } from "react";

export function UniversalModal({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-6xl" }) {
  
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    /* BACKDROP: 
       - bg-background/80: Se vuelve blanco translúcido en light y negro en dark.
       - backdrop-blur-md: Estética industrial limpia.
    */
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-md p-0 md:p-6">
      
      {/* CONTENEDOR: 
          - bg-background: Blanco en light / Negro en dark.
          - border-border: Gris suave en light / Gris oscuro en dark.
          - shadow-2xl: Vital para que el modal se vea en fondo blanco.
      */}
      <div className={`relative w-full ${maxWidth} h-full md:h-auto md:max-h-[90vh] bg-background flex flex-col border border-border shadow-2xl overflow-hidden`}>
        
        {/* HEADER: bg-muted/30 le da un tono grisáceo sutil al encabezado */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4 text-left">
            <Cpu size={18} className="text-primary" /> 
            <div className="flex flex-col">
              {/* text-foreground: NEGRO en light / BLANCO en dark */}
              <h2 className="text-xl font-black uppercase tracking-[0.2em] leading-none text-foreground italic">
                {title || "System.Process"}
              </h2>
              {/* text-muted-foreground: Gris adaptable */}
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-2">
                {subtitle || "Execution_Mode: Active"}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground outline-none"
          >
            <span className="hidden md:inline">Abort_Process</span>
            {/* El cuadro de la X se invierte: Negro en light / Blanco en dark */}
            <div className="p-1 bg-muted group-hover:bg-foreground group-hover:text-background">
               <X size={18} />
            </div>
          </button>
        </div>

        {/* CUERPO: Hereda text-foreground para que los hijos salgan en negro/blanco */}
        <div className="flex-1 overflow-y-auto custom-scrollbar text-foreground p-0 bg-transparent">
          {children}
        </div>

        <div className="h-1 w-full bg-border/20" />
      </div>
    </div>
  );
}