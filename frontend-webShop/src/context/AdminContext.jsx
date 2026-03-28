import { createContext, useContext, useState, useCallback } from "react";
import { getProductLogsRequest, getInventoryLogsRequest, getDashboardStatsRequest } from "@/api/admin";
import { useNotify } from "./NotificationContext";

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
};

export function AdminProvider({ children }) {
    const [productLogs, setProductLogs] = useState([]);
    const [inventoryLogs, setInventoryLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const { notify } = useNotify(); // Accedemos a la función notify

    const getProductLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProductLogsRequest();
            setProductLogs(res.data.data.data || res.data.data);
        } catch (error) {
            notify("ERROR_FETCHING_PRODUCT_LOGS", "error");
        } finally {
            setLoading(false);
        }
    }, [notify]);

    const getInventoryLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getInventoryLogsRequest();
            setInventoryLogs(res.data.data.data || res.data.data);
        } catch (error) {
            notify("ERROR_FETCHING_INVENTORY_LOGS", "error");
        } finally {
            setLoading(false);
        }
    }, [notify]);

    const getStats = useCallback(async () => {
        try {
            const res = await getDashboardStatsRequest();
            setStats(res.data.data);
            if (res.data.data.critical_stock > 0) {
                notify(`CRITICAL_STOCK_DETECTED: ${res.data.data.critical_stock} ITEMS`, "warning");
            }
        } catch (error) {
            notify("STATS_SYNC_FAILED", "error");
        }
    }, [notify]);

    return (
        <AdminContext.Provider value={{
            productLogs,
            inventoryLogs,
            stats,
            loading,
            getProductLogs,
            getInventoryLogs,
            getStats
        }}>
            {children}
        </AdminContext.Provider>
    );
}