import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AddCircle, Eye, EyeSlash, WalletAdd1 } from "iconsax-react-native";
import SPACING from "../config/SPACING";
import COLOR from "../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../config/colors";

const WalletCard: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const toggleBalanceVisibility = React.useCallback(
    () => setShowBalance((prev) => !prev),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/layer.png")}
        resizeMode="cover"
        style={styles.walletContain}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: SPACING,
          }}
        >
          <WalletAdd1 color="#fff" size={20} className="mr-2" />
          <Text style={styles.walletText}>Available Balance</Text>
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
        {showBalance ? (
          <Text style={styles.balance}>
            <Text style={{ fontSize: RFValue(16) }}></Text> ₦ 0.00
          </Text>
        ) : (
          <Text style={styles.balance}>********</Text>
        )}
        <View className="w-full">
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
    fontSize: RFValue(25),
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
    fontSize: RFValue(14), // Adjusted font size
  },
});
