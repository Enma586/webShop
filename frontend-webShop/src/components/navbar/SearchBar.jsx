import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useProduct } from "@/context/ProductContext";

export const SearchBar = ({ className = "" }) => {
  const { products, getProducts } = useProduct();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) {
      getProducts();
    }
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const term = query.toLowerCase().trim();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category?.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
    setResults(filtered.slice(0, 8));
    setIsOpen(true);
  }, [query, products]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/product/${product.id}`);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim().length > 0 && setIsOpen(true)}
        placeholder="Search products..."
        className="h-10 w-full pl-9 pr-3 bg-muted/50 border border-border/40 rounded-none text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/60 shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              No results found
            </div>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 transition-colors text-left border-b border-border/30 last:border-b-0 cursor-pointer"
              >
                <img
                  src={`http://127.0.0.1:8000/storage/${product.image}`}
                  alt={product.name}
                  className="h-10 w-10 object-cover shrink-0 bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {product.name.replace(/_/g, " ")}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    {product.category?.name?.replace(/_/g, " ")}
                  </p>
                </div>
                <span className="text-sm font-black text-primary shrink-0">
                  ${product.price}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
