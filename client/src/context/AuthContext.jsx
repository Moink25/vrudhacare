import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          const response = await api.get("/api/users/profile");
          console.log("Profile response:", response.data);
          // Check if the user data is nested inside a 'user' property or directly in the response
          const userData = response.data.user || response.data;
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth validation error:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  const login = async (email, password) => {
    try {
      // Try the auth endpoint first
      try {
        const response = await api.post("/api/auth/login", { email, password });
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        return true;
      } catch (authError) {
        console.log("Auth endpoint failed, trying users endpoint");
        // If auth endpoint fails, try the users endpoint
        const response = await api.post("/api/users/login", {
          email,
          password,
        });
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        return true;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      // Try the auth endpoint first
      try {
        const response = await api.post("/api/auth/register", {
          name,
          email,
          password,
        });
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("Registration successful!");
        return true;
      } catch (authError) {
        console.log("Auth endpoint failed, trying users endpoint");
        // If auth endpoint fails, try the users endpoint
        const response = await api.post("/api/users/register", {
          name,
          email,
          password,
        });
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("Registration successful!");
        return true;
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put("/api/users/profile", userData);
      console.log("Update profile response:", response.data);
      // Check if the user data is nested inside a 'user' property or directly in the response
      const updatedUser = response.data.user || response.data;
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Profile update failed. Please try again.";
      toast.error(message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
