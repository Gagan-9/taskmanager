import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    // Check if storedUser exists before parsing
    if (token && storedUser) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
  
      console.log("Login API Response:", response.data); // Debugging line
  
      if (!response.data || !response.data.user) {
        throw new Error("Invalid login response: User data missing");
      }
  
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id); // Store user ID
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
  
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  
      // Update user state
      setUser(response.data.user);
  
      // Return user data
      return response.data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setLoading(false); // Ensure loading is set to false after logout
  };

  const refreshUser = async () => {
    setLoading(true); // Indicate that user data is being refreshed
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data || !response.data.user) {
        throw new Error("Invalid user data");
      }

      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      logout(); // Log out the user if refreshing fails
    } finally {
      setLoading(false); // Ensure loading is set to false after refresh attempt
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Ensure useAuth is properly exported
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};