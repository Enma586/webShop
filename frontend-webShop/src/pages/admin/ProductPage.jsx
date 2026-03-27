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
    if (filterType === "ACTIVE") result = result.filter(p => p.stock > 0);
    if (filterType === "OUT_OF_STOCK") result = result.filter(p => p.stock <= 0);
    return result;
  }, [products, searchTerm, filterType]);

  const mappedData = useMemo(() => {
    return processedProducts.map(p => ({
      id: p.id,
      name: p.name,
      subtitle: p.category?.name?.toUpperCase() || "GENERAL_STOCK",
      column2: `$${parseFloat(p.price).toFixed(2)}`,
      column3: `${p.stock} UNITS`,
      status: p.stock > 0 ? "IN STOCK" : "DEPLETED",
      image: p.image,
      active: p.stock > 0,
    }));
  }, [processedProducts]);

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-1600px mx-auto pt-16 px-12">
        <UniversalHeader title="Inventory" subtitle="ASSET_LOGS_V3.0" isAdmin={true} onActionClick={() => setIsModalOpen(true)} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFilterChange={setFilterType} />
      </section>
      <section className="w-full max-w-1600px mx-auto px-12 pb-24">
        <UniversalTable data={mappedData} columns={["Resource_Detail", "Unit_Val", "Stock_Level", "Status", "Execute"]} isAdmin={true} onDelete={(id) => { setProductToDelete(products.find(p => p.id === id)); setIsDeleteModalOpen(true); }} onEdit={(id) => { setSelectedProductId(id); setIsModalOpen(true); }} />
      </section>
      <footer className="w-full border-t border-border bg-muted/5 py-10 px-12 mt-auto">
        <UniversalFooter count={mappedData.length} isAdmin={true} />
      </footer>
      <ProductFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedProductId(null); }} productId={selectedProductId} />
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={async () => { await deleteProduct(productToDelete.id); setIsDeleteModalOpen(false); }} itemName={productToDelete?.name} />
    </div>
  );
}