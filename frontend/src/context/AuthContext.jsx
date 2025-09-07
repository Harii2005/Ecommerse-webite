import React, { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/authService";

// Create Auth Context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
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
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const user = authService.getCurrentUser();

      if (token && user) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      console.log("AuthContext: Attempting login with:", credentials.email);
      const response = await authService.login(credentials);
      console.log("AuthContext: Login response:", response);

      if (response.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        });
        console.log("AuthContext: Login successful, user:", response.data.user);
        return response;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Login failed",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await authService.register(userData);

      if (response.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        });
        return response;
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Registration failed",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    dispatch({ type: "LOGOUT" });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
