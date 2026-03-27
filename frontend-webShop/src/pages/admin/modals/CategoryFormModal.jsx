import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCategory } from "@/context/CategoryContext";
import { UniversalModal } from "@/components/Shared/Modals/UniversalModal";
import { Link as LinkIcon, AlignLeft } from "lucide-react";
import { FormInput, FormSelect, FormSection, FormFooter } from "@/components/Shared/Form";

export default function CategoryFormModal({ isOpen, onClose, categoryId = null }) {
  const { createCategory, getCategory, updateCategory, categories } = useCategory();
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const categoryName = watch("name");

  useEffect(() => {
    if (categoryName) {
      const generatedSlug = categoryName.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug);
    }
  }, [categoryName, setValue]);

  useEffect(() => {
    if (categoryId && isOpen) {
      const loadCategory = async () => {
        const category = await getCategory(categoryId);
        if (category) Object.keys(category).forEach(key => setValue(key, category[key]));
      };
      loadCategory();
    } else if (!isOpen) reset();
  }, [categoryId, isOpen, setValue, reset, getCategory]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = { ...data, parent_id: data.parent_id === "null" || !data.parent_id ? null : parseInt(data.parent_id) };
    try {
      categoryId ? await updateCategory(categoryId, payload) : await createCategory(payload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <UniversalModal 
      isOpen={isOpen} onClose={onClose} 
      title={categoryId ? "CORE.UPDATING" : "CORE.MAKING"}
      subtitle={categoryId ? `PATCHING_RESOURCES_AT_UID_${categoryId}` : "INITIALIZING_NEW_ENTRY"}
      maxWidth="max-w-6xl"
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 bg-background">
        <div className="lg:col-span-7 p-8 md:p-12 border-r border-border space-y-8">
          <FormSection number="01" title="CORE_DATA_MAPPING" />
          <FormInput label="Display Name" {...register("name", { required: true })} placeholder="INPUT_NAME_HERE" />
          <FormInput label="Protocol Slug" icon={LinkIcon} {...register("slug")} readOnly className="bg-muted/30 font-mono text-primary cursor-not-allowed w-full p-4 border border-border outline-none" />
          <FormSelect label="Parent Dependency" {...register("parent_id")}>
            <option value="null">-- NULL_PARENT (ROOT) --</option>
            {categories?.filter(c => !c.parent_id && c.id !== categoryId).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </FormSelect>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 bg-muted/10 space-y-8">
          <FormSection number="02" title="CONTENT_EXTENSIONS" />
          <div className="grid gap-2 text-left">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><AlignLeft size={12}/> Description Log</label>
            <textarea {...register("description")} rows={10} className="bg-transparent border border-border p-4 text-sm focus:border-primary outline-none text-foreground resize-none" placeholder="OPTIONAL_SYSTEM_DESCRIPTION..." />
          </div>
        </div>
        <FormFooter onAbort={onClose} loading={loading} isEdit={!!categoryId} abortText="DISCARD_SEQUENCE" />
      </form>
    </UniversalModal>
  );
}