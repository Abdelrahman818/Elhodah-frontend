"use client";

import { endPoints } from "@/config";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  fetchDemoUsers,
  getStoredDemoUserId,
  isDemoMode,
  logoutDemoUser,
} from "@/lib/demoMode";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState(null);

  const getUserData = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(endPoints.getCurrentUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (json.successful) {
        setUser(json.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err.message);
      setUser(null);
      console.error("Fetch user error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      const loadDemoUser = async () => {
        try {
          const demoUserId = getStoredDemoUserId();
          if (!demoUserId) {
            setUser(null);
            return;
          }

          const users = await fetchDemoUsers();
          setUser(users.find((demoUser) => demoUser.id === demoUserId) || null);
        } catch (err) {
          setError(err.message);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      loadDemoUser();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setFirebaseToken(token);
          await getUserData(token);
        } catch (err) {
          console.error("Token error:", err);
          setUser(null);
          setFirebaseToken(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setFirebaseToken(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (isDemoMode) {
      logoutDemoUser();
      setUser(null);
      setFirebaseToken(null);
      return;
    }

    try {
      await signOut(auth);
      // Optional: Inform backend to clear any remaining cookies if needed
      await fetch(endPoints.logout, { method: 'POST' });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    error,
    isLoggedIn: !!user,
    firebaseToken,
    refreshUser: async () => {
      if (isDemoMode) {
        const demoUserId = getStoredDemoUserId();
        const users = await fetchDemoUsers();
        setUser(users.find((demoUser) => demoUser.id === demoUserId) || null);
        return;
      }

      return firebaseToken && getUserData(firebaseToken);
    },
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
