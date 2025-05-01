import React, { useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  AddCircle,
  Eye,
  EyeSlash,
  Headphone,
  Notification,
  WalletAdd1,
} from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useWallet from "../../hooks/use-wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import SPACING from "../../constants/SPACING";
import { BoldText, RegularText, SemiBoldText } from "../common/Text";
import { useAuth } from "../../services/AuthContext";
import { PanResponder } from "react-native";
import { Skeleton } from "@rneui/themed";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const Card: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { userInfo } = useAuth();
  const { refreshAll, balance, isLoading, error } = useWallet();

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true); // Show the spinner
    await refreshAll(); // Refresh wallet data
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
    setIsRefreshing(false); // Hide the spinner
  }, [refreshAll]);

  useEffect(() => {
    const getBalanceVisibility = async () => {
      const balanceVisibility = await AsyncStorage.getItem("showBalance");
      if (balanceVisibility !== null) {
        setShowBalance(balanceVisibility === "true");
      }
    };
    getBalanceVisibility();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const toggleBalanceVisibility = async () => {
    setShowBalance((prev) => {
      const newVisibility = !prev;
      AsyncStorage.setItem("showBalance", String(newVisibility));
      return newVisibility;
    });
  };

  const fullName = userInfo?.fullName || "";
  const firstName = fullName.split(" ")[0];
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const startY = evt.nativeEvent.locationY;
        return startY < 30 && gestureState.dy > 0;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) handleRefresh();
      },
    })
  ).current;

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 5,
    },
  });

  return (
    <ImageBackground
      source={require("../../assets/images/bg.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container} {...panResponder.panHandlers}>
          {isRefreshing && (
            <View
              style={[styles.spinnerContainer, shadowStyle]}
              className="rounded-full"
            >
              <ActivityIndicator size="small" color={COLORS.violet400} />
            </View>
          )}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => navigation.navigate("PersonalInformationScreen")}
                style={styles.avatar}
              >
                <BoldText color="white" size="medium">
                  {initials}
                </BoldText>
              </TouchableOpacity>
              <View>
                <SemiBoldText color="white" size="medium">
                  Hello, {firstName} 👋
                </SemiBoldText>
                <RegularText color="white" size="small">
                  Let's make some bills payment!
                </RegularText>
              </View>
            </View>
            <View className="flex-row gap-4">
              {/* <TouchableOpacity
                onPress={() => navigation.navigate("CustomerCareScreen")}
              >
                <Headphone color="#fff" size={24} />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => navigation.navigate("NotificationScreen")}
              >
                <Notification color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <View style={styles.balanceContent}>
              <WalletAdd1 color="#fff" size={24} className="mr-2" />
              <RegularText color="white" size="medium">
                Available Balance
              </RegularText>
            </View>
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              {showBalance ? (
                <Eye color="#fff" size={24} style={styles.eyeIcon} />
              ) : (
                <EyeSlash color="#fff" size={24} style={styles.eyeIcon} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.balanceValueContainer}>
            {isLoading ? (
              <Skeleton
                animation="wave"
                width={100}
                height={RFValue(26)}
                style={{ backgroundColor: COLORS.violet100, borderRadius: 8 }}
                skeletonStyle={{ backgroundColor: COLORS.violet50 }}
              />
            ) : isConnected === false ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Service Unavailable</Text>
                <Text style={styles.errorSubText}>
                  Please check your internet connection and try again.
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={handleRefresh}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : showBalance ? (
              <BoldText color="white" size="xxlarge">
                ₦{" "}
                {balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </BoldText>
            ) : (
              <BoldText color="white" size="xxlarge">
                ******
              </BoldText>
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("FundWalletScreen")}
            style={styles.fundWalletButton}
          >
            <AddCircle variant="Bold" color="#573CC7" />
            <RegularText color="primary" size="medium" marginLeft={5}>
              Fund Wallet
            </RegularText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Card;

const styles = StyleSheet.create({
  backgroundImage: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: "hidden",
    backgroundColor: COLORS.violet400,
    height: screenHeight * 0.35,
    paddingBottom: 20,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: screenWidth * 0.13, // 12% of the screen width
    height: screenWidth * 0.13, // Same as width to maintain a circle
    borderRadius: screenWidth * 0.07, // Half of the width/height to make it a perfect circle
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  balanceValueContainer: {},
  fundWalletButton: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
  },
  errorContainer: {
    marginTop: SPACING,
    marginBottom: SPACING,
  },
  errorText: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(14),
  },
  errorSubText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(12),
  },
  retryText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
    color: COLORS.violet400,
    marginTop: 10,
  },
  spinnerContainer: {
    backgroundColor: "white",
    padding: SPACING,
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});
