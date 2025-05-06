import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import { services } from "@/services";
import { useAuth } from "@/services/AuthContext";
import { setItem, removeItem } from "@/utils/storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LockStackParamList } from "@/types/RootStackParams";
import { BoldText, RegularText } from "@/components/common/Text";
import { BasicPasswordInput } from "@/components/common/ui/forms/BasicPasswordInput";
import { COLORS, SPACING } from "@/constants/ui";
import Button from "@/components/common/ui/buttons/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

type PasswordReauthScreenProps = NativeStackScreenProps<
  LockStackParamList,
  "PasswordReauthScreen"
> & {
  onPasswordSuccess: () => void;
};

const { width } = Dimensions.get("window");

const PasswordReauthScreen: React.FC<PasswordReauthScreenProps> = ({
  navigation,
  onPasswordSuccess,
}) => {
  const { userInfo, setUserInfo, setIsAuthenticated } = useAuth();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

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
      console.log("Attempting login with payload:", {
        ...payload,
        password: "***",
      });

      const response = await services.authService.login(payload);
      console.log("Login response:", response);

      if (response) {
        // Set tokens
        await Promise.all([
          setItem("ACCESS_TOKEN", response.data.accessToken, true),
          setItem("REFRESH_TOKEN", response.data.refreshToken, true),
        ]);

        // Get user details
        const userResponse = await services.authServiceToken.getUserDetails();
        console.log("User details response:", userResponse);

        // Update auth state
        setUserInfo(userResponse.data);
        setIsAuthenticated(true);

        // Clear lock screen states
        await Promise.all([
          setItem("IS_LOCKED", "false"),
          removeItem("BACKGROUND_TIMESTAMP"),
          removeItem("LOCK_TIMESTAMP"),
          removeItem("WAS_TERMINATED"),
        ]);

        handleShowFlash({
          message: "Logged in successfully!",
          type: "success",
        });

        // Trigger parent callback to update Router state
        console.log("Calling onPasswordSuccess");
        onPasswordSuccess();
      }
    } catch (error: any) {
      console.error("Password login error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

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
