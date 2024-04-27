import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState } from "react";
import { Image } from "react-native";
import {
  AddCircle,
  Eye,
  EyeSlash,
  Notification,
  WalletAdd1,
} from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../config/colors";

const Card = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Calculate a fixed aspect ratio for the background image (e.g., 16:9)
  const aspectRatio = 12 / 9;
  const bgHeight = screenWidth / aspectRatio;

  const [showBalance, setShowBalance] = useState(true);

  const toggleBalanceVisibility = React.useCallback(
    () => setShowBalance((prev) => !prev),
    []
  );

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={[styles.backgroundImage, { height: bgHeight }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View className="p-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={require("../assets/images/avatar.png")}
                alt=""
                style={{ width: 50, height: 50 }}
              />
              <View style={styles.greetingTextContainer}>
                <Text style={styles.greetingText}>Hello, Akinola</Text>
                <Text style={styles.greetingSubText}>
                  Let's make some bills payment!
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Notification color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between mt-6">
            <View className="flex-row items-center">
              <WalletAdd1 color="#fff" size={20} />
              <Text style={styles.availableBalanceText}>Available Balance</Text>
            </View>
            {showBalance ? (
              <TouchableOpacity onPress={toggleBalanceVisibility}>
                <Eye color="#fff" size={20} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={toggleBalanceVisibility}>
                <EyeSlash color="#fff" size={20} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-4">
            {showBalance ? (
              <Text style={styles.balanceValue}>₦ 120,000.00</Text>
            ) : (
              <Text style={styles.balanceValue}>*******</Text>
            )}
          </View>

          <TouchableOpacity style={styles.fundWalletButton}>
            <AddCircle variant="Bold" color="#573CC7" />
            <Text style={styles.fundWalletText}>Fund Wallet</Text>
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
  },
  fundWalletButton: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
  },
  fundWalletText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet400,
    marginLeft: 4,
    fontSize: RFValue(16),
  },
  greetingTextContainer: {
    marginLeft: 8,
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
  availableBalanceText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    marginLeft: 4,
    fontSize: RFValue(14),
  },
  balanceValue: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(28),
  },
});
