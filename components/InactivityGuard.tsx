import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { setItem, getItem } from "@/utils/storage";
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
            // Only lock the app if user is authenticated
            const lastUserEmail = await getItem("LAST_USER_EMAIL", true);
            const userPassword = await getItem("USER_PASSWORD", true);
            
            if (lastUserEmail && userPassword) {
              // User is authenticated - lock the app
              await setItem("SECURITY_LOCK", "true");
              
              if (navigationRef.isReady()) {
                // Navigate to ExistingUserScreen
                navigationRef.reset({
                  index: 0,
                  routes: [{ name: "ExistingUserScreen" }],
                });
              }
            }
            // If user is not authenticated, don't lock the app - they can continue in AuthStack
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