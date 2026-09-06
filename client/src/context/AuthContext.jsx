import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);


  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Change password API
  const changePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const response = await axios.put(
        `${baseUrl}/api/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Delete account API
  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const response = await axios.delete(`${baseUrl}/api/auth/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Clear local session after successful deletion
      logout();
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Update username API
  const updateUsername = async (newUsername) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const response = await axios.put(
        `${baseUrl}/api/auth/update-username`,
        { newUsername },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update token with new username
      if (response.data.token) {
        login(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // 2FA Setup API (Generate QR Code and Secret)
  const setup2FA = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    const response = await axios.post(
      `${baseUrl}/api/auth/2fa/setup`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  // 2FA Confirm Setup API (Verify code from Authenticator app to activate)
  const verify2FASetup = async (code) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    const response = await axios.post(
      `${baseUrl}/api/auth/2fa/verify-setup`,
      { code },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.token) {
      login(response.data.token);
    }
    return response.data;
  };

  // 2FA Disable API
  const disable2FA = async (password) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    const response = await axios.post(
      `${baseUrl}/api/auth/2fa/disable`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.token) {
      login(response.data.token);
    }
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        deleteAccount,
        changePassword,
        updateUsername,
        setup2FA,
        verify2FASetup,
        disable2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
