import { useForm } from "react-hook-form";
import { useProduct } from "@/context/ProductContext";
import { useEffect, useState } from "react";
import { ProductFormFields } from "@/components/Product/ProductFormFields";
import { ImageUpload } from "@/components/Product/ImageUpload";
import { UniversalModal } from "@/components/Shared/Modals/UniversalModal";

export default function ProductFormModal({ isOpen, onClose, productId = null }) {
  const { createProduct, getProduct, updateProduct } = useProduct();
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId && isOpen) {
      const loadProduct = async () => {
        const product = await getProduct(productId);
        if (product) {
          Object.keys(product).forEach(key => {
            if (key !== 'image') setValue(key, product[key]);
          });
        }
      };
      loadProduct();
    } else if (!isOpen) {
      reset();
    }
  }, [productId, isOpen, setValue, reset, getProduct]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const formData = new FormData();

    if (productId) {
      formData.append("_method", "PUT");
    }

    const imageField = data.image;
    if (imageField) {
      if (imageField instanceof FileList && imageField.length > 0) {
        formData.append("image", imageField[0]);
      } else if (imageField instanceof File) {
        formData.append("image", imageField);
      }
    }

    formData.append("name", data.name || "");
    formData.append("slug", data.slug || "");
    formData.append("category_id", data.category_id || "");
    formData.append("price", data.price || 0);
    formData.append("stock", data.stock || 0);
    formData.append("description", data.description || "");

    try {
      if (productId) {
        await updateProduct(productId, formData);
      } else {
        await createProduct(formData);
      }
      onClose();
    } catch (error) {
      console.error("DATA_TRANSFER_FAILURE:", error.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  });

  return (
    <UniversalModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={productId ? "CORE.UPDATING" : "CORE.MAKING"}
      subtitle={productId ? `PATCHING_RESOURCES_AT_UID_${productId}` : "INITIALIZING_NEW_ENTRY_SEQUENCE"}
      maxWidth="max-w-6xl"
    >
      <form id="product-form" onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 bg-background">
        
        {/* COLUMNA 01: DATA INPUT */}
        <div className="lg:col-span-7 p-8 md:p-12 border-r border-border">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-4 bg-primary" />
            <p className="text-[10px] font-black text-foreground uppercase tracking-[0.5em]">
              01. DATA_MAPPING_PROCESS
            </p>
          </div>
          <ProductFormFields register={register} setValue={setValue} watch={watch} productId={productId} />
        </div>

        {/* COLUMNA 02: VISUAL SYNC */}
        <div className="lg:col-span-5 p-8 md:p-12 bg-muted/10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-4 bg-primary" />
            <p className="text-[10px] font-black text-foreground uppercase tracking-[0.5em]">
              02. VISUAL_SYNCING
            </p>
          </div>
          <ImageUpload register={register} watch={watch} setValue={setValue} />
        </div>

        {/* FOOTER ACTIONS */}
        <div className="col-span-12 grid grid-cols-2 border-t border-border h-20">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] border-r border-border text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-none disabled:opacity-50"
          >
            DISCARD_SEQUENCE
          </button>
          
          <button 
            form="product-form"
            type="submit"
            disabled={loading}
            className="flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] bg-foreground text-background hover:bg-primary hover:text-white transition-none disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : (productId ? "EXECUTE_PATCH" : "COMMIT_ENTRY")}
          </button>
        </div>
      </form>
    </UniversalModal>
  );
}