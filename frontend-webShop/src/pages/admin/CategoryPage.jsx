import { useEffect, useState, useMemo } from "react";
import { useCategory } from "@/context/CategoryContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import CategoryFormModal from "./modals/CategoryFormModal";
import ConfirmDeleteModal from '@/components/Shared/Modals/ConfirmDeleteModal';

const CATEGORY_FILTER_OPTIONS = [
  { value: "ALL", label: "ALL_NODES" },
  { value: "ROOT", label: "ROOT_ONLY" },
  { value: "BRANCH", label: "BRANCH_ONLY" },
];

const CATEGORY_SORT_OPTIONS = [
  { value: "name_asc", key: "NAME_AZ", label: "NAME_A_TO_Z" },
  { value: "name_desc", key: "NAME_ZA", label: "NAME_Z_TO_A" },
];

export default function CategoryPage() {
  const { categories, getCategories, deleteCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeSort, setActiveSort] = useState(null);

  useEffect(() => { getCategories(); }, []);

  const processedCategories = useMemo(() => {
    let result = Array.isArray(categories) ? [...categories] : [];

    if (activeFilter === "ROOT") result = result.filter(c => !c.parent_id);
    if (activeFilter === "BRANCH") result = result.filter(c => !!c.parent_id);

    if (searchTerm) result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeSort?.key === "NAME_AZ") result.sort((a, b) => a.name.localeCompare(b.name));
    if (activeSort?.key === "NAME_ZA") result.sort((a, b) => b.name.localeCompare(a.name));

    return result;
  }, [categories, searchTerm, activeFilter, activeSort]);

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
        <UniversalHeader 
          title="Categories" 
          isAdmin={true} 
          onActionClick={() => setIsModalOpen(true)} 
          onRefresh={getCategories} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeSort={activeSort}
          onSortClick={(value) => {
            const opt = CATEGORY_SORT_OPTIONS.find(o => o.value === value);
            setActiveSort(opt || null);
          }}
          filterOptions={CATEGORY_FILTER_OPTIONS}
          sortOptions={CATEGORY_SORT_OPTIONS}
        />
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
