import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { setItem, getItem, removeItem } from "@/utils/storage";
import { useAuth } from "@/services/AuthContext";

const INACTIVITY_TIMEOUT = 20 * 1000; // 20 seconds for testing

export const InactivityGuard = () => {
  const appState = useRef(AppState.currentState);
  const backgroundedAt = useRef<number | null>(null);
  const { setIsAuthenticated } = useAuth();

  // Check for force-close scenario on app startup
  useEffect(() => {
    const checkForceClose = async () => {
      try {
        // Check if user is authenticated
        const lastUserEmail = await getItem("LAST_USER_EMAIL", true);
        const userPassword = await getItem("USER_PASSWORD", true);
        const currentTime = Date.now();
        
        if (lastUserEmail && userPassword) {
          // User is authenticated, check if app was force-closed
          const lastActiveTime = await getItem("LAST_ACTIVE_TIMESTAMP");
          
          if (lastActiveTime) {
            const timeSinceLastActive = currentTime - parseInt(lastActiveTime);
            
            // If more than 5 seconds have passed since last active, 
            // the app was likely force-closed and reopened
            if (timeSinceLastActive > 5000) {
              console.log("App was force-closed, locking it");
              await setItem("SECURITY_LOCK", "true");
            }
          }
        }
        
        // Set current timestamp as last active
        await setItem("LAST_ACTIVE_TIMESTAMP", currentTime.toString());
      } catch (error) {
        console.error("Error checking force-close scenario:", error);
      }
    };

    // Small delay to ensure AuthContext is ready
    const timer = setTimeout(checkForceClose, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        (nextAppState === "background" || nextAppState === "inactive") &&
        appState.current === "active"
      ) {
        backgroundedAt.current = Date.now();
        // Update last active timestamp when going to background
        await setItem("LAST_ACTIVE_TIMESTAMP", Date.now().toString());
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
            }
          }
        }
        backgroundedAt.current = null;
        // Update last active timestamp when coming back to active
        await setItem("LAST_ACTIVE_TIMESTAMP", Date.now().toString());
      }
      appState.current = nextAppState;
    };
    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [setIsAuthenticated]);

  return null;
}; 