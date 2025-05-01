import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AddCircle, Eye, EyeSlash, WalletAdd1 } from "iconsax-react-native";
import SPACING from "../constants/SPACING";
import COLOR from "../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../constants/colors";
import useWallet from "../hooks/use-wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WalletCard: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = Platform.OS === "ios" && screenWidth >= 768;
  const { balance, refreshBalance } = useWallet();
  const [showBalance, setShowBalance] = useState(true);

  // Load balance visibility from AsyncStorage
  useEffect(() => {
    const getBalanceVisibility = async () => {
      const balanceVisibility = await AsyncStorage.getItem("showBalance");
      if (balanceVisibility !== null) {
        setShowBalance(balanceVisibility === "true");
      }
    };
    getBalanceVisibility();
  }, []);

  // Revalidate balance when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refreshBalance(); // Trigger balance refresh
    });
    return unsubscribe;
  }, [navigation, refreshBalance]);

  const toggleBalanceVisibility = async () => {
    setShowBalance((prev) => {
      const newVisibility = !prev;
      AsyncStorage.setItem("showBalance", String(newVisibility));
      return newVisibility;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/layer.png")}
        resizeMode="cover"
        style={[
          styles.walletContain,
          isTablet && {
            paddingHorizontal: SPACING * 3,
            paddingVertical: SPACING * 3,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: SPACING,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <WalletAdd1 color="#fff" size={isTablet ? 24 : 20} className="mr-2" />
          <Text
            style={[styles.walletText, isTablet && { fontSize: RFValue(18) }]}
          >
            Available Balance
          </Text>
          {showBalance ? (
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <Eye
                color="#fff"
                size={isTablet ? 24 : 20}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <EyeSlash
                color="#fff"
                size={isTablet ? 24 : 20}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          )}
        </View>
        {showBalance ? (
          <Text style={[styles.balance, isTablet && { fontSize: RFValue(36) }]}>
            ₦{" "}
            {balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </Text>
        ) : (
          <Text style={[styles.balance, isTablet && { fontSize: RFValue(36) }]}>
            ********
          </Text>
        )}
        <View className="w-full">
          <TouchableOpacity
            onPress={() => navigation.navigate("FundWalletScreen")}
            style={[
              styles.fundWalletButton,
              isTablet && { paddingVertical: 16 },
            ]}
          >
            <AddCircle
              variant="Bold"
              color="#573CC7"
              size={isTablet ? 24 : 20}
            />
            <Text
              style={[
                styles.fundWalletText,
                isTablet && { fontSize: RFValue(16) },
              ]}
            >
              Fund Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WalletCard;

const styles = StyleSheet.create({
  walletContain: {
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 2,
    backgroundColor: COLOR.violet300,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  walletText: {
    fontSize: RFValue(16),
    fontWeight: "400",
    color: COLOR.white,
    fontFamily: "Outfit-Regular",
  },
  balance: {
    fontSize: RFValue(30),
    fontWeight: "700",
    color: COLOR.white,
    fontFamily: "Outfit-SemiBold",
    marginBottom: SPACING * 2,
  },
  containRow: {
    flexDirection: "row",
    justifyContent: "center",
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
