import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { getItem, setItem } from "@/utils/storage";
import { handleShowFlash } from "@/components/FlashMessageComponent";

interface BiometricContextType {
  isBiometricEnabled: boolean;
  isBiometricAvailable: boolean;
  biometricType: string;
  isLoading: boolean;
  enableBiometrics: () => Promise<void>;
  disableBiometrics: () => Promise<void>;
  toggleBiometrics: () => Promise<void>;
  checkBiometricAvailability: () => Promise<void>;
  authenticateWithBiometrics: (promptMessage?: string) => Promise<boolean>;
}

const BiometricContext = createContext<BiometricContextType | undefined>(
  undefined
);

interface BiometricProviderProps {
  children: ReactNode;
}

export const BiometricProvider: React.FC<BiometricProviderProps> = ({
  children,
}) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState("Biometric");
  const [isLoading, setIsLoading] = useState(true);

  // Load biometric preference and check availability on mount
  useEffect(() => {
    const initializeBiometrics = async () => {
      try {
        // Load stored biometric preference
        const storedValue = await getItem("BIOMETRIC_ENABLED");
        setIsBiometricEnabled(storedValue === "true");

        // Check biometric availability
        await checkBiometricAvailability();
      } catch (error) {
        console.error("Error initializing biometrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBiometrics();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        setIsBiometricAvailable(true);
        
        // Detect biometric type
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType("Face ID");
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType("Touch ID");
        } else {
          setBiometricType("Biometric");
        }
      } else {
        setIsBiometricAvailable(false);
        setBiometricType("Biometric");
      }
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      setIsBiometricAvailable(false);
    }
  };

  const authenticateWithBiometrics = async (
    promptMessage: string = "Authenticate to continue"
  ): Promise<boolean> => {
    if (!isBiometricAvailable) {
      throw new Error("Biometric authentication not available");
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: "Use password",
        cancelLabel: "Cancel",
      });

      return result.success;
    } catch (error) {
      console.error("Biometric authentication error:", error);
      throw error;
    }
  };

  const enableBiometrics = async () => {
    if (!isBiometricAvailable) {
      handleShowFlash({
        message: "Biometric authentication not available on this device.",
        type: "danger",
      });
      return;
    }

    try {
      const isAuthenticated = await authenticateWithBiometrics(
        "Authenticate to enable biometrics"
      );

      if (isAuthenticated) {
        setIsBiometricEnabled(true);
        await setItem("BIOMETRIC_ENABLED", "true");
        handleShowFlash({
          message: "Biometrics enabled successfully!",
          type: "success",
        });
      } else {
        handleShowFlash({
          message: "Biometric authentication failed.",
          type: "danger",
        });
      }
    } catch (error) {
      handleShowFlash({
        message: "Failed to enable biometrics. Please try again.",
        type: "danger",
      });
      console.error("Error enabling biometrics:", error);
    }
  };

  const disableBiometrics = async () => {
    try {
      const isAuthenticated = await authenticateWithBiometrics(
        "Authenticate to disable biometrics"
      );

      if (isAuthenticated) {
        setIsBiometricEnabled(false);
        await setItem("BIOMETRIC_ENABLED", "false");
        handleShowFlash({
          message: "Biometrics disabled successfully!",
          type: "success",
        });
      } else {
        handleShowFlash({
          message: "Biometric authentication failed.",
          type: "danger",
        });
      }
    } catch (error) {
      handleShowFlash({
        message: "Failed to disable biometrics. Please try again.",
        type: "danger",
      });
      console.error("Error disabling biometrics:", error);
    }
  };

  const toggleBiometrics = async () => {
    if (isBiometricEnabled) {
      await disableBiometrics();
    } else {
      await enableBiometrics();
    }
  };

  const value: BiometricContextType = {
    isBiometricEnabled,
    isBiometricAvailable,
    biometricType,
    isLoading,
    enableBiometrics,
    disableBiometrics,
    toggleBiometrics,
    checkBiometricAvailability,
    authenticateWithBiometrics,
  };

  return (
    <BiometricContext.Provider value={value}>
      {children}
    </BiometricContext.Provider>
  );
};

export const useBiometrics = (): BiometricContextType => {
  const context = useContext(BiometricContext);
  if (context === undefined) {
    throw new Error("useBiometrics must be used within a BiometricProvider");
  }
  return context;
}; 