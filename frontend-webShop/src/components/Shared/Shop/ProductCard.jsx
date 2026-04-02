import { useCart } from "@/context/CartContext";
import { useFormatter } from "@/hooks/useFormatter";
import { ShoppingCart, Eye, Box, Plus } from "lucide-react";
import {useAuth} from '@/context/AuthContext'
import {useNavigate} from 'react-router-dom'

export const ProductCard = ({ product }) => {
  const { addToCart, openCart } = useCart();
  const { formatCurrency } = useFormatter();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuickAdd = (e) => {
e.stopPropagation();
    if (!isAuthenticated) {
        navigate("/login");
        return;
    }
    addToCart(product, 1);
    openCart();
  };

  return (
    <div className="group relative bg-background border border-border overflow-hidden hover:border-primary transition-colors duration-300">
      <div className="absolute top-4 left-4 z-10">
        <span className={`text-[8px] font-black px-2 py-1 uppercase tracking-widest border ${
          product.stock > 0 ? 'bg-background text-primary border-primary/20' : 'bg-red-500 text-white border-red-500'
        }`}>
          {product.stock > 0 ? `IN STOCK: ${product.stock}` : 'OUT OF STOCK'}
        </span>
      </div>

      <div className="aspect-4/5 bg-muted overflow-hidden relative">
        <img 
          src={product.image ? `http://127.0.0.1:8000/storage/${product.image}` : "/placeholder.png"} 
          alt={product.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
          <button 
            disabled={product.stock <= 0}
            onClick={handleQuickAdd}
            className="p-4 bg-foreground text-background hover:bg-primary hover:text-white disabled:opacity-50 transition-none flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            <Plus size={12} strokeWidth={4} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest leading-tight">
            {product.name?.replace(/_/g, ' ')}
          </h3>
          <span className="text-sm font-black text-primary font-mono">
            {formatCurrency(product.price)}
          </span>
        </div>
        
      </div>
    </div>
  );
};