import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

const checkBiometricSupport = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    Alert.alert("Biometric authentication is not supported on this device.");
    return false;
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    Alert.alert(
      "No biometric authentication methods are enrolled on this device."
    );
    return false;
  }

  return true;
};

export const authenticateWithBiometrics = async () => {
  const isBiometricSupported = await checkBiometricSupport();
  if (!isBiometricSupported) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to continue",
    fallbackLabel: "Use passcode",
    cancelLabel: "Cancel",
    disableDeviceFallback: false,
  });

  return result.success;
};
