import { createContext, useContext, useState } from 'react';
import { 
    getMyInvoicesRequest, 
    getAllInvoicesRequest, 
    getInvoiceRequest,
} from '../api/invoice';
import {getInvoicePdfRequest} from '../api/order'
import { useNotify } from './NotificationContext';

const InvoiceContext = createContext();

export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (!context) {
        throw new Error("useInvoice must be used within an InvoiceProvider");
    }
    return context;
};

export function InvoiceProvider({ children }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const { notify } = useNotify();

    const getInvoices = async () => {
        try {
            const res = await getAllInvoicesRequest();
            setInvoices(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getMyInvoices = async () => {
        try {
            const res = await getMyInvoicesRequest();
            setInvoices(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getInvoice = async (id) => {
        try {
            const res = await getInvoiceRequest(id);
            return res.data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const printInvoice = async (orderId) => {
        setLoading(true);
        try {
            const res = await getInvoicePdfRequest(orderId);
            const file = new Blob([res.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            
            window.open(fileURL, '_blank');
            
            notify("INVOICE GENERATED", "success");
        } catch (error) {
            const errorMsg = error.response?.data?.error || "ERROR GENERATING PDF";
            notify(errorMsg.toUpperCase(), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <InvoiceContext.Provider value={{
            invoices,
            loading,
            getInvoices,
            getMyInvoices,
            getInvoice,
            printInvoice
        }}>
            {children}
        </InvoiceContext.Provider>
    );
}