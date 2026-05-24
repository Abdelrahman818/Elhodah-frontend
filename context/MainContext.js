'use client';

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { endPoints } from "@/config";
import {
  addDemoCartItem,
  addDemoFav,
  clearDemoCart,
  fetchDemoProducts,
  getDemoCart,
  getDemoFavs,
  isDemoMode,
  removeDemoCartItem,
  removeDemoFav,
  updateDemoCartItem,
} from "@/lib/demoMode";

const MainContext = createContext(undefined);

export const MainProvider = ({ children }) => {
  const [value, setValue] = useState({
    products: [],
    loading: true,
    error: null,
    favs: [],
    favLoading: false,
    cart: [],
    cartLoading: false,
  });

  const getProducts = async () => {
    try {
      setValue((prev) => ({ ...prev, loading: true }));
      if (isDemoMode) {
        const products = await fetchDemoProducts();
        setValue((prev) => ({
          ...prev,
          products,
          loading: false,
          error: null,
        }));
        return;
      }

      const res = await fetch(endPoints.products);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const json = await res.json();
      setValue((prev) => ({
        ...prev,
        products: json.data || [],
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      setValue((prev) => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const getUserFavs = useCallback(async () => {
    try {
      setValue((prev) => ({ ...prev, favLoading: true }));
      if (isDemoMode) {
        const favs = await getDemoFavs();
        setValue((prev) => ({
          ...prev,
          favs,
          favLoading: false,
        }));
        return;
      }

      const res = await fetch(`${endPoints.fav}/user`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const json = await res.json();
      setValue((prev) => ({
        ...prev,
        favs: json.data || [],
        favLoading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch favorites:", error.message);
      setValue((prev) => ({
        ...prev,
        favLoading: false,
      }));
    }
  }, []);

  const addToFav = async (productId) => {
    try {
      if (isDemoMode) {
        const favs = await addDemoFav(productId);
        setValue((prev) => ({ ...prev, favs }));
        return { successful: true };
      }

      const res = await fetch(`${endPoints.fav}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        throw new Error("Failed to add to favorites");
      }

      const json = await res.json();
      if (json.successful) {
        // Refresh favs
        await getUserFavs();
      }
      return json;
    } catch (error) {
      console.error("Failed to add to favorites:", error.message);
      return { successful: false, msg: error.message };
    }
  };

  const removeFromFav = async (productId) => {
    try {
      if (isDemoMode) {
        const favs = await removeDemoFav(productId);
        setValue((prev) => ({ ...prev, favs }));
        return { successful: true };
      }

      const res = await fetch(`${endPoints.fav}/remove/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error("Failed to remove from favorites");
      }

      const json = await res.json();
      if (json.successful) {
        // Refresh favs
        await getUserFavs();
      }
      return json;
    } catch (error) {
      console.error("Failed to remove from favorites:", error.message);
      return { successful: false, msg: error.message };
    }
  };

  const isFav = (productId) => {
    return value.favs.some(fav => fav.productId._id === productId);
  };

  // --- Cart Functions ---

  const getUserCart = useCallback(async () => {
    if (isDemoMode) {
      setValue((prev) => ({
        ...prev,
        cart: getDemoCart(),
        cartLoading: false,
      }));
      return;
    }

    try {
      setValue((prev) => ({ ...prev, cartLoading: true }));
      const res = await fetch(endPoints.cart(), {
        credentials: 'include',
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const json = await res.json();
      setValue((prev) => ({
        ...prev,
        cart: json.data || [],
        cartLoading: false,
      }));
    } catch (error) {
      console.error("Fetch cart error:", error.message);
      setValue((prev) => ({ ...prev, cartLoading: false }));
    }
  }, []);

  const addToCart = async (productId, quantity, color, size) => {
    try {
      if (isDemoMode) {
        const cart = await addDemoCartItem(productId, quantity, color, size);
        setValue((prev) => ({ ...prev, cart }));
        return { successful: true };
      }

      const res = await fetch(endPoints.cart(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity, color, size }),
      });

      const json = await res.json();
      if (json.successful) {
        await getUserCart();
      }
      return json;
    } catch (error) {
      console.error("Add to cart error:", error.message);
      return { successful: false, msg: error.message };
    }
  };

  const updateCartQty = async (itemId, quantity) => {
    try {
      if (isDemoMode) {
        const cart = updateDemoCartItem(itemId, quantity);
        setValue((prev) => ({ ...prev, cart }));
        return { successful: true };
      }

      const res = await fetch(`${endPoints.cart()}/item/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });

      const json = await res.json();
      if (json.successful) {
        await getUserCart();
      }
      return json;
    } catch (error) {
      console.error("Update cart error:", error.message);
      return { successful: false, msg: error.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isDemoMode) {
        const cart = removeDemoCartItem(itemId);
        setValue((prev) => ({ ...prev, cart }));
        return { successful: true };
      }

      const res = await fetch(`${endPoints.cart()}/item/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const json = await res.json();
      if (json.successful) {
        await getUserCart();
      }
      return json;
    } catch (error) {
      console.error("Remove from cart error:", error.message);
      return { successful: false, msg: error.message };
    }
  };

  const clearCart = async () => {
    try {
      if (isDemoMode) {
        const cart = clearDemoCart();
        setValue((prev) => ({ ...prev, cart }));
        return { successful: true };
      }

      const res = await fetch(endPoints.cart(), {
        method: 'DELETE',
        credentials: 'include',
      });

      const json = await res.json();
      if (json.successful) {
        setValue((prev) => ({ ...prev, cart: [] }));
      }
      return json;
    } catch (error) {
      console.error("Clear cart error:", error.message);
      return { successful: false, msg: error.message };
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const contextValue = {
    ...value,
    getProducts,
    getUserFavs,
    addToFav,
    removeFromFav,
    isFav,
    getUserCart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
  };

  return (
    <MainContext.Provider value={contextValue}>
      {children}
    </MainContext.Provider>
  );
}

export const useMain = () => {
  const context = useContext(MainContext);

  if (context === undefined) {
    throw new Error("useMain must be used within a MainProvider");
  }
  return context;
}
