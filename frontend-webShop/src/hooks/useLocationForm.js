import { useState } from "react";
import { useAddresses } from "@/context/AddressContext";

export const useLocationForm = (initialState) => {
    const { getMunicipalities } = useAddresses();
    const [municipalities, setMunicipalities] = useState([]);
    const [fetchingMunis, setFetchingMunis] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const handleDeptChange = async (deptId) => {
        setFormData(prev => ({ ...prev, department_id: deptId, municipality_id: "" }));
        if (deptId) {
            setFetchingMunis(true);
            const data = await getMunicipalities(deptId);
            setMunicipalities(data || []);
            setFetchingMunis(false);
            return data;
        }
        setMunicipalities([]);
        return [];
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return {
        formData,
        setFormData,
        municipalities,
        setMunicipalities,
        fetchingMunis,
        handleDeptChange,
        handleInputChange
    };
};