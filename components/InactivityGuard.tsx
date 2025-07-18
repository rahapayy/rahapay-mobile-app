import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { setItem } from "@/utils/storage";
import { navigationRef } from "@/router/navigationService";
import { useAuth } from "@/services/AuthContext";

const INACTIVITY_TIMEOUT = 20 * 1000; // 20 seconds for testing

export const InactivityGuard = () => {
  const appState = useRef(AppState.currentState);
  const backgroundedAt = useRef<number | null>(null);
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        (nextAppState === "background" || nextAppState === "inactive") &&
        appState.current === "active"
      ) {
        backgroundedAt.current = Date.now();
      } else if (
        nextAppState === "active" &&
        (appState.current === "background" || appState.current === "inactive")
      ) {
        if (backgroundedAt.current) {
          const elapsed = Date.now() - backgroundedAt.current;
          if (elapsed >= INACTIVITY_TIMEOUT) {
            await setItem("SECURITY_LOCK", "true");
            if (navigationRef.isReady()) {
              navigationRef.reset({
                index: 0,
                routes: [{ name: "ExistingUserScreen" }],
              });
            }
          }
        }
        backgroundedAt.current = null;
      }
      appState.current = nextAppState;
    };
    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [setIsAuthenticated]);

  return null;
}; 