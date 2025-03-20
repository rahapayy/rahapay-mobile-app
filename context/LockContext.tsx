import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { useAuth } from "../services/AuthContext";

interface LockContextType {
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  handleUnlock: () => Promise<void>;
  resetInactivityTimer: () => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export const LockProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isLocked, setIsLocked] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Reset the inactivity timer on user interaction
  const resetInactivityTimer = useCallback(() => {
    if (!isAuthenticated) return; // Only reset timer if user is authenticated

    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsLocked(true);
      AsyncStorage.setItem("IS_LOCKED", "true");
    }, INACTIVITY_LIMIT);
  }, [isAuthenticated]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    loadPersistedState();

    // Start the inactivity timer only if the user is authenticated
    if (isAuthenticated) {
      resetInactivityTimer();
    }

    return () => {
      subscription.remove();
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [resetInactivityTimer, isAuthenticated]);

  const handleAppStateChange = async (nextAppState: string) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
      loadPersistedState();
      if (isAuthenticated) {
        resetInactivityTimer(); // Reset timer when app comes to foreground, only for authenticated users
      }
    } else if (nextAppState === "background" && isAuthenticated) {
      // Only lock if the user is authenticated
      await persistAppState();
      setIsLocked(true);
      await AsyncStorage.setItem("IS_LOCKED", "true");
    }
    setAppState(
      nextAppState as
        | "active"
        | "background"
        | "inactive"
        | "unknown"
        | "extension"
    );
  };

  const persistAppState = async () => {
    try {
      const stateToPersist = {};
      await AsyncStorage.setItem("appState", JSON.stringify(stateToPersist));
      console.log("App state persisted!");
    } catch (error) {
      console.log("Error saving state to AsyncStorage: ", error);
    }
  };

  const loadPersistedState = async () => {
    try {
      const savedState = await AsyncStorage.getItem("appState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log("Restored app state:", parsedState);
      }

      // Only set isLocked if the user is authenticated
      const isLockedState = await AsyncStorage.getItem("IS_LOCKED");
      if (isLockedState === "true" && isAuthenticated) {
        setIsLocked(true);
      } else {
        setIsLocked(false); // Ensure lock is disabled if not authenticated
        await AsyncStorage.setItem("IS_LOCKED", "false");
      }

      const onboardingState = await AsyncStorage.getItem("ONBOARDING_STATE");
      if (onboardingState) {
        const { email, userId, step } = JSON.parse(onboardingState);
        if (step === "verifyEmail") {
          // Navigation will be handled by App.tsx
        } else if (step === "createPin") {
          // Navigation will be handled by App.tsx
        }
      }
    } catch (error) {
      console.log("Error loading state from AsyncStorage: ", error);
    }
  };

  // Reset isLocked when isAuthenticated changes
  useEffect(() => {
    if (isAuthenticated) {
      // When the user logs in, reset the lock state
      setIsLocked(false);
      AsyncStorage.setItem("IS_LOCKED", "false");
      resetInactivityTimer();
    } else {
      // When the user logs out, clear the lock state and timer
      setIsLocked(false);
      AsyncStorage.setItem("IS_LOCKED", "false");
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    }
  }, [isAuthenticated, resetInactivityTimer]);

  const handleUnlock = async () => {
    setIsLocked(false);
    await AsyncStorage.setItem("IS_LOCKED", "false");
    resetInactivityTimer();
  };

  return (
    <LockContext.Provider
      value={{ isLocked, setIsLocked, handleUnlock, resetInactivityTimer }}
    >
      {children}
    </LockContext.Provider>
  );
};

export const useLock = () => {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error("useLock must be used within a LockProvider");
  }
  return context;
};