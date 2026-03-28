import { useCart } from "@/context/CartContext";
import { useFormatter } from "@/hooks/useFormatter";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export const SideCart = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { formatCurrency } = useFormatter();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeCart} />
      <div className="relative w-full max-w-md bg-background border-l border-border h-full flex flex-col shadow-2xl">
        
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/5">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 text-foreground">
              <ShoppingBag size={14} className="text-primary" />
              CART TERMINAL V1
            </h2>
            <p className="text-[10px] text-muted-foreground font-mono mt-1 italic uppercase tracking-widest">
              ITEMS IN MANIFEST: {cartCount.toString().padStart(2, '0')}
            </p>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-primary hover:text-white border border-transparent transition-none">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="group relative flex gap-4 border border-border p-4 bg-muted/5 hover:bg-muted/10 transition-none">
              <div className="size-20 bg-muted border border-border overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                <img src={item.image ? `http://127.0.0.1:8000/storage/${item.image}` : "/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase leading-tight">{item.name?.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] font-mono text-primary font-bold">{formatCurrency(item.price)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500 transition-none"><Trash2 size={14} /></button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-border bg-background">
                    <button onClick={() => updateQuantity(item.id, 'dec')} className="p-1.5 hover:bg-muted border-r border-border transition-none"><Minus size={12} /></button>
                    <span className="px-3 text-[10px] font-black font-mono">{item.quantity.toString().padStart(2, '0')}</span>
                    <button onClick={() => updateQuantity(item.id, 'inc')} className="p-1.5 hover:bg-muted border-l border-border transition-none"><Plus size={12} /></button>
                  </div>
                  <p className="text-[11px] font-black text-foreground/80">SUM: {formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-border bg-muted/5 space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">GROSS INVOICED VALUE</span>
            <span className="text-xl font-black text-primary tracking-tighter">{formatCurrency(cartTotal)}</span>
          </div>
          <button 
            onClick={() => { closeCart(); navigate("/checkout"); }}
            className="w-full h-16 bg-foreground text-background flex items-center justify-between px-8 hover:bg-primary hover:text-white transition-none outline-none group"
          >
            <span className="text-xs font-black uppercase tracking-[0.4em]">EXECUTE CHECKOUT</span>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};