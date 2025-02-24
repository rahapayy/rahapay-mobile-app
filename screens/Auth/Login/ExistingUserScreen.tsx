import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  AppState,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons"; // For the face ID icon (or use your icon library)
import { getItem, setItem } from "@/utils/storage";
import COLORS from "@/constants/colors";
import SPACING from "@/constants/SPACING";
import { useAuth } from "@/services/AuthContext";

const ExistingUserScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated, userInfo,  } = useAuth();
  const [showBiometricOption, setShowBiometricOption] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState<Date | null>(null);

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

    // Listen for app state changes to update last active time
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  // Handle app state changes (background/foreground)
  const handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === "background") {
      await setItem("LASTACTIVETIME", new Date().toISOString());
    } else if (nextAppState === "active") {
      checkInactivity();
    }
  };

  // Check if user has been inactive for 1 minute
  const checkInactivity = () => {
    if (!lastActiveTime) return;

    const now = new Date();
    const timeDiff = (now.getTime() - lastActiveTime.getTime()) / 1000; // In seconds
    const isInactiveForOneMinute = timeDiff >= 60; // 1 minute for testing

    if (isInactiveForOneMinute) {
      setShowBiometricOption(true);
    }
  };

  // Handle biometric login
  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Face ID",
        cancelLabel: "Cancel",
      });

      if (result.success) {
        Alert.alert("Success", "Logged in with Face ID!");
        navigation.navigate("AppStack" as never); // Navigate to app stack after success
        setShowBiometricOption(false); // Hide biometric option after success
        await setItem("LASTACTIVETIME", new Date().toISOString()); // Update last active time
      } else {
        Alert.alert(
          "Authentication Failed",
          "Please try again or log in with password."
        );
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Alert.alert(
        "Error",
        "Biometric authentication failed. Please try again."
      );
    }
  };

  // Handle switch account or login with password
  const handleSwitchAccount = () => {
    navigation.navigate("LoginScreen" as never); // Navigate back to login
  };

  const handleLoginWithPassword = () => {
    navigation.navigate("LoginScreen" as never); // Navigate to password login
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
        <Text style={styles.userCircleText}>R</Text>
      </View>

      {/* User Info */}
      <Text style={styles.userName}>Jonah (806****308)</Text>

      {/* Face ID Login Button */}
      <TouchableOpacity
        style={styles.biometricButton}
        onPress={handleBiometricLogin}
        disabled={!showBiometricOption}
      >
        <Ionicons name="scan" size={24} color={COLORS.green300} />
        <Text style={styles.biometricText}>
          {showBiometricOption
            ? "Click to Login with Face ID"
            : "Click to Login with Face ID"}
        </Text>
      </TouchableOpacity>

      {/* Switch Account and Login with Password */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleSwitchAccount}>
          <Text style={styles.actionText}>Switch Account</Text>
        </TouchableOpacity>
        <Text style={styles.separator}> | </Text>
        <TouchableOpacity onPress={handleLoginWithPassword}>
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.green300,
    marginBottom: SPACING * 4,
  },
  biometricText: {
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
    color: COLORS.green400,
    marginLeft: SPACING,
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
