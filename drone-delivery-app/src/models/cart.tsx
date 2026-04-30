// Cart context: holds the list of product IDs currently in the cart, persisted to localStorage.
// Wrap the app in <CartProvider> to make useCart() available to all child components.
import { createContext, useContext, useEffect, useState } from 'react';

export type CartContextType = {
    cartItems: number[];
    addToCartItems: (pid: number) => void;
    removeFromCart: (pid: number) => void;
    clearCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: any) => {
    const [cartItems, setCartItems] = useState<number[]>(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCartItems = (pid: number) => {
        setCartItems(prev => [...prev, pid]);
    };

    const removeFromCart = (pid: number) => {
        setCartItems(prev => prev.filter(id => id !== pid));
    };
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCartItems, 
            removeFromCart, 
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return context;
};