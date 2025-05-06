import React, { createContext, useContext, useState, useEffect } from "react";
import * as Updates from "expo-updates";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";

interface VersionUpdateContextType {
  checkForUpdates: () => Promise<void>;
  isUpdateAvailable: boolean;
  isChecking: boolean;
}

const VersionUpdateContext = createContext<
  VersionUpdateContextType | undefined
>(undefined);

export const useVersionUpdate = () => {
  const context = useContext(VersionUpdateContext);
  if (!context) {
    throw new Error(
      "useVersionUpdate must be used within a VersionUpdateProvider"
    );
  }
  return context;
};

export const VersionUpdateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setIsUpdateAvailable(true);
        showUpdateAlert();
      } else {
        setIsUpdateAvailable(false);
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const showUpdateAlert = () => {
    Alert.alert(
      "Update Available",
      "A new version of RahaPay is available. Would you like to update now?",
      [
        {
          text: "Later",
          style: "cancel",
        },
        {
          text: "Update Now",
          onPress: async () => {
            try {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            } catch (error) {
              console.error("Error updating app:", error);
              Alert.alert(
                "Update Failed",
                "Failed to update the app. Please try again later."
              );
            }
          },
        },
      ]
    );
  };

  // Check for updates when the app starts
  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <VersionUpdateContext.Provider
      value={{
        checkForUpdates,
        isUpdateAvailable,
        isChecking,
      }}
    >
      {children}
    </VersionUpdateContext.Provider>
  );
};
