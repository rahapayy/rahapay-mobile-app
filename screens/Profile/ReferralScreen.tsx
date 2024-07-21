import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import React, { useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Copy, People, Send2 } from "iconsax-react-native";
import SPACING from "../../config/SPACING";
import FONT_SIZE from "../../config/font-size";
import COLORS from "../../config/colors";
import ReferImg from "../../assets/svg/refer.svg";
import { RFValue } from "react-native-responsive-fontsize";
import Money from "../../assets/svg/money-earn-svgrepo-com 1.svg";
import { AuthContext } from "../../context/AuthContext";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import * as Clipboard from "expo-clipboard";

const ReferralScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userDetails } = useContext(AuthContext);

  const copyToClipboard = async (textToCopy: string) => {
    await Clipboard.setStringAsync(textToCopy);
    handleShowFlash({
      message: "Code copied!",
      type: "success",
    });
  };

  const shareWithFriends = async () => {
    try {
      const referralCode = userDetails?.userName;
      const message = `Join RahaPay and earn rewards! Use my referral code: ${referralCode}`;
      const result = await Share.share({
        message,
        // Optionally, you can add a URL for iOS or a title for Android:
        // url: 'https://www.example.com',
        // title: 'Invite to RahaPay'
      });

      if (result.action === Share.sharedAction) {
        // Shared successfully
        console.log("Share was successful");
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Share was dismissed");
      }
    } catch (error) {
      console.error("Error while trying to share:", error);
    }
  };
  return (
    <View>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftIcon}
          >
            <ArrowLeft color={"#fff"} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <ReferImg style={styles.image} />
          <Text style={styles.headerText} allowFontScaling={false}>
            Refer & Earn Cash
          </Text>
          <Text style={styles.desText}>
            Earn 6% of your friends' first deposit
          </Text>
        </View>
      </SafeAreaView>
      <View style={styles.copyContainer}>
        <Text style={styles.topText} allowFontScaling={false}>
          Your unique referral code
        </Text>
        <View className="flex-row gap-2 mb-2">
          <View style={styles.tagContain}>
            <Text style={styles.tagText} allowFontScaling={false}>
              {userDetails?.userName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => copyToClipboard(userDetails?.userName)}
            style={styles.copyContain}
          >
            <Text style={styles.copyText} allowFontScaling={false}>
              Copy
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-80 mb-4">
          <TouchableOpacity
            onPress={shareWithFriends}
            style={styles.shareButton}
          >
            <Send2 variant="Bold" color="#fff" />
            <Text style={styles.shareText} allowFontScaling={false}>
              Share to invite your friends
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cashoutContain}>
        <View className="flex-row justify-between items-center px-4">
          <View className="flex-row items-center">
            <People color="#000" variant="Bold" />
            <Text style={styles.referralText}>My Referrals</Text>
          </View>
          <Text style={styles.valueText}>0</Text>
        </View>
        <View className="flex-row justify-between items-center px-4 mt-2">
          <View className="flex-row items-center">
            <Money />
            <Text style={styles.referralText}>Total Referral Earnings</Text>
          </View>
          <Text style={styles.valueText}>₦0.00</Text>
        </View>
      </View>
    </View>
  );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.violet400,
  },
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
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
  },
  image: {
    marginBottom: SPACING * 2,
  },
  headerText: {
    color: "#fff",
    fontSize: RFValue(28),
    fontFamily: "Outfit-Medium",
    textAlign: "center",
  },
  desText: {
    color: "#fff",
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.small,
    textAlign: "center",
    marginTop: SPACING,
    marginBottom: SPACING,
  },
  copyContainer: {
    paddingHorizontal: SPACING,
    marginTop: SPACING,
    margin: SPACING,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    backgroundColor: COLORS.violet400,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING * 1.7,
    borderRadius: 10,
    flexDirection: "row",
  },
  shareText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.white,
    marginLeft: 4,
    fontSize: RFValue(14),
  },
  tagContain: {
    backgroundColor: COLORS.violet200,
    padding: SPACING * 1.7,
    borderRadius: 5,
  },
  copyContain: {
    backgroundColor: COLORS.violet800,
    padding: SPACING * 1.7,
    borderRadius: 5,
  },
  topText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.small,
    paddingVertical: SPACING,
  },
  tagText: {
    fontFamily: "Outfit-Regular",
  },
  copyText: {
    color: COLORS.white,
    fontFamily: "Outfit-Regular",
  },
  cashoutContain: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,
    margin: SPACING,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  referralText: {
    fontFamily: "Outfit-Regular",
    marginLeft: SPACING,
    fontSize: FONT_SIZE.small,
  },
  valueText: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.medium,
  },
});
