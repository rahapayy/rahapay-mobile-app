import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  AppState,
  TextInput,
  Keyboard,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native"; // Use specific type for navigation
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons"; // For Face ID icon (or use your icon library)
import { getItem, setItem } from "@/utils/storage";
import COLORS from "@/constants/colors";
import SPACING from "@/constants/SPACING";
import { useAuth } from "@/services/AuthContext"; // Still needed for isAuthenticated and userInfo
import * as LocalAuthentication from "expo-local-authentication"; // For biometric authentication
import { services } from "@/services";
import OtpInput from "@/components/common/ui/forms/OtpInput"; // Assuming you have an OTP input component
import { IReAuthenticateDto } from "@/services/dtos";
import { AppStackParamList, AuthStackParamList } from "@/types/RootStackParams"; // Adjust path based on your types file

// Define the navigation prop type for ExistingUserScreen with all navigation methods
type ExistingUserScreenNavigationProp = NavigationProp<
  AppStackParamList | AuthStackParamList,
  "ExistingUserScreen"
> & {
  navigate: (name: string, params?: any) => void;
  replace: (name: string, params?: any) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  // Add other navigation methods as needed
};

const ExistingUserScreen: React.FC<{
  navigation?: ExistingUserScreenNavigationProp; // Make navigation optional to handle undefined cases
}> = ({ navigation }) => {
  const { isAuthenticated, userInfo, setIsAuthenticated, setUserInfo } =
    useAuth();
  const [lastActiveTime, setLastActiveTime] = useState<Date | null>(null);
  const [pin, setPin] = useState<string[]>(Array(6).fill("")); // 6-digit PIN state
  const [showPinInput, setShowPinInput] = useState(false); // Show PIN input instead of biometric
  const [pinError, setPinError] = useState<string | null>(null); // PIN error state
  const [isReauthenticating, setIsReauthenticating] = useState(false); // Track re-authentication state

  // Fallback navigation using useNavigation hook if prop is undefined
  const nav = useNavigation<ExistingUserScreenNavigationProp>();

  // Use navigation prop if available, otherwise fall back to useNavigation hook
  const safeNavigation = navigation || nav;

  // Load last active time from AsyncStorage or set current time on mount
  useEffect(() => {
    const loadLastActiveTime = async () => {
      try {
        const savedTime = await getItem("LASTACTIVETIME");
        if (savedTime) {
          setLastActiveTime(new Date(savedTime));
        } else {
          setLastActiveTime(new Date());
          await setItem("LASTACTIVETIME", new Date().toISOString());
        }
      } catch (error) {
        console.error("Error loading last active time:", error);
      }
    };

    loadLastActiveTime();

    // Check biometric support and set initial state
    checkBiometricSupport();

    // Listen for app state changes to update last active time and prevent auto-auth
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  // Check biometric support on mount
  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      setShowPinInput(true); // Show PIN input if no biometric support
    }
  };

  // Handle app state changes (background/foreground) to prevent auto-auth
  const handleAppStateChange = async (nextAppState: string) => {
    console.log("App state changed to:", nextAppState);
    if (nextAppState === "background") {
      try {
        await setItem("LASTACTIVETIME", new Date().toISOString());
        console.log(
          "LASTACTIVETIME updated on background:",
          new Date().toISOString()
        );
      } catch (error) {
        console.error("Error updating LASTACTIVETIME on background:", error);
      }
    } else if (nextAppState === "active") {
      // Do not auto-authenticate; require user interaction
      checkInactivity();
    }
  };

  // Check if user has been inactive for 1 minute, but don’t auto-authenticate
  const checkInactivity = () => {
    if (!lastActiveTime || !isAuthenticated) return;

    const now = new Date();
    const timeDiff = (now.getTime() - lastActiveTime.getTime()) / 1000; // In seconds
    const isInactiveForOneMinute = timeDiff >= 60; // 1 minute for testing

    if (isInactiveForOneMinute && !isReauthenticating) {
      // Do nothing here; Router will handle showing this screen, but don’t auto-auth
      setIsReauthenticating(false); // Ensure we’re not auto-authenticating
    }
  };

  // Handle biometric login with access token from AsyncStorage
  const handleBiometricLogin = async () => {
    if (!isAuthenticated) {
      Alert.alert("Error", "Session expired. Please log in again.");
      safeNavigation.navigate("LoginScreen");
      return;
    }

    try {
      setIsReauthenticating(true);
      const accessToken = await getItem("ACCESS_TOKEN", true); // Fetch access token from AsyncStorage
      if (!accessToken) {
        Alert.alert("Error", "No access token found. Please log in again.");
        safeNavigation.navigate("LoginScreen");
        setIsReauthenticating(false);
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        setShowPinInput(true); // Fall back to PIN if no biometric hardware
        setIsReauthenticating(false);
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        setShowPinInput(true); // Fall back to PIN if no biometric data enrolled
        setIsReauthenticating(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Face ID to access RahaPay",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        const userResponse = await services.authServiceToken.getUserDetails(); // Uses accessToken via axiosInstance
        setIsAuthenticated(true);
        setUserInfo(userResponse.data);
        handleShowFlash({
          message: "Logged in successfully with Face ID",
          type: "success",
        });
        await setItem("LASTACTIVETIME", new Date().toISOString()); // Update last active time
        safeNavigation.navigate("AppStack" as never); // Navigate to app stack using existing session
      } else {
        Alert.alert(
          "Authentication Failed",
          "Face ID authentication failed. Please try again or log in with password."
        );
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Alert.alert(
        "Error",
        "Biometric authentication failed. Please try again."
      );
    } finally {
      setIsReauthenticating(false);
    }
  };

  // Handle PIN-based re-authentication using the /auth/re-authenticate endpoint
  const handlePinSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert("Error", "Session expired. Please log in again.");
      safeNavigation.navigate("LoginScreen");
      return;
    }

    try {
      setIsReauthenticating(true);
      const accessToken = await getItem("ACCESS_TOKEN", true); // Fetch access token from AsyncStorage
      if (!accessToken) {
        Alert.alert("Error", "No access token found. Please log in again.");
        safeNavigation.navigate("LoginScreen");
        setIsReauthenticating(false);
        return;
      }

      const pinValue = pin.join(""); // Convert 6-digit PIN array to string
      if (pinValue.length !== 6 || !/^\d+$/.test(pinValue)) {
        setPinError("Please enter a valid 6-digit PIN");
        setIsReauthenticating(false);
        return;
      }

      const payload: IReAuthenticateDto = {
        pin: pinValue, // Assuming IReAuthenticateDto has a pin field
      };

      const response = await services.authService.reauthenticate(payload); // Use re-authenticate endpoint
      if (response) {
        const userResponse = await services.authServiceToken.getUserDetails(); // Refresh user info
        setIsAuthenticated(true);
        setUserInfo(userResponse.data);
        handleShowFlash({
          message: "Logged in successfully with PIN",
          type: "success",
        });
        setPin(Array(6).fill("")); // Clear PIN
        setPinError(null);
        await setItem("LASTACTIVETIME", new Date().toISOString()); // Update last active time
        safeNavigation.navigate("AppStack" as never); // Navigate to app stack using existing session
      }
    } catch (error: any) {
      let errorMessage = "An error occurred during PIN authentication";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Invalid PIN";
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error("PIN authentication error:", errorMessage);
      setPinError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsReauthenticating(false);
    }
  };

  // Handle switch account or login with password
  const handleSwitchAccount = () => {
    // Reset authentication state before navigating
    setIsAuthenticated(false);
    setUserInfo(null);
    if (safeNavigation.canGoBack()) {
      safeNavigation.goBack(); // Try going back if possible
    } else {
      safeNavigation.replace("LoginScreen"); // Replace current screen with LoginScreen if no back stack
    }
  };

  const handleLoginWithPassword = () => {
    // Reset authentication state before navigating
    setIsAuthenticated(false);
    setUserInfo(null);
    if (safeNavigation.canGoBack()) {
      safeNavigation.goBack(); // Try going back if possible
    } else {
      safeNavigation.replace("LoginScreen"); // Replace current screen with LoginScreen if no back stack
    }
  };

  // Use userInfo for dynamic user data
  const userName = userInfo?.fullName || "Jonah";
  const phoneNumber = userInfo?.phoneNumber || "806****308";

  const handleShowFlash = (options: {
    message: string;
    type: "success" | "danger" | "info";
  }) => {
    // Implement or import handleShowFlash from your FlashMessageComponent
    console.log(`Flash Message: ${options.message} (${options.type})`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>RahaPay</Text>
      </View>

      {/* User Info Circle */}
      <View style={styles.userCircle}>
        <Text style={styles.userCircleText}>
          {userName.charAt(0).toUpperCase() || "R"}
        </Text>
      </View>

      {/* User Info */}
      <Text style={styles.userName}>
        {userName} ({phoneNumber.replace(/\d{4}$/, "****")})
      </Text>

      {showPinInput ? (
        <>
          <Text style={styles.pinPrompt}>Enter Your 6-Digit PIN</Text>
          <OtpInput
            length={6}
            value={pin}
            onChange={(newPin) => {
              setPin(newPin);
              if (
                newPin.every((digit) => digit !== "") &&
                !isReauthenticating
              ) {
                handlePinSubmit();
              }
            }}
            autoFocus={true}
            secureTextEntry={true}
          />
          {pinError && <Text style={styles.errorText}>{pinError}</Text>}
        </>
      ) : (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={() => {
            if (!isReauthenticating) handleBiometricLogin();
          }}
          disabled={isReauthenticating}
        >
          <Ionicons name="scan" size={24} color={COLORS.green300} />
          <Text style={styles.biometricText}>Click to Login with Face ID</Text>
        </TouchableOpacity>
      )}

      {/* Switch Account and Login with Password */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={handleSwitchAccount}
          disabled={isReauthenticating}
        >
          <Text style={styles.actionText}>Switch Account</Text>
        </TouchableOpacity>
        <Text style={styles.separator}> | </Text>
        <TouchableOpacity
          onPress={handleLoginWithPassword}
          disabled={isReauthenticating}
        >
          <Text style={styles.actionText}>Login with Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING * 2,
  },
  logoContainer: {
    marginBottom: SPACING * 4,
  },
  logoText: {
    fontSize: RFValue(24),
    fontFamily: "Outfit-Bold",
    color: COLORS.violet400,
  },
  userCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.black100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING * 2,
  },
  userCircleText: {
    fontSize: RFValue(24),
    fontFamily: "Outfit-Bold",
    color: COLORS.violet400,
  },
  userName: {
    fontSize: RFValue(16),
    fontFamily: "Outfit-Regular",
    color: "#000",
    marginBottom: SPACING * 3,
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: SPACING * 2,
    paddingHorizontal: SPACING * 3,
    borderRadius: 12, // Slightly larger for modern look
    borderWidth: 1.5, // Thicker border for emphasis
    borderColor: COLORS.green300,
    marginBottom: SPACING * 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  biometricText: {
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
    color: COLORS.green400,
    marginLeft: SPACING,
  },
  pinPrompt: {
    fontSize: RFValue(16),
    fontFamily: "Outfit-Regular",
    color: "#000",
    marginBottom: SPACING * 2,
  },
  errorText: {
    color: COLORS.red300,
    fontSize: RFValue(12),
    marginTop: SPACING,
    fontFamily: "Outfit-Regular",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
    color: COLORS.green400,
  },
  separator: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
    color: COLORS.green400,
    marginHorizontal: SPACING / 2,
  },
});

export default ExistingUserScreen;
