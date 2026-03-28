import { useCart } from "@/context/CartContext";
import { useFormatter } from "@/hooks/useFormatter";
import { ShoppingCart, Eye, Plus } from "lucide-react";
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const ProductCard = ({ product }) => {
  const { cart, addToCart, openCart } = useCart();
  const { formatCurrency } = useFormatter();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const cartItem = cart.find(item => item.id === product.id);
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0 || currentQtyInCart >= product.stock;

  // URL base de las imágenes en Laravel
  const BASE_URL = "http://127.0.0.1:8000/storage/";
  
  // Imagen de respaldo (puedes usar una URL externa si no tienes el archivo local)
  const FALLBACK_IMAGE = "https://placehold.co/400x500/101010/FFFFFF/png?text=NO+IMAGE";

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate("/login");
    if (isOutOfStock) return;
    addToCart(product, 1);
    openCart();
  };

  return (
    <div className="group relative bg-background border border-border overflow-hidden hover:border-primary transition-colors duration-300">
      <div className="absolute top-4 left-4 z-10">
        <span className={`text-[8px] font-black px-2 py-1 uppercase tracking-widest border ${
          !isOutOfStock ? 'bg-background text-primary border-primary/20' : 'bg-red-500 text-white border-red-500'
        }`}>
          {!isOutOfStock ? `IN STOCK: ${product.stock - currentQtyInCart}` : 'OUT OF STOCK'}
        </span>
      </div>

      <div className="aspect-4/5 bg-muted overflow-hidden relative">
        <img 
          src={product.image ? `${BASE_URL}${product.image}` : FALLBACK_IMAGE} 
          alt={product.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
          <button 
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className="p-4 bg-foreground text-background hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-none flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            <Plus size={12} strokeWidth={4} />
          </button>
          <button className="p-4 bg-background border border-border text-foreground hover:bg-foreground hover:text-background transition-none">
            <Eye size={20} />
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