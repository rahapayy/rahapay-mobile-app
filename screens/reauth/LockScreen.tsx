import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { COLORS, SPACING } from "@/constants/ui";
import Button from "@/components/common/ui/buttons/Button";
import { BoldText, MediumText, RegularText } from "@/components/common/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FaceIdIcon } from "@/components/common/ui/icons";
import { UserInfo } from "../../types/user";
import { getItem } from "@/utils/storage";

const { width, height } = Dimensions.get("window");

type LockScreenProps = {
  onBiometricSuccess: () => void;
  onBiometricFailure: () => void;
  onPasswordLogin: () => void;
  onSwitchAccount: () => void;
  userInfo: UserInfo | null;
};

const LockScreen: React.FC<LockScreenProps> = ({
  onBiometricSuccess,
  onBiometricFailure,
  onPasswordLogin,
  onSwitchAccount,
  userInfo,
}) => {
  const [biometricType, setBiometricType] = useState<string>("biometric");
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const insets = useSafeAreaInsets();

  const fullName = userInfo?.fullName || "";
  const firstName = fullName.split(" ")[0] || "";

  useEffect(() => {
    (async () => {
      try {
        const biometricEnabled = await getItem("BIOMETRIC_ENABLED");
        setIsBiometricEnabled(biometricEnabled === "true");

        if (biometricEnabled !== "true") {
          return; // Skip biometric authentication if not enabled
        }

        const supportedTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometricType("Face ID");
        } else if (
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FINGERPRINT
          )
        ) {
          setBiometricType("Fingerprint");
        }

        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
          handleBiometricLogin();
        } else {
          handleShowFlash({
            message:
              "Biometric authentication not available. Please use password login.",
            type: "info",
          });
        }
      } catch (error) {
        console.error("Error checking biometric support:", error);
        console.error(error);
        handleShowFlash({
          message: "Error checking biometric support",
          type: "danger",
        });
      }
    })();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        handleShowFlash({
          message: "This device doesn't support biometric authentication.",
          type: "info",
        });
        onBiometricFailure();
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        handleShowFlash({
          message:
            "No biometric data enrolled. Please set it up in your device settings.",
          type: "info",
        });
        onBiometricFailure();
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Log in with ${biometricType}`,
        fallbackLabel: "Use Password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        console.log("Biometric authentication successful");
        onBiometricSuccess();
        handleShowFlash({
          message: `Logged in successfully with ${biometricType}`,
          type: "success",
        });
      } else {
        console.log("Biometric authentication failed");
        handleShowFlash({
          message: `${biometricType} authentication failed`,
          type: "danger",
        });
        onBiometricFailure();
      }
    } catch (error) {
      console.error("Biometric login error:", error);
      console.error(error);
      handleShowFlash({
        message: "An error occurred during biometric login",
        type: "danger",
      });
      onBiometricFailure();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.profileSection}>
        <View style={styles.welcomeWrapper}>
          <MediumText color="black" size="xxlarge" style={styles.welcomeText}>
            Welcome back 🎉
          </MediumText>
          <BoldText color="black" size="xxlarge" style={styles.welcomeText}>
            {firstName}!
          </BoldText>
        </View>
      </View>

      {isBiometricEnabled && (
        <View style={styles.authSection}>
          <TouchableOpacity
            onPress={handleBiometricLogin}
            style={styles.biometricButton}
            activeOpacity={0.8}
          >
            <View style={styles.biometricButtonCircle}>
              {biometricType === "Face ID" ? (
                <FaceIdIcon fill={COLORS.brand.primary} />
              ) : (
                <MaterialIcons name="fingerprint" size={30} color="#FFFFFF" />
              )}
            </View>
            <RegularText
              color="mediumGrey"
              size="medium"
              style={styles.biometricText}
            >
              Unlock with {biometricType}
            </RegularText>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footerSection}>
        <Button
          onPress={onPasswordLogin}
          title="Login with Password"
          textColor="#5136C1"
          style={styles.passwordButton}
        />
        <TouchableOpacity style={styles.optionButton} onPress={onSwitchAccount}>
          <MaterialIcons
            name="people-alt"
            size={18}
            color={COLORS.brand.primary}
          />
          <RegularText color="primary" size="base" style={styles.optionText}>
            Switch Account
          </RegularText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  profileSection: {
    marginTop: height * 0.5,
    alignItems: "flex-start",
  },
  welcomeWrapper: {},
  welcomeText: {
    marginBottom: 8,
  },
  authSection: {
    marginTop: height * 0.05,
    alignItems: "flex-start",
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  biometricButtonCircle: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.brand.primaryLight,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  biometricText: {
    marginTop: 0,
  },
  footerSection: {
    marginTop: "auto",
    alignItems: "center",
    marginBottom: SPACING * 2,
  },
  passwordButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: COLORS.brand.primary,
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 8,
  },
});

export default LockScreen;
