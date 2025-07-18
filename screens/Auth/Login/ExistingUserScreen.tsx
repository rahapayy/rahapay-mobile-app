import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { COLORS, SPACING } from "@/constants/ui";
import Backspace from "@/assets/svg/backspace.svg";
import { Loading } from "@/components/common/ui/loading";
import { getItem, removeItem, StorageKeys } from "@/utils/storage";
import { useAuth } from "@/services/AuthContext";
import { MediumText } from "@/components/common/Text";

const DEFAULT_SECURITY_PIN = "1234";

const ExistingUserScreen: React.FC<any> = ({ navigation }) => {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsAuthenticated, userInfo } = useAuth();

  // Helper to get the best display name
  const getDisplayName = () => {
    if (userInfo?.userName) return userInfo.userName;
    // Only check firstName/lastName if they exist on userInfo
    if ('firstName' in (userInfo || {}) && 'lastName' in (userInfo || {})) {
      // @ts-ignore
      if (userInfo.firstName && userInfo.lastName) return `${userInfo.firstName} ${userInfo.lastName}`;
    }
    if (userInfo?.fullName) return userInfo.fullName;
    return "";
  };

  useEffect(() => {
    // If SECURITY_LOCK is not set, immediately unlock
    (async () => {
      const lock = await getItem("SECURITY_LOCK");
      if (lock !== "true") {
        setIsAuthenticated(true);
        // navigation.replace("AppStack"); // No need, handled by setIsAuthenticated
      }
    })();
  }, [navigation, setIsAuthenticated]);

  const onUnlock = async (enteredPin: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Entered PIN:", enteredPin); // Debug log
      if (enteredPin === DEFAULT_SECURITY_PIN) {
        await removeItem("SECURITY_LOCK");
        setIsAuthenticated(true);
        setPin(""); // Clear pin after unlock
        if (navigation && navigation.reset) {
          navigation.reset({
            index: 0,
            routes: [{ name: "AppStack" }],
          });
        }
      } else {
        setError("Incorrect security pin");
        setPin("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleNumberPress = async (number: string) => {
    if (pin.length < 4 && !isLoading) {
      const newPin = pin + number;
      setPin(newPin);
      if (newPin.length === 4) {
        await onUnlock(newPin);
      }
    }
  };

  const renderPinDots = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <View
          key={index}
          style={[styles.pinDot, index < pin.length && styles.filledPinDot]}
        />
      ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          {/* Welcome message */}
          <MediumText color="primary" marginBottom={24}>
            {`Welcome back${getDisplayName() ? ", " + getDisplayName() + "!" : "!"}`}
          </MediumText>
          <View style={styles.asterisksContainer}>
            <Text style={styles.asterisks}>* * * *</Text>
          </View>
          <Text style={styles.title}>Enter Security Pin</Text>
          <Text style={styles.subtitle}>
            Please enter your 4-digit security pin
          </Text>
          <View style={styles.pinDotsContainer}>{renderPinDots()}</View>
          {error && <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>}
          <View style={styles.keypad}>
            {/* First 3 rows: 1-9 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadButton}
                onPress={() => handleNumberPress(num.toString())}
                disabled={isLoading}
              >
                <View style={styles.keypadButtonCircle}>
                  <Text style={styles.keypadButtonText}>{num}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {/* Last row: empty, 0, backspace */}
            <View style={{ width: "33.33%" }} />
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress("0")}
              disabled={isLoading}
            >
              <View style={styles.keypadButtonCircle}>
                <Text style={styles.keypadButtonText}>0</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={handleDelete}
              disabled={isLoading}
            >
              <View style={styles.keypadButtonCircle}>
                <Backspace />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isLoading && <Loading size="large" color={COLORS.brand.primary} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: SPACING * 6,
  },
  asterisksContainer: {
    backgroundColor: "#F0F0FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  asterisks: {
    color: "#5D5FEF",
    fontSize: 16,
    letterSpacing: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "Outfit-Medium",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    fontFamily: "Outfit-Regular",
  },
  pinDotsContainer: {
    flexDirection: "row",
    marginBottom: SPACING * 4,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  filledPinDot: {
    backgroundColor: COLORS.brand.primary,
  },
  keypad: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  keypadButton: {
    width: "33.33%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keypadButtonText: {
    fontSize: 24,
    color: "#000",
    fontFamily: "Outfit-Regular",
  },
  keypadButtonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
});

export default ExistingUserScreen;
