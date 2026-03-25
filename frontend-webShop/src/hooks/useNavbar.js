import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useNavbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0); 

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return {
        isAuthenticated,
        user,
        logout,
        isSidebarOpen,
        toggleSidebar,
        cartCount
    };
};