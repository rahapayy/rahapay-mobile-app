import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { services } from "../../services";
import { useAuth } from "../../services/AuthContext";
import { setItem } from "../../utils/storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LockStackParamList } from "../../types/RootStackParams";
import { useLock } from "../../context/LockContext";
import { BoldText, RegularText } from "@/components/common/Text";
import { BasicPasswordInput } from "@/components/common/ui/forms/BasicPasswordInput";
import { COLORS, SPACING } from "@/constants/ui";
import Button from "@/components/common/ui/buttons/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Using the app's existing icon components instead of iconsax
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

type PasswordReauthScreenProps = NativeStackScreenProps<
  LockStackParamList,
  "PasswordReauthScreen"
>;

const { width } = Dimensions.get("window");

const PasswordReauthScreen: React.FC<PasswordReauthScreenProps> = ({
  navigation,
}) => {
  const { setIsAuthenticated, setUserInfo, userInfo } = useAuth();
  const { handleUnlock } = useLock();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maskedId, setMaskedId] = useState("");
  const insets = useSafeAreaInsets();

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

  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      handleShowFlash({
        message: "Please enter your password",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: userInfo?.email || userInfo?.phoneNumber || "",
        password,
      };
      const response = await services.authService.login(payload);
      if (response) {
        await setItem("ACCESS_TOKEN", response.data.accessToken, true);
        await setItem("REFRESH_TOKEN", response.data.refreshToken, true);

        const userResponse = await services.authServiceToken.getUserDetails();
        setIsAuthenticated(true);
        setUserInfo(userResponse.data);
        handleShowFlash({
          message: "Logged in successfully!",
          type: "success",
        });
        handleUnlock();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message instanceof Array
          ? error.response.data.message[0]
          : error.response?.data?.message || "An unexpected error occurred";
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.brand.primary} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <BoldText color="black" size="large" style={styles.title}>
              Enter Password
            </BoldText>
            <RegularText color="mediumGrey" size="base" style={styles.subtitle}>
              Please enter your password to unlock
            </RegularText>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <BasicPasswordInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
              />
            </View>

            <Button
              onPress={handlePasswordLogin}
              title={isSubmitting ? "Logging in..." : "Login"}
              textColor="white"
              style={styles.loginButton}
              isLoading={isSubmitting}
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            activeOpacity={0.7}
          >
            <RegularText color="primary" size="base">
              Forgot Password?
            </RegularText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoidView: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 16,
    padding: 8,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerContainer: {
    width: "100%",
    marginBottom: SPACING * 5,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.brand.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userName: {
    marginBottom: 4,
  },
  formContainer: {
    width: "100%",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
  },
  loginButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    marginTop: 8,
  },
  forgotPasswordButton: {
    paddingVertical: 12,
    marginTop: 8,
  },
});

export default PasswordReauthScreen;
