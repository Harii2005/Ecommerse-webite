import api from "./api";

export const itemsService = {
  // Get all items with optional query string
  getAllItems: async (queryString = "") => {
    try {
      const response = await api.get(
        `/items${queryString ? `?${queryString}` : ""}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all items with filters
  getItems: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(
        `/items${queryString ? `?${queryString}` : ""}`
      );
      return response;
    } catch (error) {
      console.error("ItemsService API Error:", error);
      throw error;
    }
  },

  // Get single item by ID
  getItemById: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new item (Admin only)
  createItem: async (itemData) => {
    try {
      const response = await api.post("/items", itemData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update item (Admin only)
  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete item (Admin only)
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get items by category
  getItemsByCategory: async (category) => {
    try {
      const response = await api.get(`/items?category=${category}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search items
  searchItems: async (searchTerm) => {
    try {
      const response = await api.get(
        `/items?search=${encodeURIComponent(searchTerm)}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default itemsService;
