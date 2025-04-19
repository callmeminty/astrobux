
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ref, get, set, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

interface UserData {
  points: number;
  captchasSolved: number;
  lastCaptchaTime: number | null;
}

interface UserDataContextType {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  addPoints: (amount: number) => Promise<void>;
  incrementCaptchasSolved: () => Promise<void>;
  withdrawPoints: (amount: number) => Promise<void>;
}

const defaultUserData: UserData = {
  points: 0,
  captchasSolved: 0,
  lastCaptchaTime: null,
};

const UserDataContext = createContext<UserDataContextType | null>(null);

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchUserData() {
      if (!currentUser) {
        if (isMounted) {
          setUserData(null);
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) setLoading(true);
        
        // Check cache first
        const cachedData = localStorage.getItem(`userData_${currentUser.uid}`);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (isMounted) setUserData(parsedData);
        }
        
        // Always fetch fresh data
        const userRef = ref(rtdb, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const freshData = snapshot.val() as UserData;
          if (isMounted) setUserData(freshData);
          localStorage.setItem(`userData_${currentUser.uid}`, JSON.stringify(freshData));
        } else {
          // Create a new user data if it doesn't exist
          await set(userRef, defaultUserData);
          if (isMounted) setUserData(defaultUserData);
          localStorage.setItem(`userData_${currentUser.uid}`, JSON.stringify(defaultUserData));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (isMounted) setError("Failed to load user data");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  async function addPoints(amount: number) {
    if (!currentUser || !userData) return;

    try {
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      const updates = {
        points: userData.points + amount,
        lastCaptchaTime: Date.now(),
      };
      await update(userRef, updates);

      setUserData(prev => 
        prev ? { 
          ...prev, 
          points: prev.points + amount,
          lastCaptchaTime: Date.now()
        } : null
      );
    } catch (err) {
      console.error("Error adding points:", err);
      setError("Failed to add points");
    }
  }

  async function incrementCaptchasSolved() {
    if (!currentUser || !userData) return;

    try {
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      const updates = {
        captchasSolved: userData.captchasSolved + 1,
      };
      await update(userRef, updates);

      setUserData(prev => 
        prev ? { 
          ...prev, 
          captchasSolved: prev.captchasSolved + 1,
        } : null
      );
    } catch (err) {
      console.error("Error updating captchas solved:", err);
      setError("Failed to update stats");
    }
  }

  async function withdrawPoints(amount: number) {
    if (!currentUser || !userData) return;
    if (userData.points < amount) {
      setError("Insufficient points");
      return;
    }

    try {
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      const updates = {
        points: userData.points - amount,
      };
      await update(userRef, updates);

      setUserData(prev => 
        prev ? { 
          ...prev, 
          points: prev.points - amount 
        } : null
      );
    } catch (err) {
      console.error("Error withdrawing points:", err);
      setError("Failed to withdraw points");
    }
  }

  const value = {
    userData,
    loading,
    error,
    addPoints,
    incrementCaptchasSolved,
    withdrawPoints,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
