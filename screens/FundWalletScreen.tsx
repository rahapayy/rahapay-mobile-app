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
import React, { useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Copy } from "iconsax-react-native";
import SPACING from "../constants/SPACING";
import FONT_SIZE from "../constants/font-size";
import COLORS from "../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Circle from "../assets/svg/Group 803.svg";
import useWallet from "../hooks/use-wallet";
// import { AuthContext } from "../context/AuthContext";
import { handleShowFlash } from "../components/FlashMessageComponent";
import * as Clipboard from "expo-clipboard";
import { AuthContext } from "../services/AuthContext";

const FundWalletScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { account } = useWallet();

  const { userDetails } = useContext(AuthContext);

  const copyToClipboard = async (textToCopy: string) => {
    await Clipboard.setStringAsync(textToCopy);
    handleShowFlash({
      message: "Account copied!",
      type: "success",
    });
  };

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
            <View style={styles.cardWrapper}>
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
                    <Text style={styles.accountNumber} allowFontScaling={false}>
                      {account.accountNumber}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        copyToClipboard(account?.accountNumber.toString() || "")
                      }
                    >
                      <Copy color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.accountName} allowFontScaling={false}>
                  {userDetails?.fullName}
                </Text>
              </ImageBackground>
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
    paddingVertical: SPACING,
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
    fontSize: RFValue(13),
    marginBottom: SPACING,
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
});
