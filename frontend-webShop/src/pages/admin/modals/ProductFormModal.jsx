import { useForm } from "react-hook-form";
import { useProduct } from "@/context/ProductContext";
import { useEffect, useState } from "react";
import { UniversalModal } from "@/components/Shared/Modals/UniversalModal";
import { FormSection, FormFooter } from "@/components/Shared/Form";
import { ProductFormFields } from "@/components/Product/ProductFormFields";
import { ImageUpload } from "@/components/Product/ImageUpload";

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
    } else if (!isOpen) reset();
  }, [productId, isOpen, setValue, reset, getProduct]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const formData = new FormData();
    if (productId) formData.append("_method", "PUT");

    const imageField = data.image;
    if (imageField) {
      const file = imageField instanceof FileList ? imageField[0] : imageField;
      if (file instanceof File) formData.append("image", file);
    }

    ['name', 'slug', 'category_id', 'price', 'stock', 'description'].forEach(field => {
      formData.append(field, data[field] || (field === 'price' || field === 'stock' ? 0 : ""));
    });

    try {
      productId ? await updateProduct(productId, formData) : await createProduct(formData);
      onClose();
    } catch (error) {
      console.error("DATA_TRANSFER_FAILURE:", error.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  });

  return (
    <UniversalModal 
      isOpen={isOpen} onClose={onClose} 
      title={productId ? "CORE.UPDATING" : "CORE.MAKING"}
      subtitle={productId ? `PATCHING_RESOURCES_AT_UID_${productId}` : "INITIALIZING_NEW_ENTRY"}
      maxWidth="max-w-6xl"
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 bg-background">
        <div className="lg:col-span-7 p-8 md:p-12 border-r border-border space-y-8">
          <FormSection number="01" title="DATA_MAPPING_PROCESS" />
          <ProductFormFields register={register} setValue={setValue} watch={watch} productId={productId} />
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 bg-muted/10 space-y-8">
          <FormSection number="02" title="VISUAL_SYNCING" />
          <ImageUpload register={register} watch={watch} setValue={setValue} />
        </div>
        <FormFooter onAbort={onClose} loading={loading} isEdit={!!productId} abortText="DISCARD_SEQUENCE" />
      </form>
    </UniversalModal>
  );
}