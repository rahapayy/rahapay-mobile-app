import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuth } from "../services/AuthContext";
import { setItem, removeItem } from "@/utils/storage";
import * as Sentry from "@sentry/react-native";

interface LockContextType {
  // Empty for now, can add utilities if needed
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export const LockProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const setTerminationFlag = async () => {
      if (isAuthenticated) {
        console.log("Setting WAS_TERMINATED flag");
        await setItem("WAS_TERMINATED", "true");
      }
    };

    setTerminationFlag().catch((error) => {
      console.error("Error setting termination flag:", error);
      Sentry.captureException(error);
    });

    return () => {
      setTerminationFlag().catch((error) => {
        console.error("Error in cleanup termination flag:", error);
        Sentry.captureException(error);
      });
    };
  }, [isAuthenticated]);

  return (
    <LockContext.Provider value={{}}>
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