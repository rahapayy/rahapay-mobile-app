import React, { useContext, useState, useEffect } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
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
import COLORS from "../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import useWallet from "../hooks/use-wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import SPACING from "../constants/SPACING";
import { BoldText, MediumText } from "./common/Text";

const { height: screenHeight } = Dimensions.get("window");

const Card: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

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

  const { userDetails } = useContext(AuthContext);

  const fullName = userDetails?.fullName || "";
  const firstName = fullName.split(" ")[0];
  const initials = fullName
    .split(" ")
    .map((n: any[]) => n[0])
    .join("")
    .toUpperCase();

  const { balance } = useWallet();

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
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
                <Text style={styles.greetingText} allowFontScaling={false}>
                  Hello, {firstName} 👋
                </Text>
                <Text style={styles.greetingSubText} allowFontScaling={false}>
                  Let's make some bills payment!
                </Text>
              </View>
            </View>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => navigation.navigate("CustomerCareScreen")}
              >
                <Headphone color="#fff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("NotificationScreen")}
              >
                <Notification color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <View style={styles.balanceContent}>
              <WalletAdd1 color="#fff" size={24} />
              <Text
                style={styles.availableBalanceText}
                allowFontScaling={false}
              >
                Available Balance
              </Text>
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
            {isConnected ? (
              showBalance ? (
                <Text style={styles.balanceValue} allowFontScaling={false}>
                  ₦{" "}
                  {balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              ) : (
                <Text style={styles.balanceValue}>🙈🙈🙈🙈🙈</Text>
              )
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText} allowFontScaling={false}>
                  Service Unavailable
                </Text>
                <Text style={styles.errorSubText} allowFontScaling={false}>
                  Please check your internet connection and try again.
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("FundWalletScreen")}
            style={styles.fundWalletButton}
          >
            <AddCircle variant="Bold" color="#573CC7" />
            <Text style={styles.fundWalletText} allowFontScaling={false}>
              Fund Wallet
            </Text>
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
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(16),
  },
  greetingText: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(16),
  },
  greetingSubText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(12),
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  availableBalanceText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    marginLeft: 4,
    fontSize: RFValue(14),
  },
  eyeIcon: {
    marginLeft: 10,
  },
  balanceValueContainer: {},
  balanceValue: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(30),
  },
  fundWalletButton: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
  },
  fundWalletText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet400,
    marginLeft: 4,
    fontSize: RFValue(14),
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
    fontSize: RFValue(10),
    marginTop: 5,
  },
});
