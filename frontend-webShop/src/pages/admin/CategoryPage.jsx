import { useEffect, useState, useMemo } from "react";
import { useCategory } from "@/context/CategoryContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import CategoryFormModal from "./modals/CategoryFormModal";
import ConfirmDeleteModal from '@/components/Shared/Modals/ConfirmDeleteModal';

export default function CategoryPage() {
  // Corregido: deleteCategory en singular para que coincida con tu Provider
  const { categories, getCategories, deleteCategory } = useCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  const processedCategories = useMemo(() => {
    let result = [...(categories || [])];

    if (searchTerm) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toString().includes(searchTerm)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [categories, searchTerm, sortConfig]);

 const mappedData = useMemo(() => {
  return processedCategories.map(c => {
    // Buscamos si tiene padre y extraemos el nombre
    const parentName = c.parent ? c.parent.name : "ROOT_LEVEL";
    const isSub = !!c.parent_id;

    return {
      id: c.id,
      name: c.name,
      // URL_Slug: Si es sub, le damos un estilo visual de "rama"
      value: isSub ? `↳ /${c.slug}` : `/${c.slug}`,
      // Status: Aquí mostramos la jerarquía real
      status: isSub ? `BELONGS TO: ${parentName.toUpperCase()}` : "MAIN COLLECTION",
      active: true,
    };
  });
}, [processedCategories]);
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
  };

  const openDeleteModal = (id) => {
    const category = categories.find(c => c.id === id);
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      // Corregido: Llamada a la función correcta del contexto
      await deleteCategory(categoryToDelete.id);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-1600px mx-auto pt-12 md:pt-16 px-8 md:px-12">
        <UniversalHeader
          title="Categories"
          subtitle="CLASSIFICATION_LOGS // V1.0"
          isAdmin={true}
          onActionClick={() => setIsModalOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSortClick={handleSort}
          activeSort={sortConfig}
        />
      </section>

      <section className="w-full max-w-1600px mx-auto px-8 md:px-12 pb-24">
        <UniversalTable
          data={mappedData}
          // Ajustamos los nombres de las columnas para que tengan sentido con categorías
          columns={["Category", "Slug", "Description", "Execute"]}
          isAdmin={true}
          onDelete={openDeleteModal}
          onEdit={(id) => {
            setSelectedCategoryId(id);
            setIsModalOpen(true);
          }}
        />
      </section>

      <footer className="w-full border-t border-border bg-muted/5 py-10 mt-auto px-12">
        <UniversalFooter count={mappedData.length} isAdmin={true} />
      </footer>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        categoryId={selectedCategoryId}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={categoryToDelete?.name}
      />
    </div>
  );
}