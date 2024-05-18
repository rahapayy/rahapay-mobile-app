import React, { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
} from "react-native";
import {
  AddCircle,
  Eye,
  EyeSlash,
  Notification,
  WalletAdd1,
} from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../config/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Card: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const aspectRatio = 12 / 9;
  const bgHeight = screenWidth / aspectRatio;
  const minHeight = screenHeight * 0.3; // Set a minimum height

  const [showBalance, setShowBalance] = useState(true);

  const toggleBalanceVisibility = () => setShowBalance((prev) => !prev);

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={[
        styles.backgroundImage,
        { height: Math.max(bgHeight, minHeight) },
      ]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                source={require("../assets/images/avatar.png")}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.greetingText} allowFontScaling={false}>
                  Hello, Akinola
                </Text>
                <Text style={styles.greetingSubText} allowFontScaling={false}>
                  Let's make some bills payment!
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("TransactionHistoryScreen")}
            >
              <Notification color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.balanceContainer}>
            <View style={styles.balanceContent}>
              <WalletAdd1 color="#fff" size={20} />
              <Text style={styles.availableBalanceText} allowFontScaling={false}>
                Available Balance
              </Text>
            </View>
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              {showBalance ? (
                <Eye color="#fff" size={20} style={styles.eyeIcon} />
              ) : (
                <EyeSlash color="#fff" size={20} style={styles.eyeIcon} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.balanceValueContainer}>
            <Text style={styles.balanceValue} allowFontScaling={false}>
              {showBalance ? "₦ 120,000.00" : "*******"}
            </Text>
          </View>

          <TouchableOpacity style={styles.fundWalletButton}>
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
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 15,
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  greetingText: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(18),
  },
  greetingSubText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(14),
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  balanceValueContainer: {
    marginBottom: 20,
  },
  balanceValue: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(28),
  },
  fundWalletButton: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 20, // Ensure there is some margin at the bottom
  },
  fundWalletText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet400,
    marginLeft: 4,
    fontSize: RFValue(16),
  },
});
