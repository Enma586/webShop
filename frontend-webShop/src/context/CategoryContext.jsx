import { createContext, useContext, useState } from 'react'
import {
    createCategoryRequest,
    getCategoriesRequest,
    updateCategoryRequest,
    deleteCategoryRequest,
    getCategoryRequest
} from '../api/categories'
import { useNotify } from './NotificationContext'

const CategoryContext = createContext();

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory must be used within a CategoryProvider")
    }
    return context;
}

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const { notify } = useNotify();



    const getCategories = async () => {
        try {
            const res = await getCategoriesRequest();
            setCategories(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getCategory = async (id) => {
        try {
            const res = await getCategoryRequest(id);
            return res.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const deleteCategory = async (id) => {
        try {
            const res = await deleteCategoryRequest(id);
            if (res.status === 200 || res.status === 204) {
                setCategories(prev => prev.filter(cat => cat.id !== id));
            }
            notify("CATEGORY DELETED", "success")
        } catch (error) {
            const errorMsg = error.response?.data?.message || "ERROR DELETING CATEGORY";
            notify(errorMsg.toUpperCase(), "error")
        }
    }

    const updateCategory = async (id, categoryData) => {
        try {
            await updateCategoryRequest(id, categoryData);
            await getCategories();

            notify("CATEGORY UPDATED", "success");
            return true;
        } catch (error) {
            notify("ERROR UPDATING CATEGORY", "error");
            return false;
        }
    }

    const createCategory = async (categoryData) => {
        try {
            await createCategoryRequest(categoryData);
            await getCategories();
            notify("CATEGORY CREATED", "success");
            return true;
        } catch (error) {
            notify("ERROR CREATING CATEGORY", "error");
            return false;
        }
    }

    return (
        <CategoryContext.Provider value={{
            categories,
            createCategory,
            deleteCategory,
            getCategories,
            updateCategory,
            getCategory
        }}>
            {children}
        </CategoryContext.Provider>
    )
}