import { useNotify } from '../context/NotificationContext'
import {
    createProductRequest,
    updateProductRequest,
    getProductRequest,
    getProductsRequest,
    deleteProductRequest
} from '../api/products'
import { useState, useContext, createContext } from 'react'

const ProductContext = createContext();

export const useProduct = () => {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider")
    }
    return context;
}

export function ProductProvider({ children }) {

    const [products, setProducts] = useState([])
    const { notify } = useNotify();

    const getProducts = async () => {
        try {
            const res = await getProductsRequest()
            setProducts(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getProduct = async (id) => {
        try {
            const res = await getProductRequest(id)
            return res.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const createProduct = async (product) => {
        try {
            const res = await createProductRequest(product);

            const newProduct = res.data.data;

            setProducts((prev) => [...prev, newProduct]);

            notify('PRODUCT CREATED', 'success');

            return res.data;
        } catch (error) {
            console.error("Error al crear producto:", error);
            const errorMsg = error.response?.data?.message || "ERROR CREATING PRODUCT";
            notify(errorMsg.toUpperCase(), "error");
            throw error;
        }
    };

    const updateProduct = async (id, product) => {
        try {
            const res = await updateProductRequest(id, product);

            const updatedProduct = res.data.data;



            setProducts((prev) =>
                prev.map((p) => (p.id == id ? updatedProduct : p))
            );

            notify('PRODUCT UPDATED', 'success');

            return res.data;
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            const errorMsg = error.response?.data?.message || "ERROR UPDATING PRODUCT";
            notify(errorMsg.toUpperCase(), "error");
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await deleteProductRequest(id)
            if (res.status === 200) {
                setProducts(products.filter(p => p.id !== id))
            }
            notify('PRODUCT DELETED', 'success')
        } catch (error) {
            console.log(error)
            const errorMsg = error.response?.data?.message || "ERROR DELETING PRODUCT";
            notify(errorMsg.toUpperCase(), "error");
            throw error
        }
    }

    return (
        <ProductContext.Provider value={{
            products,
            getProducts,
            getProduct,
            createProduct,
            updateProduct,
            deleteProduct
        }}>
            {children}
        </ProductContext.Provider>
    )
}