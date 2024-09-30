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
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, DocumentDownload } from "iconsax-react-native";
import SPACING from "../constants/SPACING";
import FONT_SIZE from "../constants/font-size";
import COLORS from "../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";

const NotificationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [hasTransaction, setHasTransaction] = useState(true);

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
              Notifications
            </Text>
          </View>

          {hasTransaction ? (
            // Render transactions
            <View className="p-4">
              <TouchableOpacity
                onPress={() => navigation.navigate("TransactionSummaryScreen")}
                style={styles.transactionItem}
              >
                <Image
                  source={require("../assets/images/small-logo.png")}
                  style={styles.transactionImage}
                />
                <View style={styles.transactionTextContainer}>
                  <View style={styles.transactionTextRow}>
                    <Text style={styles.item} allowFontScaling={false}>
                      Transaction Completed
                    </Text>
                    <Text style={styles.valueText} allowFontScaling={false}>
                      Apr 01, 2024, 02:12 PM
                    </Text>
                  </View>
                  <View style={styles.transactionTextRow}>
                    <Text style={styles.date} allowFontScaling={false}>
                      Transaction with ID #1234567890 was completed successful
                    </Text>
                    {/* Transaction status */}
                    <View>
                      <Text
                        style={styles.completedText}
                        allowFontScaling={false}
                      >
                        View
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            // Render no transaction message
            <View style={styles.noTransactionContainer}>
              <LottieView
                source={require("../assets/animation/noTransaction.json")}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
              <Text style={styles.notransactionText}>
                You don’t have any transactions
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

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
    color: COLORS.violet500,
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
  loadingAnimation: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  notransactionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    textAlign: "center",
  },
  noTransactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    padding: SPACING,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  transactionImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  transactionTextContainer: {
    flex: 1,
  },
  transactionTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  failedText: {
    color: "#FF2E2E",
    fontFamily: "Outfit-Regular",
  },
  valueText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(8),
  },
  item: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(12),
  },
  date: {
    fontFamily: "Outfit-Regular",
    color: "#9BA1A8",
    fontSize: RFValue(10),
    width: 200,
    marginTop: 5,
  },
});
