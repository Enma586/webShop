import { useEffect, useState, useMemo } from "react";
import { useCategory } from "@/context/CategoryContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import CategoryFormModal from "./modals/CategoryFormModal";
import ConfirmDeleteModal from '@/components/Shared/Modals/ConfirmDeleteModal';

export default function CategoryPage() {
  const { categories, getCategories, deleteCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { getCategories(); }, []);

  const processedCategories = useMemo(() => {
    let result = Array.isArray(categories) ? [...categories] : [];
    if (searchTerm) result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return result;
  }, [categories, searchTerm]);

  const mappedData = useMemo(() => {
    return processedCategories.map(c => ({
      id: c.id,
      name: c.name,
      subtitle: c.parent_id ? "SUB_NODE" : "ROOT_NODE",
      column2: `/${c.slug}`,
      column3: c.parent?.name?.toUpperCase() || "PRIMARY",
      status: c.parent_id ? "BRANCH" : "MAIN",
      active: true,
    }));
  }, [processedCategories]);

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-1600px mx-auto pt-16 px-12">
        <UniversalHeader title="Categories" isAdmin={true} onActionClick={() => setIsModalOpen(true)} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </section>
      <section className="w-full max-w-1600px mx-auto px-12 pb-24">
        <UniversalTable data={mappedData} columns={["Category Name", "Slug Path", "Parent Node", "Type", "Execute"]} isAdmin={true} onDelete={(id) => { setCategoryToDelete(categories.find(c => c.id === id)); setIsDeleteModalOpen(true); }} onEdit={(id) => { setSelectedCategoryId(id); setIsModalOpen(true); }} />
      </section>
      <footer className="w-full border-t border-border bg-muted/5 py-10 px-12 mt-auto">
        <UniversalFooter count={mappedData.length} isAdmin={true} />
      </footer>
      <CategoryFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedCategoryId(null); }} categoryId={selectedCategoryId} />
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={async () => { await deleteCategory(categoryToDelete.id); setIsDeleteModalOpen(false); }} itemName={categoryToDelete?.name} />
    </div>
  );
}