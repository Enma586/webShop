import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCategory } from "@/context/CategoryContext";
import { UniversalModal } from "@/components/Shared/Modals/UniversalModal";
import { Link as LinkIcon, AlignLeft } from "lucide-react";

export default function CategoryFormModal({ isOpen, onClose, categoryId = null }) {
  const { createCategory, getCategory, updateCategory, categories } = useCategory();
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const categoryName = watch("name");

  useEffect(() => {
    if (categoryName) {
      const generatedSlug = categoryName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true, shouldDirty: true });
    }
  }, [categoryName, setValue]);

  useEffect(() => {
    if (categoryId && isOpen) {
      const loadCategory = async () => {
        try {
          const category = await getCategory(categoryId);
          if (category) {
            Object.keys(category).forEach(key => setValue(key, category[key]));
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadCategory();
    } else if (!isOpen) {
      reset();
    }
  }, [categoryId, isOpen, setValue, reset, getCategory]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      parent_id: data.parent_id === "null" || !data.parent_id ? null : parseInt(data.parent_id)
    };

    try {
      if (categoryId) {
        await updateCategory(categoryId, payload);
      } else {
        await createCategory(payload);
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <UniversalModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={categoryId ? "CORE.UPDATING" : "CORE.MAKING"}
      subtitle={categoryId ? `PATCHING_RESOURCES_AT_UID_${categoryId}` : "INITIALIZING_NEW_ENTRY_SEQUENCE"}
      maxWidth="max-w-6xl"
    >
      <form id="category-form" onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 bg-background">
        
        {/* COLUMNA 01 */}
        <div className="lg:col-span-7 p-8 md:p-12 border-r border-border">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-4 bg-primary" />
            <p className="text-[10px] font-black text-foreground uppercase tracking-[0.5em]">
              01. CORE_DATA_MAPPING
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="grid gap-2 text-left">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Display_Name</label>
              <input 
                {...register("name", { required: true })}
                autoComplete="off"
                className="bg-transparent border border-border p-4 text-sm font-bold uppercase tracking-widest focus:border-primary outline-none text-foreground"
                placeholder="INPUT_NAME_HERE"
              />
            </div>

            <div className="grid gap-2 text-left">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Protocol_Slug</label>
              <div className="relative">
                <input 
                  {...register("slug", { required: true })}
                  className="w-full bg-muted/30 border border-border p-4 text-sm font-mono text-primary outline-none cursor-not-allowed"
                  readOnly
                />
                <LinkIcon className="absolute right-4 top-4 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid gap-2 text-left">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Parent_Dependency</label>
              <select 
                {...register("parent_id")}
                className="bg-background border border-border p-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-primary cursor-pointer text-foreground appearance-none"
              >
                <option value="null">-- NULL_PARENT (ROOT) --</option>
                {categories?.filter(c => !c.parent_id && c.id !== categoryId).map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-background text-foreground">{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* COLUMNA 02 */}
        <div className="lg:col-span-5 p-8 md:p-12 bg-muted/10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-4 bg-primary" />
            <p className="text-[10px] font-black text-foreground uppercase tracking-[0.5em]">
              02. CONTENT_EXTENSIONS
            </p>
          </div>
          
          <div className="grid gap-2 text-left">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <AlignLeft className="size-3" /> Description_Log
            </label>
            <textarea 
              {...register("description")}
              rows={10}
              className="bg-transparent border border-border p-4 text-sm font-medium tracking-wide focus:border-primary outline-none text-foreground/80 resize-none"
              placeholder="OPTIONAL_SYSTEM_DESCRIPTION_INPUT..."
            />
          </div>
        </div>

        {/* ACCIONES INFERIORES */}
        <div className="col-span-12 grid grid-cols-2 border-t border-border h-20">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] border-r border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-none disabled:opacity-50"
          >
            DISCARD_SEQUENCE
          </button>
          
          <button 
            form="category-form"
            type="submit"
            disabled={loading}
            className="flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-none disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : (categoryId ? "EXECUTE_PATCH" : "COMMIT_ENTRY")}
          </button>
        </div>
      </form>
    </UniversalModal>
  );
}