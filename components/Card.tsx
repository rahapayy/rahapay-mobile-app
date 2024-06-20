import React, { useContext, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
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
import COLORS from "../config/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const Card: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const { userInfo } = useContext(AuthContext);

  const toggleBalanceVisibility = () => setShowBalance((prev) => !prev);

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.backgroundImage}
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
                  Hello, {userInfo?.data?.user?.fullName}
                </Text>
                <Text style={styles.greetingSubText} allowFontScaling={false}>
                  Let's make some bills payment!
                </Text>
              </View>
            </View>
            <View className="flex-row gap-4">
              <TouchableOpacity>
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
            <Text style={styles.balanceValue} allowFontScaling={false}>
              {showBalance ? "₦0.00" : "*******"}
            </Text>
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
    width: 50,
    height: 50,
    marginRight: 8,
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
});
