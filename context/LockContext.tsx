import React, { useEffect, ReactNode, useContext } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuth } from "../services/AuthContext";
import { setItem } from "@/utils/storage";
import * as Sentry from "@sentry/react-native";

interface LockContextType {}

const LockContext = React.createContext<LockContextType | undefined>(undefined);

export const LockProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        isAuthenticated &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        console.log("App going to background/inactive, setting WAS_TERMINATED");
        try {
          await setItem("WAS_TERMINATED", "true");
        } catch (error) {
          console.error("Error setting WAS_TERMINATED:", error);
          Sentry.captureException(error);
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [isAuthenticated]);

  return <LockContext.Provider value={{}}>{children}</LockContext.Provider>;
};

export const useLock = () => {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error("useLock must be used within a LockProvider");
  }
  return context;
};
