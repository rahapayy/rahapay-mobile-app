import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { services } from "../../services";
import { useAuth } from "../../services/AuthContext";
import { getItem } from "../../utils/storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LockStackParamList } from "../../types/RootStackParams";
import { useLock } from "../../context/LockContext";

type LockScreenProps = NativeStackScreenProps<LockStackParamList, "LockScreen">;

const LockScreen: React.FC<LockScreenProps> = ({ navigation }) => {
  const { setIsAuthenticated, setUserInfo, userInfo } = useAuth();
  const { handleUnlock } = useLock(); // Use the LockContext to get handleUnlock
  const [maskedId, setMaskedId] = useState("");

  useEffect(() => {
    // Mask the user's email or phone number
    if (userInfo?.email) {
      const [username, domain] = userInfo.email.split("@");
      const maskedUsername = username.slice(0, 2) + "****" + username.slice(-2);
      setMaskedId(`${maskedUsername}@${domain}`);
    } else if (userInfo?.phoneNumber) {
      const maskedPhone = userInfo.phoneNumber.replace(
        /^(\d{3})(\d{3})(\d{4})$/,
        "$1****$3"
      );
      setMaskedId(maskedPhone);
    }
  }, [userInfo]);

  const handleBiometricLogin = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        handleShowFlash({
          message: "Biometric authentication is not available on this device",
          type: "info",
        });
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        handleShowFlash({
          message: "No biometric data enrolled on this device",
          type: "info",
        });
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Log in with Face ID",
        fallbackLabel: "Use Password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        const accessToken = await getItem("ACCESS_TOKEN", true);
        if (accessToken) {
          const userResponse = await services.authServiceToken.getUserDetails();
          setIsAuthenticated(true);
          setUserInfo(userResponse.data);
          handleShowFlash({
            message: "Logged in successfully with Face ID",
            type: "success",
          });
          handleUnlock(); // Use handleUnlock from context
        } else {
          handleShowFlash({
            message: "No access token found. Please log in with password.",
            type: "danger",
          });
        }
      } else {
        handleShowFlash({
          message: "Face ID authentication failed",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Biometric login error:", error);
      handleShowFlash({
        message: "An error occurred during Face ID login",
        type: "danger",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo (replace with your app's logo) */}
      {/* <Image
        source={require("../assets/logo.png")} // Replace with your logo path
        style={styles.logo}
      /> */}
      {/* User ID (masked) */}
      <Text style={styles.userId}>{maskedId}</Text>
      {/* Face ID Icon */}
      <TouchableOpacity
        onPress={handleBiometricLogin}
        style={styles.faceIdButton}
      >
        <Text style={styles.faceIdText}>Click to Login with Biometric</Text>
      </TouchableOpacity>
      {/* Switch Account and Login with Password Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity>
          <Text style={styles.optionText}>Switch Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("PasswordReauthScreen")}
        >
          <Text style={styles.optionText}>Login with Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  userId: {
    fontSize: 18,
    color: "#333",
    marginBottom: 30,
  },
  faceIdButton: {
    marginBottom: 20,
  },
  faceIdText: {
    fontSize: 16,
    color: "#00C4B4",
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  optionText: {
    fontSize: 14,
    color: "#00C4B4",
  },
});

export default LockScreen;
