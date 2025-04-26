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
import SPACING from "../constants/SPACING";
import FONT_SIZE from "../constants/font-size";
import COLORS from "../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Circle from "../assets/svg/Group 803.svg";
import useWallet from "../hooks/use-wallet";
import { handleShowFlash } from "../components/FlashMessageComponent";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "../services/AuthContext";
import { Skeleton } from "@rneui/themed";

const FundWalletScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { account, isLoading } = useWallet();
  const { userInfo } = useAuth();

  const copyToClipboard = async (textToCopy: string) => {
    await Clipboard.setStringAsync(textToCopy);
    handleShowFlash({
      message: "Account copied!",
      type: "success",
    });
  };

  // Transform bank name to remove "(Amucha)"
  const formatBankName = (bankName?: string) => {
    if (!bankName) return "";
    return bankName.replace(/\(Amucha\)/, "").trim();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          {/* Header */}
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
            <View style={styles.cardWrapper}>
              {isLoading ? (
                // Skeleton Loading UI with Background Image
                <ImageBackground
                  source={require("../assets/images/layer.png")}
                  resizeMode="cover"
                  style={styles.walletContain}
                >
                  <View style={styles.cardHeader}>
                    <Skeleton
                      style={styles.skeletonVirtualText}
                      animation="wave"
                    />
                    <Skeleton
                      circle
                      style={styles.skeletonCircle}
                      animation="wave"
                      skeletonStyle={{ backgroundColor: COLORS.violet300 }}
                    />
                  </View>
                  <Skeleton style={styles.skeletonBankName} animation="wave" />
                  <View style={styles.copyContainer}>
                    <Skeleton
                      style={styles.skeletonCopyText}
                      animation="wave"
                      skeletonStyle={{ backgroundColor: COLORS.violet200 }}
                    />
                    <View style={styles.accountNumberContainer}>
                      <Skeleton
                        style={styles.skeletonAccountNumber}
                        animation="wave"
                      />
                      <Skeleton
                        circle
                        style={styles.skeletonCopyIcon}
                        animation="wave"
                      />
                    </View>
                  </View>
                  <Skeleton
                    style={styles.skeletonAccountName}
                    animation="wave"
                  />
                </ImageBackground>
              ) : !account || !account.accountNumber ? (
                // No Account Notification
                <View style={styles.walletContain}>
                  <Text style={styles.noAccountText} allowFontScaling={false}>
                    Please exercise patience, your account is on the way.
                  </Text>
                </View>
              ) : (
                // Actual Account Information
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
                    {formatBankName(account.bankName)}
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
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(
                            account?.accountNumber.toString() || ""
                          )
                        }
                      >
                        <Copy color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.accountName} allowFontScaling={false}>
                    {account.accountName?.toUpperCase()}
                  </Text>
                </ImageBackground>
              )}
            </View>
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
  cardsContainer: {
    paddingHorizontal: SPACING * 2,
  },
  cardWrapper: {
    marginBottom: SPACING * 2,
  },
  walletContain: {
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING,
    backgroundColor: "#5136C1", // COLORS.violet300
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING,
  },
  virtualText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(13),
  },
  bankName: {
    fontFamily: "Outfit-Medium",
    color: "#fff",
    fontSize: RFValue(12),
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
    fontSize: RFValue(12),
    marginBottom: 5,
  },
  accountNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountNumber: {
    fontFamily: "Outfit-Medium",
    color: "#fff",
    fontSize: RFValue(18),
    marginBottom: 5,
    marginRight: 5,
  },
  accountName: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.small,
    color: "#fff",
  },
  noAccountText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    color: "#fff",
    textAlign: "center",
    paddingVertical: SPACING * 2,
  },
  skeletonVirtualText: {
    width: RFValue(100), // Matches "Virtual Account" text
    height: RFValue(13), // Matches fontSize
    borderRadius: 4,
    backgroundColor: "#6B4ED1", // Lighter shade of #5136C1
    opacity: 0.7,
  },
  skeletonCircle: {
    width: RFValue(25), // Matches Circle SVG
    height: RFValue(25),
    borderRadius: RFValue(20),
    backgroundColor: "#6B4ED1",
    opacity: 0.7,
  },
  skeletonBankName: {
    width: RFValue(120), // Matches typical bank name length
    height: RFValue(12), // Matches fontSize
    borderRadius: 4,
    backgroundColor: "#6B4ED1",
    opacity: 0.7,
    marginBottom: SPACING,
  },
  skeletonCopyText: {
    width: RFValue(160), // Matches "Copy your account number" text
    height: RFValue(12), // Matches fontSize
    borderRadius: 4,
    backgroundColor: "#8B6EF1", // Matches violet700 context
    opacity: 0.7,
    marginBottom: 5,
  },
  skeletonAccountNumber: {
    width: RFValue(140), // Matches typical account number length
    height: RFValue(18), // Matches fontSize
    borderRadius: 4,
    backgroundColor: "#8B6EF1",
    opacity: 0.7,
    marginRight: 5,
    marginBottom: 5,
  },
  skeletonCopyIcon: {
    width: RFValue(24), // Matches Copy icon
    height: RFValue(24),
    borderRadius: RFValue(12),
    backgroundColor: "#8B6EF1",
    opacity: 0.7,
  },
  skeletonAccountName: {
    width: RFValue(100), // Matches typical account name length
    height: RFValue(12), // Matches FONT_SIZE.small
    borderRadius: 4,
    backgroundColor: "#6B4ED1",
    opacity: 0.7,
  },
});