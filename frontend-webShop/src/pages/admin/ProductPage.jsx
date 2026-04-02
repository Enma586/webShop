import { useEffect, useState, useMemo } from "react";
import { useProduct } from "@/context/ProductContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import ProductFormModal from "./modals/ProductFormModal";
import ConfirmDeleteModal from '@/components/Shared/Modals/ConfirmDeleteModal';

export default function ProductPage() {
  const { products, getProducts, deleteProduct } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => { getProducts(); }, []);

  const processedProducts = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];
    if (searchTerm) result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtros de stock
    if (filterType === "ACTIVE") result = result.filter(p => p.stock > 0);
    if (filterType === "OUT_OF_STOCK") result = result.filter(p => p.stock <= 0);
    if (filterType === "LOW_STOCK") result = result.filter(p => p.stock > 0 && p.stock <= 10);
    
    return result;
  }, [products, searchTerm, filterType]);

  const mappedData = useMemo(() => {
    return processedProducts.map(p => ({
      id: p.id,
      name: p.name,
      subtitle: p.category?.name?.toUpperCase() || "GENERAL_STOCK",
      image: p.image,
      
      // CLAVE: Pasamos el stock como número puro para que UniversalRow haga la lógica
      stock: p.stock, 
      
      // Columnas visuales de la tabla
      column1: p.name, // La primera columna suele ser el nombre/img en UniversalRow
      column2: `$${parseFloat(p.price).toFixed(2)}`,
      column3: p.stock, // Dejamos solo el número aquí para que se resalte en rojo si es bajo
      
      // Estados para UniversalRow
      status: p.stock === 0 ? "DEPLETED" : (p.stock <= 10 ? "CRITICAL" : "ACTIVE"),
      active: p.stock > 0,
    }));
  }, [processedProducts]);

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-400 mx-auto pt-16 px-12">
        <UniversalHeader 
          title="Inventory" 
          subtitle="ASSET_LOGS_V3.0" 
          isAdmin={true} 
          onActionClick={() => setIsModalOpen(true)} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onFilterChange={setFilterType} 
        />
      </section>

      <section className="w-full max-w-400 mx-auto px-12 pb-24">
        <UniversalTable 
          data={mappedData} 
          columns={["Resource Detail", "Unit Val", "Stock Level", "Status", "Execute"]} 
          isAdmin={true} 
          showDelete={true} // Aseguramos que se pase la prop para ver el botón de borrar
          onDelete={(id) => { 
            const prod = products.find(p => p.id === id);
            setProductToDelete(prod); 
            setIsDeleteModalOpen(true); 
          }} 
          onEdit={(id) => { 
            setSelectedProductId(id); 
            setIsModalOpen(true); 
          }} 
        />
      </section>

      <footer className="w-full border-t border-border bg-muted/5 py-10 px-12 mt-auto">
        <UniversalFooter count={mappedData.length} isAdmin={true} />
      </footer>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedProductId(null); }} 
        productId={selectedProductId} 
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={async () => { 
          await deleteProduct(productToDelete.id); 
          setIsDeleteModalOpen(false); 
        }} 
        itemName={productToDelete?.name} 
      />
    </div>
  );
}