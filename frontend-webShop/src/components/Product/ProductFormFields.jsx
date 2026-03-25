import { useEffect } from "react";
import { useCategory } from "@/context/CategoryContext";

export function ProductFormFields({ register, setValue, watch }) {
  const { categories, getCategories } = useCategory();
  const nameValue = watch("name");
  const categoryId = watch("category_id");

  useEffect(() => {
    if (!categories || categories.length === 0) {
      getCategories();
    }
  }, []);

  useEffect(() => {
    if (nameValue) {
      const selectedCategory = categories?.find(c => String(c.id) === String(categoryId));
      const categoryName = selectedCategory ? selectedCategory.name.toLowerCase() : "";
      const cleanName = nameValue
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const finalSlug = categoryName 
        ? `${categoryName}-${cleanName}`.toLowerCase() 
        : cleanName.toLowerCase();
      
      setValue("slug", finalSlug, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue("slug", "");
    }
  }, [nameValue, categoryId, categories, setValue]);

  return (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
            Product Designation
          </label>
          <input
            {...register("name", { required: true })}
            type="text"
            className="w-full bg-background border border-border p-4 text-sm font-bold uppercase italic tracking-tighter focus:border-primary outline-none text-foreground placeholder:opacity-30"
            placeholder="E.G. OVERSIZED HOODIE"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
            Category Node
          </label>
          <div className="relative">
            <select
              {...register("category_id", { required: true })}
              className="w-full bg-background border border-border p-4 text-sm font-bold uppercase italic tracking-tighter focus:border-primary outline-none appearance-none cursor-pointer text-foreground"
            >
              <option value="" className="bg-background">-- SELECT CATEGORY --</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-background">
                  {cat.parent_id ? `↳ ${cat.name.toUpperCase()}` : cat.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-[10px]">▼</div>
          </div>
        </div>
      </div>

      {/* SYSTEM SLUG - Adaptativo a Primario pero sin animaciones */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
          System Slug / Global URL Identity
        </label>
        <div className="relative">
          <input
            {...register("slug")}
            type="text"
            readOnly
            className="w-full bg-muted/20 border border-primary/30 p-4 text-[11px] font-mono text-primary lowercase tracking-widest outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <span className="h-1.5 w-1.5 bg-primary"></span>
             <span className="text-[7px] font-black text-primary uppercase">Sync_Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
            Price (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/50">$</span>
            <input
              {...register("price", { required: true })}
              type="number"
              step="0.01"
              className="w-full bg-background border border-border pl-8 p-4 text-sm font-bold uppercase italic tracking-tighter focus:border-primary outline-none text-foreground"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
            Inventory Units
          </label>
          <input
            {...register("stock", { required: true })}
            type="number"
            className="w-full bg-background border border-border p-4 text-sm font-bold uppercase italic tracking-tighter focus:border-primary outline-none text-foreground"
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
          Fabric Specifications / Description
        </label>
        <textarea
          {...register("description", { required: true })}
          className="w-full bg-background border border-border p-4 text-sm font-medium focus:border-primary outline-none h-32 resize-none custom-scrollbar text-foreground"
          placeholder="FABRIC COMPOSITION, FIT DETAILS..."
        />
      </div>
    </div>
  );
}