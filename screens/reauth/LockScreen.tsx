import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { services } from "../../services";
import { useAuth } from "../../services/AuthContext";
import { getItem } from "../../utils/storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LockStackParamList } from "../../types/RootStackParams";
import { useLock } from "../../context/LockContext";
import { COLORS, SPACING } from "@/constants/ui";
import Button from "@/components/common/ui/buttons/Button";
import { BoldText, MediumText, RegularText } from "@/components/common/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FaceIdIcon } from "@/components/common/ui/icons";

type LockScreenProps = NativeStackScreenProps<LockStackParamList, "LockScreen">;
const { width } = Dimensions.get("window");

const LockScreen: React.FC<LockScreenProps> = ({ navigation }) => {
  const { setIsAuthenticated, setUserInfo, userInfo, logOut } = useAuth();
  const { handleUnlock } = useLock();
  const [biometricType, setBiometricType] = useState<string>("biometric");
  const insets = useSafeAreaInsets();

  const fullName = userInfo?.fullName || "";
  const firstName = fullName.split(" ")[0] || "";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    // Check biometric type
    (async () => {
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
    })();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        handleShowFlash({
          message: "This device doesn’t support biometric authentication.",
          type: "info",
        });
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        handleShowFlash({
          message:
            "No biometric data enrolled. Please set it up in your device settings.",
          type: "info",
        });
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Log in with ${biometricType}`,
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
            message: `Logged in successfully with ${biometricType}`,
            type: "success",
          });
          handleUnlock();
        } else {
          handleShowFlash({
            message: "No access token found. Please log in with password.",
            type: "danger",
          });
        }
      } else {
        handleShowFlash({
          message: `${biometricType} authentication failed`,
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Biometric login error:", error);
      handleShowFlash({
        message: "An error occurred during biometric login",
        type: "danger",
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.semiCircle} />
      <View style={styles.profileSection}>
        <View style={{ marginTop: 370 }}>
          <MediumText color="black" size="xxlarge" style={styles.welcomeText}>
            Welcome back 🎉
          </MediumText>
          <BoldText color="black" size="xxlarge" style={styles.welcomeText}>
            {firstName}!
          </BoldText>
        </View>
      </View>

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

      <View style={styles.footerSection}>
        <Button
          onPress={() => navigation.navigate("PasswordReauthScreen")}
          title="Login with Password"
          textColor="#5136C1"
          style={styles.passwordButton}
        />
        <TouchableOpacity style={styles.optionButton} onPress={logOut}>
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
  semiCircle: {
    position: "absolute",
    top: -320, // Shifted up to push the top edge off-screen
    right: -320, // Shifted to the right to push the right edge off-screen
    width: 600, // Large size to ensure edges are off-screen
    height: 600,
    backgroundColor: COLORS.brand.primaryLight,
    borderBottomLeftRadius: 320, // Creates the downward curve
    borderBottomRightRadius: 320,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: -1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileSection: {
    marginTop: 30,
    alignItems: "flex-start",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  welcomeText: {
    marginBottom: 8,
  },
  authSection: {
    marginTop: 40,
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
    marginBottom: SPACING * 4,
  },
  passwordButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: COLORS.brand.primaryLight,
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
