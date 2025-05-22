import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Copy, People, Send2 } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import ReferImg from "../../assets/svg/refer.svg";
import { RFValue } from "react-native-responsive-fontsize";
import Money from "../../assets/svg/money-earn-svgrepo-com 1.svg";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "../../services/AuthContext";
import Button from "../../components/common/ui/buttons/Button";
import { MediumText, RegularText } from "../../components/common/Text";

const ReferralScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userInfo } = useAuth();

  const copyToClipboard = async (textToCopy: string) => {
    await Clipboard.setStringAsync(textToCopy);
    handleShowFlash({
      message: "Code copied!",
      type: "success",
    });
  };

  const shareWithFriends = async () => {
    try {
      const referralCode = userInfo?.userName;
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
          <MediumText size="xxlarge" color="white">
            Refer & Earn Cash
          </MediumText>
          <RegularText color="white" size="base" marginBottom={10}>
            Earn 6% of your friends' first deposit
          </RegularText>
        </View>
      </SafeAreaView>
      <View style={styles.copyContainer}>
        {userInfo?.userName ? (
          <>
            <RegularText
              color="black"
              size="base"
              marginBottom={6}
              marginTop={6}
            >
              Your unique referral code
            </RegularText>
            <View className="flex-row gap-2 mb-2">
              <View style={styles.tagContain}>
                <Text style={styles.tagText}>{userInfo.userName}</Text>
              </View>
              <Button
                onPress={() => copyToClipboard(userInfo.userName)}
                title="Copy"
                textColor="white"
                style={styles.copyContain}
              />
            </View>
            <Button
              onPress={shareWithFriends}
              title="Share to invite your friends"
              icon={<Send2 variant="Bold" color="#fff" />}
              textColor="white"
              style={styles.shareButton}
              className="mb-4"
            />
          </>
        ) : (
          <>
            <View className="py-4 justify-center items-center">
              <RegularText center color="black">
                Your referral code is your username. Click on the button below
                to create yours now to start inviting friends and earning
                rewards.
              </RegularText>
              <Button
                onPress={async () => {
                  await navigation.navigate("CreateTagScreen");
                }}
                textColor="white"
                title="Create Tag"
                className="mt-6"
                style={styles.shareButton}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.cashoutContain}>
        <View className="flex-row justify-between items-center px-4">
          <View className="flex-row items-center">
            <People color="#000" variant="Bold" />
            <RegularText color="black" marginLeft={8}>
              My Referrals
            </RegularText>
          </View>
          <MediumText color="black" size="large">
            0
          </MediumText>
        </View>
        <View className="flex-row justify-between items-center px-4 mt-2">
          <View className="flex-row items-center">
            <Money />
            <RegularText color="black" marginLeft={8}>
              Total Referral Earnings
            </RegularText>
          </View>
          <MediumText color="black" size="large">
            ₦0.00
          </MediumText>
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
    // width: 350,
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
    width: 80,
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
