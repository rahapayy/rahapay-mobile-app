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
import { COLORS } from "@/constants/ui";
import Button from "@/components/common/ui/buttons/Button";
import { BoldText, RegularText } from "@/components/common/Text";

type LockScreenProps = NativeStackScreenProps<LockStackParamList, "LockScreen">;

const LockScreen: React.FC<LockScreenProps> = ({ navigation }) => {
  const { setIsAuthenticated, setUserInfo, userInfo } = useAuth();
  const { handleUnlock } = useLock(); // Use the LockContext to get handleUnlock
  const [maskedId, setMaskedId] = useState("");

  const fullName = userInfo?.fullName || "";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

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
      <View style={styles.avatar}>
        <BoldText color="white" size="large">
          {initials}
        </BoldText>
      </View>
      {/* User ID (masked) */}
      <RegularText color="black">{maskedId}</RegularText>
      {/* Face ID Icon */}
      <TouchableOpacity
        onPress={handleBiometricLogin}
        style={styles.faceIdButton}
      >
        <RegularText color="primary">Click to Login with Biometric</RegularText>
      </TouchableOpacity>
      {/* Switch Account and Login with Password Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity>
          <RegularText color="primary">Switch Account</RegularText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("PasswordReauthScreen")}
        >
          <RegularText color="primary">Login with Password</RegularText>
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
  faceIdButton: {
    marginBottom: 20,
  },
  faceIdText: {
    fontSize: 16,
    color: COLORS.brand.primary,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    gap: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: COLORS.brand.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});

export default LockScreen;

{
  /* <Button
        title=""
        textColor=""
        iconPosition="left"
        icon={< color="" />}
      /> */
}
