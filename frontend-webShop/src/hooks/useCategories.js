import { useEffect, useState } from "react";
import { getCategoriesRequest } from "../api/categories";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getCategoriesRequest();
                setCategories(res.data);
            } catch (error) {
                console.error("Error loading categories:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    return { categories, loading };
};