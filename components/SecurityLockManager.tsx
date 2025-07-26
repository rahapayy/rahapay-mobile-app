import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import { useAuth } from "@/services/AuthContext";
import { getItem } from "@/utils/storage";
import ExistingUserScreen from "@/screens/Auth/Login/ExistingUserScreen";

interface SecurityLockManagerProps {
  children: React.ReactNode;
}

const SecurityLockManager: React.FC<SecurityLockManagerProps> = ({
  children,
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkSecurityLock = async () => {
      if (isAuthenticated) {
        const securityLock = await getItem("SECURITY_LOCK");
        const wasLocked = isLocked;
        const newLocked = securityLock === "true";
        setIsLocked(newLocked);

        if (newLocked !== wasLocked) {
        }
      } else {
        setIsLocked(false);
      }
    };

    checkSecurityLock();

    // Set up interval to check security lock status
    const interval = setInterval(checkSecurityLock, 500); // Check every 500ms
    return () => clearInterval(interval);
  }, [isAuthenticated, isLocked]);

  // Don't show lock screen if user is not authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}
      <Modal
        visible={isLocked}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        hardwareAccelerated
      >
        <ExistingUserScreen
          navigation={{
            goBack: () => setIsLocked(false),
            reset: (params: any) => {
              // When user successfully authenticates, just close the modal
              // The AuthContext will handle the navigation to AppStack
              setIsLocked(false);
            },
            navigate: () => setIsLocked(false),
          }}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SecurityLockManager;
