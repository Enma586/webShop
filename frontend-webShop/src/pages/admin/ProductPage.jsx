import { useEffect, useState, useMemo } from "react";
import { useProduct } from "@/context/ProductContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import ProductFormModal from "./modals/ProductFormModal";
import ConfirmDeleteModal from '@/components/Shared/Modals/ConfirmDeleteModal'

export default function ProductPage() {
  const { products, getProducts, deleteProduct } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => { 
    getProducts(); 
  }, []);

  const processedProducts = useMemo(() => {
    let result = [...(products || [])];

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toString().includes(searchTerm)
      );
    }

    if (filterType === "ACTIVE") result = result.filter(p => Number(p.stock) > 0);
    if (filterType === "OUT_OF_STOCK") result = result.filter(p => Number(p.stock) <= 0);

    if (sortConfig) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'price') { aVal = parseFloat(aVal); bVal = parseFloat(bVal); }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, searchTerm, filterType, sortConfig]);

  const mappedData = useMemo(() => {
    return processedProducts.map(p => ({
      id: p.id,
      name: p.name,
      value: `$${parseFloat(p.price).toFixed(2)}`, 
      status: `${p.stock} UNITS`,                 
      image: p.image,
      active: Number(p.stock) > 0,                        
    }));
  }, [processedProducts]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  // FUNCIONES DE BORRADO
  const openDeleteModal = (id) => {
    const product = products.find(p => p.id === id);
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-1600px mx-auto pt-12 md:pt-16 px-8 md:px-12">
        <UniversalHeader 
          title="Inventory" 
          subtitle="CORE_ASSET_MANAGEMENT // V3.0"
          isAdmin={true}
          onActionClick={() => setIsModalOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onFilterChange={setFilterType}
          onSortClick={handleSort}
          activeSort={sortConfig}
        />
      </section>

      <section className="w-full max-w-1600px mx-auto px-8 md:px-12 pb-24">
        <UniversalTable 
          data={mappedData} 
          columns={["Resource_Detail", "Unit_Value", "Stock_Level", "Execute"]} 
          isAdmin={true} 
          onDelete={openDeleteModal} 
          onEdit={(id) => { setSelectedProductId(id); setIsModalOpen(true); }} 
        />
      </section>

      <footer className="w-full border-t border-border bg-muted/5 py-10 mt-auto px-12">
        <UniversalFooter count={mappedData.length} isAdmin={true} />
      </footer>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        productId={selectedProductId} 
      />
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={productToDelete?.name}
      />


    </div>
  );
}