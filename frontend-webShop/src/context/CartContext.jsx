import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNotify } from './NotificationContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrderRequest } from '../api/useCart';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('SYSTEM CART DATA');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const { notify } = useNotify();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('SYSTEM CART DATA', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        if (!isAuthenticated) {
            notify("AUTHENTICATION REQUIRED", "error");
            setIsCartOpen(false);
            navigate("/login");
            return;
        }

        const existingItem = cart.find(item => item.id === product.id);
        const currentQty = existingItem ? existingItem.quantity : 0;

        if (currentQty + quantity > product.stock) {
            notify("STOCK LIMIT REACHED", "error");
            return;
        }

        setCart(prev => {
            const isExisting = prev.find(item => item.id === product.id);
            if (isExisting) {
                return prev.map(item => 
                    item.id === product.id 
                    ? { ...item, quantity: item.quantity + quantity } 
                    : item
                );
            }
            return [...prev, { ...product, quantity }];
        });

        if (existingItem) {
            notify("ITEM QUANTITY UPDATED", "success");
        } else {
            notify("PRODUCT ADDED TO TERMINAL", "success");
        }
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
        notify("ITEM REMOVED FROM MANIFEST", "success");
    };

    const updateQuantity = (id, type) => {
        const item = cart.find(i => i.id === id);
        if (!item) return;

        const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
        if (newQty > item.stock) {
            notify("MAX STOCK REACHED", "error");
            return;
        }
        if (newQty < 1) return;

        setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('SYSTEM CART DATA');
    };

    const createOrder = async (orderData) => {
        if (cart.length === 0) {
            notify("MANIFEST IS EMPTY", "error");
            return null;
        }

        setLoading(true);
        try {
            const res = await createOrderRequest({
                address_id: orderData.address_id,
                department_id: orderData.department_id,
                municipality_id: orderData.municipality_id,
                address: orderData.address,
                phone: orderData.phone,
                payment_method: orderData.payment_method,
                notes: orderData.notes,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: cartTotal
            });
            
            if (res.status === 200 || res.status === 201) {
                clearCart();
                notify("ORDER PLACED SUCCESSFULLY", "success");
                setIsCartOpen(false);
                return res.data;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "ERROR CREATING ORDER";
            notify(errorMsg.toUpperCase(), "error");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            createOrder,
            loading,
            cartCount,
            cartTotal,
            isCartOpen,
            openCart,
            closeCart
        }}>
            {children}
        </CartContext.Provider>
    );
}