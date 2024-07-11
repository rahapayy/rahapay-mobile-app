import {
  Image,
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
import { ArrowLeft, DocumentDownload } from "iconsax-react-native";
import SPACING from "../config/SPACING";
import FONT_SIZE from "../config/font-size";
import COLORS from "../config/colors";
import Airtel from "../assets/svg/airtel.svg";
import { RFValue } from "react-native-responsive-fontsize";
import SwipeButton from "../components/SwipeButton";

const ReviewSummaryScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const handleSwipeConfirm = () => {
    navigation.navigate("TransactionStatusScreen");

    console.log("Swipe confirmed!");
    // Perform your action here, e.g., sending a request to the server
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
              Review Summary
            </Text>
          </View>

          <View className="justify-center items-center mt-10">
            <Airtel width={120} height={120} />
            <Text style={styles.itemText} allowFontScaling={false}>
              AIRTEL Airtime VTU Topup
            </Text>
          </View>
          <View className="p-4">
            <View style={styles.container}>
              <Text style={styles.headText} allowFontScaling={false}>
                Transaction summary
              </Text>
              {/* <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Transaction ID
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  #1234567890
                </Text>
              </View> */}
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Amount
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  NGN 1,000.00
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Package
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  AIRTEL - 1GB - Monthly
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Recipient
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  +23480123456789
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Date
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  Mar 06, 2024, 02:12 PM
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Paying
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  NGN 1,000.00
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Date
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  Mar 06, 2024, 02:12 PM
                </Text>
              </View>

              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Status
                </Text>
                {/* Transaction status */}
                <View className="p-2 bg-[#FFEFC3] rounded-2xl">
                  <Text style={styles.completedText} allowFontScaling={false}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-12">
              <SwipeButton onConfirm={handleSwipeConfirm} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewSummaryScreen;

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
    fontSize: FONT_SIZE.small,
    fontFamily: "Outfit-Medium",
    paddingVertical: SPACING * 2,
  },
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,
    borderRadius: SPACING,
    marginTop: SPACING,
  },
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginBottom: SPACING,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    paddingVertical: SPACING,
  },
  descriptionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: "#9BA1A8",
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#FFCC3D",
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
});
