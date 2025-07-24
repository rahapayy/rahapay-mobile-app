// utils/biometricUtils.ts
import * as LocalAuthentication from "expo-local-authentication";

export const verifyBiometricsForTransaction = async (
  isBiometricEnabled: boolean
): Promise<boolean> => {
  if (!isBiometricEnabled) {
    return true; // Skip biometric check if not enabled
  }

  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      throw new Error("Biometric hardware not available");
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      throw new Error("No biometric credentials enrolled");
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to proceed with the transaction",
      fallbackLabel: "Use PIN",
    });

    if (!result.success) {
      throw new Error("Biometric authentication failed");
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Example TransactionScreen.tsx
// import React from "react";
// import { View, TouchableOpacity, Alert } from "react-native";
// import { verifyBiometricsForTransaction } from "../utils/biometricUtils";
// import { MediumText } from "../components/common/Text";

// const TransactionScreen: React.FC = () => {
//   const handleTransaction = async () => {
//     try {
//       await verifyBiometricsForTransaction();
//       // Proceed with transaction logic (e.g., API call)
//       Alert.alert("Success", "Transaction completed!");
//     } catch (error) {
//       Alert.alert("Error", (error as Error).message || "Transaction failed.");
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <TouchableOpacity onPress={handleTransaction}>
//         <MediumText>Make Transaction</MediumText>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default TransactionScreen;