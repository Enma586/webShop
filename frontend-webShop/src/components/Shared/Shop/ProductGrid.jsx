import { useEffect, useState } from "react";
import { getProductsRequest } from "@/api/products";
import { ProductCard } from "./ProductCard";
import { Terminal } from "lucide-react";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsRequest();
        setProducts(res.data);
      } catch (error) {
        console.error("CATALOG FETCH ERROR", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="w-full h-[60vh] flex items-center justify-center animate-pulse">
      <p className="text-[10px] font-black uppercase tracking-[1em]">Loading Catalog...</p>
    </div>
  );

  return (
    <section className="w-full max-w-400 mx-auto px-12 py-20">
      {/* Header del Catálogo */}
      <div className="flex flex-col mb-16 space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <Terminal size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Catalog V1.0</span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
          Available Assets
        </h1>
        <div className="h-px w-full bg-border relative">
          <div className="absolute top-0 left-0 h-px w-32 bg-primary" />
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}