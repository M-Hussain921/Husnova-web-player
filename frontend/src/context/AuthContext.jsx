import { useState, createContext } from "react";

export const AuthContext = createContext();

const API_BASE ="https://husnova-web-player.onrender.com/api/auth"

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");

    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendOTP = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to send OTP"
        );
      }

      return true;
    } catch (error) {
      console.error("Send OTP error:", error);

      setError(error.message);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, OTP) => {
    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          OTP: OTP.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "OTP verification failed"
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);

      return true;
    } catch (error) {
      console.error("Verify OTP error:", error);

      setError(error.message);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        sendOTP,
        verifyOTP,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};