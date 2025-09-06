import api from "./api";

export const cartService = {
  // Add item to cart
  addToCart: async (itemId, quantity = 1) => {
    try {
      const response = await api.post("/cart", { itemId, quantity });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update item quantity in cart
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await api.delete("/cart");
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default cartService;
