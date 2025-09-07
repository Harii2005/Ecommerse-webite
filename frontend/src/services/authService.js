import api from "./api";

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/signup", userData);
      if (response.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log("AuthService: Making login request to:", "/auth/login");
      console.log("AuthService: Login credentials:", {
        email: credentials.email,
      });

      const response = await api.post("/auth/login", credentials);
      console.log("AuthService: Login API response:", response);

      if (response.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("AuthService: Token and user saved to localStorage");
      }
      return response;
    } catch (error) {
      console.error("AuthService: Login error:", error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
