import { useEffect, useState, useMemo } from "react";
import { useProduct } from "@/context/ProductContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import ProductFormModal from "./modals/ProductFormModal";
import ConfirmDeleteModal from '@/components/Shared/Modals/ConfirmDeleteModal';

const PRODUCT_FILTER_OPTIONS = [
  { value: "ALL", label: "ALL_RESOURCES" },
  { value: "ACTIVE", label: "ONLY_ACTIVE" },
  { value: "OUT_OF_STOCK", label: "OUT_OF_STOCK" },
  { value: "LOW_STOCK", label: "LOW_STOCK" },
];

const PRODUCT_SORT_OPTIONS = [
  { value: "name_asc", key: "NAME_AZ", label: "NAME_A_TO_Z" },
  { value: "name_desc", key: "NAME_ZA", label: "NAME_Z_TO_A" },
  { value: "price_asc", key: "VALUE_LOW", label: "VALUE_LOW_HIGH" },
  { value: "price_desc", key: "VALUE_HIGH", label: "VALUE_HIGH_LOW" },
  { value: "stock_asc", key: "VOLUME_LOW", label: "VOLUME_LOW_HIGH" },
  { value: "stock_desc", key: "VOLUME_HIGH", label: "VOLUME_HIGH_LOW" },
];

export default function ProductPage() {
  const { products, getProducts, deleteProduct } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [activeSort, setActiveSort] = useState(null);

  useEffect(() => { getProducts(); }, []);

  const processedProducts = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];
    if (searchTerm) result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === "ACTIVE") result = result.filter(p => p.stock > 0);
    if (filterType === "OUT_OF_STOCK") result = result.filter(p => p.stock <= 0);
    if (filterType === "LOW_STOCK") result = result.filter(p => p.stock > 0 && p.stock <= 10);

    if (activeSort?.key === "NAME_AZ") result.sort((a, b) => a.name.localeCompare(b.name));
    if (activeSort?.key === "NAME_ZA") result.sort((a, b) => b.name.localeCompare(a.name));
    if (activeSort?.key === "VALUE_LOW") result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (activeSort?.key === "VALUE_HIGH") result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    if (activeSort?.key === "VOLUME_LOW") result.sort((a, b) => a.stock - b.stock);
    if (activeSort?.key === "VOLUME_HIGH") result.sort((a, b) => b.stock - a.stock);
    
    return result;
  }, [products, searchTerm, filterType, activeSort]);

  const mappedData = useMemo(() => {
    return processedProducts.map(p => ({
      id: p.id,
      name: p.name,
      subtitle: p.category?.name?.toUpperCase() || "GENERAL_STOCK",
      image: p.image,
      stock: p.stock, 
      column1: `$${parseFloat(p.price).toFixed(2)}`,
      column2: p.stock,
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
          onRefresh={getProducts}
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onFilterChange={setFilterType}
          activeFilter={filterType}
          activeSort={activeSort}
          onSortClick={(value) => {
            const opt = PRODUCT_SORT_OPTIONS.find(o => o.value === value);
            setActiveSort(opt || null);
          }}
          filterOptions={PRODUCT_FILTER_OPTIONS}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </section>

      <section className="w-full max-w-400 mx-auto px-12 pb-24">
        <UniversalTable 
          data={mappedData} 
          columns={["Resource Detail", "Unit Val", "Stock Level", "Status", "Execute"]} 
          isAdmin={true} 
          showDelete={true}
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
