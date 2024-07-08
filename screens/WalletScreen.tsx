import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import FONT_SIZE from "../config/font-size";
import { DocumentText, WalletAdd1 } from "iconsax-react-native";
import COLORS from "../config/colors";
import WalletCard from "../components/WalletCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RecentWalletTransaction from "../components/ResentWalletTransactions";

const WalletScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-4">
          <View className="justify-between flex-row items-center mb-6 ">
            <Text style={styles.headText} allowFontScaling={false}>
              My Wallet
            </Text>
            <DocumentText color="#000" size={24} />
          </View>
          {/* Wallet Card */}
          <WalletCard navigation={navigation} />
        </View>
        {/* Recent Transaction */}
        <RecentWalletTransaction navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.large,
  },
  walletCard: {
    backgroundColor: COLORS.violet400,
    position: "absolute",
  },
});
