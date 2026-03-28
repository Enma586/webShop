import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsRequest } from "@/api/products";
import { ProductCard } from "@/components/Shared/Shop/ProductCard";
import { Terminal, Filter, LayoutGrid } from "lucide-react";

export default function CategoryPageCustomer() {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await getProductsRequest();
                // Filtramos por el slug de la categoría si no es "all"
                const filtered = slug === "all" 
                    ? res.data 
                    : res.data.filter(p => p.category?.slug === slug);
                
                setProducts(filtered);
            } catch (error) {
                console.error("CATEGORY FETCH ERROR", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [slug]);

    return (
        <div className="flex flex-col w-full bg-background min-h-screen">
            {/* Header de Navegación */}
            <section className="w-full max-w-400 mx-auto pt-16 px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-border/40">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Terminal size={14} />
                            <span className="text-[9px] font-black uppercase tracking-[0.5em]">
                                Directory / {slug?.replace(/-/g, ' ')}
                            </span>
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter italic">
                            {slug === "all" ? "Full Catalog" : slug?.replace(/-/g, ' ')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Assets</span>
                            <span className="text-xl font-mono font-bold text-primary">
                                {products.length.toString().padStart(3, '0')}
                            </span>
                        </div>
                        <div className="h-12 w-px bg-border hidden md:block" />
                        <button className="flex items-center gap-3 px-6 py-3 border border-border bg-muted/5 hover:bg-foreground hover:text-background transition-none text-[10px] font-black uppercase tracking-widest">
                            <Filter size={14} /> Refine Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Grid de Productos */}
            <section className="w-full max-w-400 mx-auto px-12 py-16 pb-32">
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="aspect-4/5 bg-muted animate-pulse border border-border" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                        <LayoutGrid size={64} strokeWidth={1} />
                        <p className="text-xs font-black uppercase tracking-[0.8em]">No Assets Found In This Node</p>
                    </div>
                )}
            </section>
        </div>
    );
}