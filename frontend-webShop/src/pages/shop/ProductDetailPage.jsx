import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductRequest } from "@/api/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useFormatter } from "@/hooks/useFormatter";
import { ShoppingCart, ArrowLeft, Terminal, Package, Tag, Hash, Minus, Plus } from "lucide-react";

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, openCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { formatCurrency } = useFormatter();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await getProductRequest(id);
                setProduct(res.data);
            } catch (error) {
                console.error("PRODUCT FETCH ERROR", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        addToCart(product, quantity);
        openCart();
    };

    if (loading) {
        return (
            <div className="flex flex-col w-full bg-background min-h-screen">
                <div className="w-full max-w-400 mx-auto pt-16 px-12">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 w-48 bg-muted" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="aspect-square bg-muted border border-border" />
                            <div className="space-y-6">
                                <div className="h-12 w-3/4 bg-muted" />
                                <div className="h-8 w-1/4 bg-muted" />
                                <div className="h-40 w-full bg-muted" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col w-full bg-background min-h-screen items-center justify-center gap-6">
                <p className="text-xs font-black uppercase tracking-[0.8em] text-muted-foreground">Product Not Found</p>
                <button onClick={() => navigate(-1)} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full bg-background min-h-screen">
            <section className="w-full max-w-400 mx-auto pt-16 px-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12"
                >
                    <ArrowLeft size={14} />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-32">
                    <div className="aspect-square bg-muted overflow-hidden border border-border relative">
                        <img
                            src={product.image ? `http://127.0.0.1:8000/storage/${product.image}` : "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 z-10">
                            <span className={`text-[8px] font-black px-2 py-1 uppercase tracking-widest border ${
                                product.stock > 0 ? 'bg-background text-primary border-primary/20' : 'bg-red-500 text-white border-red-500'
                            }`}>
                                {product.stock > 0 ? `IN STOCK: ${product.stock}` : 'OUT OF STOCK'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between py-4">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Terminal size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-[0.5em]">
                                        {product.category?.name?.replace(/_/g, ' ') || 'Uncategorized'}
                                    </span>
                                </div>
                                <h1 className="text-5xl font-black uppercase tracking-tighter italic">
                                    {product.name?.replace(/_/g, ' ')}
                                </h1>
                            </div>

                            <div className="text-3xl font-mono font-bold text-primary">
                                {formatCurrency(product.price)}
                            </div>

                            <div className="border-t border-b border-border/40 py-6 space-y-4">
                                {product.description && (
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {product.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Hash size={12} />
                                        <span>ID: {product.id}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Package size={12} />
                                        <span>Stock: {product.stock}</span>
                                    </div>
                                    {product.category?.slug && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Tag size={12} />
                                            <span>{product.category.slug}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-8">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Qty</span>
                                <div className="flex items-center border border-border">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-3 hover:bg-muted transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="px-6 py-3 font-mono font-bold text-sm border-x border-border min-w-[3rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        disabled={quantity >= product.stock}
                                        className="p-3 hover:bg-muted transition-colors disabled:opacity-30"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={product.stock <= 0}
                                onClick={handleAddToCart}
                                className="w-full py-4 bg-foreground text-background hover:bg-primary hover:text-white disabled:opacity-50 transition-none flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest"
                            >
                                <ShoppingCart size={16} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
