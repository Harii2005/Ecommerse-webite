import React, { createContext, useContext, useReducer, useEffect } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

// Create Cart Context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: { items: [], totalAmount: 0 },
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  cart: { items: [], totalAmount: 0 },
  loading: false,
  error: null,
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [isAuthenticated]);

  // Fetch cart function
  const fetchCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartService.getCart();

      if (response.success) {
        dispatch({
          type: "SET_CART",
          payload: response.data.cart,
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to fetch cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Add item to cart
  const addToCart = async (itemId, quantity = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await cartService.addToCart(itemId, quantity);

      if (response.success) {
        dispatch({
          type: "SET_CART",
          payload: response.data.cart,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to add item to cart",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Update cart item
  const updateCartItem = async (itemId, quantity) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await cartService.updateCartItem(itemId, quantity);

      if (response.success) {
        dispatch({
          type: "SET_CART",
          payload: response.data.cart,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to update cart item",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await cartService.removeFromCart(itemId);

      if (response.success) {
        dispatch({
          type: "SET_CART",
          payload: response.data.cart,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to remove item from cart",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await cartService.clearCart();

      if (response.success) {
        dispatch({
          type: "SET_CART",
          payload: response.data.cart,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to clear cart",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Get cart item count
  const getCartItemCount = () => {
    return (
      state.cart.items?.reduce((total, item) => total + item.quantity, 0) || 0
    );
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError,
    fetchCart,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
