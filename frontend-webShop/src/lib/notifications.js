import { toast } from "sonner";

const baseStyle = {
  background: 'rgba(10, 10, 12, 0.95)', 
  backdropFilter: 'blur(8px)',         
  borderRadius: '12px',                
  padding: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)', 
};

export const notify = {
  success: (title, desc = "") => {
    console.log("!!! DISPARANDO NOTIFICACIÓN DE ÉXITO !!!"); // 👈 AÑADE ESTO
    toast.success(title.toUpperCase(), {
      description: desc ? desc.toUpperCase() : null,
      style: { ...baseStyle, borderBottom: '2px solid #10b981' }, 
      className: "group !bg-[#0c0c0e] !text-white border-none shadow-2xl shadow-emerald-900/20",
    });
  },
  
  error: (title, desc = "") => {
    toast.error(title.toUpperCase(), {
      description: desc ? desc.toUpperCase() : null,
      style: { ...baseStyle, borderBottom: '2px solid #ef4444' }, 
      className: "group !bg-[#0c0c0e] !text-white border-none shadow-2xl shadow-red-900/20",
    });
  }
};