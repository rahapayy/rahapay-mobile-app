import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuth } from "../services/AuthContext";
import { getItem, removeItem, setItem } from "@/utils/storage";
import * as LocalAuthentication from "expo-local-authentication";

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
  const [isLockStateReady, setIsLockStateReady] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const INACTIVITY_LIMIT = 30 * 1000; // 30 seconds

  // Initialize lock state
  useEffect(() => {
    const initializeLockState = async () => {
      try {
        const isLockedState = await getItem("IS_LOCKED");
        const wasTerminated = await getItem("WAS_TERMINATED");
        const biometricEnabled =
          (await getItem("BIOMETRIC_ENABLED")) === "true";
        setIsBiometricEnabled(biometricEnabled);

        console.log("Initializing lock state:");
        console.log("  isAuthenticated:", isAuthenticated);
        console.log("  isLockedState:", isLockedState);
        console.log("  wasTerminated:", wasTerminated);
        console.log("  biometricEnabled:", biometricEnabled);

        // Only set initial lock state if not already locked
        if (isLockedState !== "true") {
          if (!isAuthenticated) {
            setIsLocked(false);
            await setItem("IS_LOCKED", "false");
            await removeItem("WAS_TERMINATED");
          } else if (wasTerminated === "true") {
            setIsLocked(true);
            await setItem("IS_LOCKED", "true");
            await removeItem("WAS_TERMINATED");
          } else {
            setIsLocked(false);
            await setItem("IS_LOCKED", "false");
          }
        }
      } catch (error) {
        console.log("Error initializing lock state: ", error);
        setIsLocked(false);
      } finally {
        setIsLockStateReady(true);
        console.log("Lock state initialized, isLocked:", isLocked);
      }
    };

    initializeLockState();
  }, [isAuthenticated]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, appState, isBiometricEnabled]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log("AppState change detected:", nextAppState);
    console.log("Previous appState:", appState);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isBiometricEnabled:", isBiometricEnabled);

    // When app is going to background or being terminated
    if (nextAppState === "background" || nextAppState === "inactive") {
      console.log("App is going to background/inactive state");
      if (isAuthenticated) {
        const currentTime = Date.now();
        console.log("Setting BACKGROUND_TIMESTAMP:", currentTime);
        await setItem("BACKGROUND_TIMESTAMP", currentTime.toString());

        // If app is being terminated (inactive state)
        if (nextAppState === "inactive") {
          console.log("App is being terminated, setting WAS_TERMINATED flag");
          await setItem("WAS_TERMINATED", "true");
        }
      }
    }

    // When app is coming to foreground
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");

      // Check if app was terminated
      const wasTerminated = await getItem("WAS_TERMINATED");
      console.log("WAS_TERMINATED flag:", wasTerminated);

      if (wasTerminated === "true") {
        console.log("App was terminated, showing lock screen");
        setIsLocked(true);
        await setItem("IS_LOCKED", "true");
        await removeItem("WAS_TERMINATED");
        return;
      }

      const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
      const biometricEnabled = (await getItem("BIOMETRIC_ENABLED")) === "true";
      setIsBiometricEnabled(biometricEnabled);

      console.log("Background timestamp:", backgroundTimestamp);
      console.log("Biometric enabled:", biometricEnabled);

      if (backgroundTimestamp && isAuthenticated && biometricEnabled) {
        const currentTime = Date.now();
        const backgroundDuration = currentTime - parseInt(backgroundTimestamp);
        console.log(
          "Background duration:",
          backgroundDuration / 1000,
          "seconds"
        );

        if (backgroundDuration >= INACTIVITY_LIMIT) {
          console.log("Background duration exceeded limit, locking app");
          setIsLocked(true);
          await setItem("IS_LOCKED", "true");
          await setItem("LOCK_TIMESTAMP", currentTime.toString());
        } else {
          console.log("Background duration within limit, keeping unlocked");
          setIsLocked(false);
          await setItem("IS_LOCKED", "false");
        }
      } else {
        console.log(
          "No background timestamp, not authenticated, or biometrics disabled"
        );
        setIsLocked(false);
        await setItem("IS_LOCKED", "false");
      }
      await removeItem("BACKGROUND_TIMESTAMP");
    }

    setAppState(nextAppState);
  };

  const handleUnlock = async () => {
    try {
      // Clear all lock-related flags
      await Promise.all([
        setItem("IS_LOCKED", "false"),
        removeItem("LOCK_TIMESTAMP"),
        removeItem("BACKGROUND_TIMESTAMP"),
        removeItem("WAS_TERMINATED"),
      ]);

      setIsLocked(false);
      console.log("App unlocked successfully");
    } catch (error) {
      console.error("Error during unlock:", error);
      throw error;
    }
  };

  // Reset lock state when authentication changes
  useEffect(() => {
    const resetLockState = async () => {
      if (isAuthenticated) {
        console.log("User authenticated, resetting lock state");
        const biometricEnabled =
          (await getItem("BIOMETRIC_ENABLED")) === "true";
        setIsBiometricEnabled(biometricEnabled);
        if (!biometricEnabled) {
          setIsLocked(false);
          await setItem("IS_LOCKED", "false");
        }
      } else {
        console.log("User logged out, clearing lock state");
        setIsLocked(false);
        await setItem("IS_LOCKED", "false");
        await removeItem("LOCK_TIMESTAMP");
        await removeItem("BACKGROUND_TIMESTAMP");
      }
    };

    resetLockState();
  }, [isAuthenticated]);

  return (
    <LockContext.Provider
      value={{ isLocked, setIsLocked, handleUnlock, isLockStateReady }}
    >
      {children}
    </LockContext.Provider>
  );
};

export const useLock = () => {
  const context = useContext(LockContext);
  if (!context) throw new Error("useLock must be used within a LockProvider");
  return context;
};
