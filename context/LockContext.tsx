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
  const INACTIVITY_LIMIT = 1 * 60 * 1000; // 1 minute

  // Initialize lock state on mount
  useEffect(() => {
    const initializeLockState = async () => {
      try {
        const isLockedState = await getItem("IS_LOCKED");
        const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
        const currentTime = Date.now();

        console.log("Initializing lock state:");
        console.log("  isAuthenticated:", isAuthenticated);
        console.log("  isLockedState:", isLockedState);
        console.log("  backgroundTimestamp:", backgroundTimestamp);

        if (!isAuthenticated) {
          setIsLocked(false);
          await setItem("IS_LOCKED", "false");
          await removeItem("BACKGROUND_TIMESTAMP");
          await removeItem("LOCK_TIMESTAMP");
          console.log("  Not authenticated, set isLocked to false");
        } else if (backgroundTimestamp) {
          const backgroundDuration =
            currentTime - parseInt(backgroundTimestamp);
          console.log(
            "  Background duration:",
            backgroundDuration / 1000,
            "seconds"
          );
          if (backgroundDuration >= INACTIVITY_LIMIT) {
            setIsLocked(true);
            await setItem("IS_LOCKED", "true");
            await setItem("LOCK_TIMESTAMP", currentTime.toString());
            console.log("  Background > 1 min, set isLocked to true");
          } else {
            setIsLocked(false);
            await setItem("IS_LOCKED", "false");
            console.log("  Background < 1 min, set isLocked to false");
          }
        } else {
          setIsLocked(isLockedState === "true");
          console.log(
            "  No background timestamp, isLocked:",
            isLockedState === "true"
          );
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
  }, []); // Run only on mount

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, appState]); // Depend on appState to ensure updates

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log("AppState change detected:", nextAppState);
    console.log("Previous appState:", appState);

    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
      const backgroundTimestamp = await getItem("BACKGROUND_TIMESTAMP");
      console.log("Retrieved BACKGROUND_TIMESTAMP:", backgroundTimestamp);

      if (backgroundTimestamp && isAuthenticated) {
        const currentTime = Date.now();
        const backgroundDuration = currentTime - parseInt(backgroundTimestamp);
        console.log(
          "Background duration:",
          backgroundDuration / 1000,
          "seconds"
        );

        if (backgroundDuration >= INACTIVITY_LIMIT) {
          console.log("Background duration exceeded 1 minute, locking app");
          setIsLocked(true);
          await setItem("IS_LOCKED", "true");
          await setItem("LOCK_TIMESTAMP", currentTime.toString());
        } else {
          console.log("Background duration < 1 minute, keeping unlocked");
          setIsLocked(false);
          await setItem("IS_LOCKED", "false");
        }
      } else {
        console.log(
          "No background timestamp or not authenticated, isLocked remains:",
          isLocked
        );
      }
      await removeItem("BACKGROUND_TIMESTAMP");
    } else if (nextAppState === "background" && isAuthenticated) {
      const currentTime = Date.now();
      console.log(
        "App going to background, setting BACKGROUND_TIMESTAMP:",
        currentTime
      );
      await setItem("BACKGROUND_TIMESTAMP", currentTime.toString());
    } else {
      console.log("Unhandled AppState transition:", nextAppState);
    }
    setAppState(nextAppState);
  };

  const handleUnlock = async () => {
    const isBiometricEnabled = (await getItem("BIOMETRIC_ENABLED")) === "true";
    if (isBiometricEnabled) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) throw new Error("Biometric hardware not available");

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) throw new Error("No biometric credentials enrolled");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock the app",
        fallbackLabel: "Use PIN",
      });
      if (!result.success) throw new Error("Biometric authentication failed");
    }
    setIsLocked(false);
    await setItem("IS_LOCKED", "false");
    await removeItem("LOCK_TIMESTAMP");
    console.log("App unlocked, isLocked:", false);
  };

  // Reset lock state when authentication changes
  useEffect(() => {
    const resetLockState = async () => {
      if (isAuthenticated) {
        console.log("User authenticated, resetting lock state");
        setIsLocked(false);
        await setItem("IS_LOCKED", "false");
        await removeItem("LOCK_TIMESTAMP");
        await removeItem("BACKGROUND_TIMESTAMP");
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
