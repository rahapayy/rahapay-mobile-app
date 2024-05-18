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

const TransactionSummaryScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
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
              Transaction Summary
            </Text>
          </View>

          <View className="justify-center items-center mt-10">
            <Airtel />
            <Text style={styles.itemText} allowFontScaling={false}>
              AIRTEL Data Bundle
            </Text>
          </View>
          <View className="p-4">
            <View style={styles.container}>
              <Text style={styles.headText} allowFontScaling={false}>
                Transaction summary
              </Text>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Transaction ID
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  #1234567890
                </Text>
              </View>
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
                  Mar 06, 2024, 02:12 PM
                </Text>
                {/* Transaction status */}
                <View className="p-2 bg-[#E6F9F1] rounded-2xl">
                  <Text style={styles.completedText} allowFontScaling={false}>
                    Completed
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.button}>
              <DocumentDownload color="#000" />
              <Text style={styles.buttonText} allowFontScaling={false}>
                Download Receipt
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionSummaryScreen;

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
});
