import { createContext, useContext, useState, useCallback } from "react";
import { 
    getAddressesRequest, 
    createAddressRequest, 
    deleteAddressRequest,
    getDepartmentsRequest,
    getMunicipalitiesRequest 
} from "../api/addresses";
import { useNotify } from "./NotificationContext";

const AddressContext = createContext();

export const useAddresses = () => {
    const context = useContext(AddressContext);
    if (!context) throw new Error("useAddresses must be used within an AddressProvider");
    return context;
};

export function AddressProvider({ children }) {
    const [addresses, setAddresses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { notify } = useNotify();

    const getAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAddressesRequest();
            // Accedemos a res.data.data porque tu controlador retorna { status, data: [] }
            const incomingData = res.data?.data || res.data;
            setAddresses(Array.isArray(incomingData) ? incomingData : []);
        } catch (error) {
            notify("ERROR FETCHING ADDRESSES", "error");
        } finally {
            setLoading(false);
        }
    }, [notify]);

    const getDepartments = useCallback(async () => {
        try {
            const res = await getDepartmentsRequest();
            // Si el endpoint de departamentos también está envuelto en 'data'
            const incomingDepts = res.data?.data || res.data;
            setDepartments(Array.isArray(incomingDepts) ? incomingDepts : []);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const getMunicipalities = async (deptId) => {
        try {
            const res = await getMunicipalitiesRequest(deptId);
            const incomingMunis = res.data?.data || res.data;
            return Array.isArray(incomingMunis) ? incomingMunis : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const createAddress = async (address) => {
        setLoading(true);
        try {
            const res = await createAddressRequest(address);
            // Tu store retorna el nuevo objeto dentro de res.data.data
            const newAddress = res.data?.data || res.data;
            
            setAddresses(prev => {
                const current = Array.isArray(prev) ? prev : [];
                return [...current, newAddress];
            });
            
            notify("SHIPPING NODE AUTHORIZED", "success");
            return newAddress;
        } catch (error) {
            notify("FAILED TO REGISTER ADDRESS", "error");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (id) => {
        try {
            await deleteAddressRequest(id);
            setAddresses(prev => {
                const current = Array.isArray(prev) ? prev : [];
                return current.filter(addr => addr.id !== id);
            });
            notify("NODE DECOMMISSIONED", "success");
        } catch (error) {
            notify("DELETE OPERATION FAILED", "error");
        }
    };

    return (
        <AddressContext.Provider value={{
            addresses,
            departments,
            loading,
            getAddresses,
            getDepartments,
            getMunicipalities,
            createAddress,
            deleteAddress
        }}>
            {children}
        </AddressContext.Provider>
    );
}