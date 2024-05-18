import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Copy } from "iconsax-react-native";
import SPACING from "../config/SPACING";
import FONT_SIZE from "../config/font-size";
import COLORS from "../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Circle from "../assets/svg/Group 803.svg";

const FundWalletScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const accounts = [
    {
      id: 1,
      bankName: "Moniepoint Microfinance Bank",
      accountNumber: "01234567890",
      accountName: "Akinola John",
    },
    {
      id: 2,
      bankName: "First Bank of Nigeria",
      accountNumber: "09876543210",
      accountName: "Akinola John",
    },
    {
      id: 3,
      bankName: "GTBank",
      accountNumber: "11223344556",
      accountName: "Akinola John",
    },
    {
      id: 4,
      bankName: "Access Bank",
      accountNumber: "22334455667",
      accountName: "Akinola John",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Virtual Funding Accounts
            </Text>
          </View>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            {accounts.map((account) => (
              <View key={account.id} style={styles.cardWrapper}>
                <ImageBackground
                  source={require("../assets/images/layer.png")}
                  resizeMode="cover"
                  style={styles.walletContain}
                >
                  {/* Card Details */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.virtualText} allowFontScaling={false}>
                      Virtual Account
                    </Text>
                    <Circle />
                  </View>

                  <Text style={styles.bankName} allowFontScaling={false}>
                    {account.bankName}
                  </Text>
                  <View style={styles.copyContainer}>
                    <Text style={styles.copyText} allowFontScaling={false}>
                      Copy your account number
                    </Text>
                    <View style={styles.accountNumberContainer}>
                      <Text
                        style={styles.accountNumber}
                        allowFontScaling={false}
                      >
                        {account.accountNumber}
                      </Text>
                      <Copy color="#fff" />
                    </View>
                  </View>
                  <Text style={styles.accountName} allowFontScaling={false}>
                    {account.accountName}
                  </Text>
                </ImageBackground>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FundWalletScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  headerTextDark: {
    color: COLORS.white,
  },
  headTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Medium",
    paddingVertical: SPACING * 2,
  },
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,
    borderRadius: SPACING,
    marginTop: SPACING * 4,
  },
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(18),
    marginBottom: SPACING,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(16),
    paddingVertical: SPACING,
  },
  descriptionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    color: "#9BA1A8",
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#06C270",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#000",
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 3,
    borderRadius: 8,
    marginTop: SPACING * 2,
  },
  buttonText: {
    marginLeft: SPACING,
    color: "#000",
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
  },
  cardsContainer: {
    paddingHorizontal: SPACING * 2,
  },
  cardWrapper: {
    marginBottom: SPACING * 2,
  },
  walletContain: {
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.5,
    backgroundColor: COLORS.violet300,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  virtualText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: FONT_SIZE.medium,
    marginBottom: SPACING,
  },
  bankName: {
    fontFamily: "Outfit-Medium",
    color: "#fff",
    fontSize: FONT_SIZE.medium,
    marginBottom: SPACING,
  },
  copyContainer: {
    backgroundColor: COLORS.violet700,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: SPACING,
    width: 220,
    marginBottom: 5,
  },
  copyText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: FONT_SIZE.small,
    marginBottom: 5,
  },
  accountNumberContainer: {
    flexDirection: "row",
  },
  accountNumber: {
    fontFamily: "Outfit-Medium",
    color: "#fff",
    fontSize: FONT_SIZE.large,
    marginBottom: 5,
    marginRight: 5,
  },
  accountName: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.medium,
    color: "#fff",
  },
});
