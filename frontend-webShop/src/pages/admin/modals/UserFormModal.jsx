import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { UniversalModal } from "@/components/Shared/Modals/UniversalModal";
import { Mail, Lock, UserCog, Power, User as UserIcon } from "lucide-react";
import { FormInput, FormSelect, FormSection, FormFooter } from "@/components/Shared/Form";

export default function UserFormModal({ isOpen, onClose, userId = null, isReadOnly = false }) {
  const { createUser, getUser, updateUser } = useUser();
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);

  const isCustomer = watch("role") === "customer";

  useEffect(() => {
    if (userId && isOpen) {
      const loadUser = async () => {
        const res = await getUser(userId);
        const data = res.data?.data || res.data || res;
        if (data) {
          Object.keys(data).forEach(key => {
            if (key !== 'password') setValue(key, data[key]);
          });
        }
      };
      loadUser();
    } else if (!isOpen) reset();
  }, [userId, isOpen, setValue, reset, getUser]);

  const onSubmit = handleSubmit(async (data) => {
    if (isReadOnly) return;
    setLoading(true);
    const payload = { ...data };
    if (!payload.password?.trim()) delete payload.password;

    try {
      userId ? await updateUser(userId, payload) : await createUser(payload);
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
      title={userId ? (isCustomer ? "USER.STATUS_OVERRIDE" : "USER.FULL_PATCH") : "USER.INITIALIZE"}
      subtitle={userId ? `ACCESS_CONTROL_UID_${userId}` : "REGISTERING_NEW_ENTITY"}
      maxWidth="max-w-6xl"
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 bg-background">
        <div className="lg:col-span-7 p-8 md:p-12 border-r border-border space-y-8">
          <FormSection number="01" title="IDENTITY_MAPPING" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput label="Username" icon={UserIcon} {...register("username", { required: true })} disabled={isCustomer} />
            <FormInput label="Full Name" {...register("name", { required: true })} disabled={isCustomer} />
          </div>
          <FormInput label="Email Address" type="email" icon={Mail} {...register("email", { required: true })} disabled={isCustomer} />
          <div className="bg-primary/5 p-4 border border-primary/20">
            <FormSelect label="Node Status (OVERRIDE)" icon={Power} {...register("status")}>
              <option value="active">ACTIVE_OPERATIONAL</option>
              <option value="banned">BANNED_RESTRICTED</option>
              <option value="inactive">INACTIVE_STBY</option>
            </FormSelect>
          </div>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 bg-muted/10 space-y-8">
          <FormSection number="02" title="SECURITY_PROTOCOLS" />
          <FormInput label="Access Key" type="password" icon={Lock} {...register("password", { minLength: 8 })} placeholder={isCustomer ? "ENCRYPTED" : "MIN_8_CHARS"} disabled={isCustomer} />
          <FormSelect label="Permission Level" icon={UserCog} {...register("role")} disabled={isCustomer}>
            <option value="customer">CUSTOMER_ASSET</option>
            <option value="admin">ADMIN_PRIVILEGES</option>
          </FormSelect>
        </div>
        <FormFooter onAbort={onClose} loading={loading} isEdit={!!userId} abortText="ABORT_PATCH" />
      </form>
    </UniversalModal>
  );
}