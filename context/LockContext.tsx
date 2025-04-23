import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuth } from "../services/AuthContext";
import { getItem, setItem, removeItem } from "@/utils/storage";

// Constants
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

interface LockContextType {
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  handleUnlock: () => Promise<void>;
  isLockStateReady: boolean;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export const LockProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isLockStateReady, setIsLockStateReady] = useState<boolean>(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  // Initialize the lock state and settings
  useEffect(() => {
    const initialize = async () => {
      let shouldBeLocked = false;
      try {
        // Determine initial lock state
        const wasTerminated = await getItem("WAS_TERMINATED");
        if (wasTerminated === "true") {
          shouldBeLocked = true;
          await removeItem("WAS_TERMINATED");
        } else if (isAuthenticated) {
          // If not terminated but authenticated, check background time
          const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
          if (backgroundTimestamp) {
            const lastBackgroundTime = parseInt(backgroundTimestamp, 10);
            const currentTime = Date.now();
            const backgroundDuration = currentTime - lastBackgroundTime;
            if (backgroundDuration >= INACTIVITY_TIMEOUT) {
              shouldBeLocked = true;
            }
            await removeItem("BACKGROUND_TIMESTAMP");
          } else {
            const isLockedState = await getItem("IS_LOCKED");
            shouldBeLocked = isLockedState === "true";
          }
        }
      } catch (error) {
        console.error("Error initializing lock state:", error);
      } finally {
        setIsLocked(shouldBeLocked);
        setIsLockStateReady(true);
        await setItem("IS_LOCKED", shouldBeLocked ? "true" : "false");
      }
    };

    initialize();
  }, [isAuthenticated]);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appState === "active" &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        if (isAuthenticated) {
          const currentTime = Date.now();
          await setItem("BACKGROUND_TIMESTAMP", currentTime.toString());
        }
      }

      if (
        (appState.match(/inactive|background/) || appState === "inactive") &&
        nextAppState === "active"
      ) {
        const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
        if (backgroundTimestamp && isAuthenticated) {
          const currentTime = Date.now();
          const backgroundDuration =
            currentTime - parseInt(backgroundTimestamp, 10);
          if (backgroundDuration > INACTIVITY_TIMEOUT) {
            setIsLocked(true);
          } else {
            setIsLocked(false);
          }
          await removeItem("BACKGROUND_TIMESTAMP");
        }
        await removeItem("WAS_TERMINATED");
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState, isAuthenticated]);

  // Termination handling using component lifecycle
  useEffect(() => {
    const setTerminationFlag = async () => {
      if (isAuthenticated) {
        await setItem("WAS_TERMINATED", "true");
      }
    };

    return () => {
      setTerminationFlag().catch(console.error);
    };
  }, [isAuthenticated]);

  const handleUnlock = async () => {
    setIsLocked(false);
    await Promise.all([
      setItem("IS_LOCKED", "false"),
      removeItem("BACKGROUND_TIMESTAMP"),
      removeItem("LOCK_TIMESTAMP"),
      removeItem("WAS_TERMINATED"),
    ]).catch((error) => {
      console.error("Error during unlock:", error);
      throw error;
    });
  };

  return (
    <LockContext.Provider
      value={{
        isLocked,
        setIsLocked,
        handleUnlock,
        isLockStateReady,
      }}
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
