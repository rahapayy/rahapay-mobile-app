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
import { COLORS } from "@/constants/ui";
import Button from "@/components/common/ui/buttons/Button";
import { BoldText, RegularText } from "@/components/common/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Using the app's existing icon components instead of iconsax
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type LockScreenProps = NativeStackScreenProps<LockStackParamList, "LockScreen">;
const { width } = Dimensions.get("window");

const LockScreen: React.FC<LockScreenProps> = ({ navigation }) => {
  const { setIsAuthenticated, setUserInfo, userInfo, logOut } = useAuth();
  const { handleUnlock } = useLock();
  const [maskedId, setMaskedId] = useState("");
  const [biometricType, setBiometricType] = useState<string>("biometric");
  const insets = useSafeAreaInsets();

  const fullName = userInfo?.fullName || "";
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

    // Mask the user's email or phone number
    if (userInfo?.email) {
      const [username, domain] = userInfo.email.split("@");
      const maskedUsername = username.slice(0, 2) + "•••" + username.slice(-2);
      setMaskedId(`${maskedUsername}@${domain}`);
    } else if (userInfo?.phoneNumber) {
      const maskedPhone = userInfo.phoneNumber.replace(
        /^(\d{3})(\d{3})(\d{4})$/,
        "$1•••$3"
      );
      setMaskedId(maskedPhone);
    }
  }, [userInfo]);

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
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <BoldText color="white" size="xlarge">
              {initials}
            </BoldText>
          </View>
        </View>

        <BoldText color="black" size="large" style={styles.welcomeText}>
          Welcome back!
        </BoldText>
        <RegularText
          color="mediumGrey"
          size="medium"
          style={styles.maskedIdText}
        >
          {maskedId}
        </RegularText>
      </View>

      <View style={styles.authSection}>
        <TouchableOpacity
          onPress={handleBiometricLogin}
          style={styles.biometricButton}
          activeOpacity={0.8}
        >
          <View style={styles.biometricButtonCircle}>
            {biometricType === "Face ID" ? (
              <MaterialIcons name="face" size={30} color="#FFFFFF" />
            ) : (
              <MaterialIcons name="fingerprint" size={30} color="#FFFFFF" />
            )}
          </View>
          <RegularText
            color="mediumGrey"
            size="medium"
            style={styles.biometricText}
          >
            Login with {biometricType}
          </RegularText>
        </TouchableOpacity>
      </View>
      <View className="gap-4">
        <Button
          onPress={() => navigation.navigate("PasswordReauthScreen")}
          title="Login with Password"
          textColor="white"
          style={styles.passwordButton}
          iconPosition="left"
          icon={<MaterialIcons name="lock" size={20} color="#FFFFFF" />}
        />
        <View style={styles.optionsContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 140,
    height: 50,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
  },
  avatarContainer: {
    borderRadius: 50,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: COLORS.brand.primary,
  },
  welcomeText: {
    marginTop: 12,
    marginBottom: 4,
  },
  maskedIdText: {
    marginBottom: 24,
  },
  authSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  biometricButton: {
    alignItems: "center",
    marginBottom: 24,
  },
  biometricButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: COLORS.brand.primary,
  },
  biometricText: {
    marginTop: 4,
  },
  passwordButton: {
    width: width * 0.8,
    height: 50,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // width: "100%",
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  optionText: {
    marginLeft: 5,
  },
});

export default LockScreen;
