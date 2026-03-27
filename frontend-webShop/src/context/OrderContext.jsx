import { createContext, useContext, useState, useCallback } from "react";
import { useNotify } from './NotificationContext';
import { 
    getMyOrdersRequest, 
    getMyOrderRequest, 
    processCheckoutRequest, 
    getAllOrdersRequest, 
    updateOrderStatusRequest,
    getAdminOrderRequest 
} from "@/api/order";

const OrderContext = createContext();

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error("useOrder must be used within an OrderProvider");
    return context;
};

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { notify } = useNotify();

    const getOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllOrdersRequest();
            setOrders(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyOrdersRequest();
            setOrders(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getOrder = async (id, isAdmin = false) => {
        try {
            const res = isAdmin ? await getAdminOrderRequest(id) : await getMyOrderRequest(id);
            return res.data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateStatus = async (id, status) => {
        setLoading(true);
        try {
            const res = await updateOrderStatusRequest(id, status);
            const updatedOrder = res.data.data;

            setOrders((prev) =>
                prev.map((o) => (o.id == id ? updatedOrder : o))
            );

            notify(`ORDER UPDATED TO ${status.toUpperCase()}`, 'success');
            return res.data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "ERROR UPDATING STATUS";
            notify(errorMsg.toUpperCase(), "error");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (payload) => {
        setLoading(true);
        try {
            const res = await processCheckoutRequest(payload);
            notify('ORDER PLACED SUCCESSFULLY', 'success');
            return res.data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "ERROR PROCESING ORDER";
            notify(errorMsg.toUpperCase(), "error");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider value={{
            orders,
            loading,
            getOrders,
            getUserOrders,
            getOrder,
            updateStatus,
            createOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
}