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
import { ArrowLeft, DocumentText, Filter } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SPACING from "../config/SPACING";
import COLORS from "../config/colors";
import FONT_SIZE from "../config/font-size";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";

const TransactionHistoryScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [hasTransaction, setHasTransaction] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftIcon}
          >
            <ArrowLeft color={"#000"} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerText]}>Transaction History</Text>
          <TouchableOpacity>
            <DocumentText color={"#000"} />
          </TouchableOpacity>
        </View>

        {hasTransaction ? (
          // Render transactions
          <View className="px-4">
            <Text style={styles.date}>Today</Text>
            <TouchableOpacity style={styles.transactionItem}>
              <Image
                source={require("../assets/images/airtel.png")}
                style={styles.transactionImage}
              />
              <View style={styles.transactionTextContainer}>
                <View style={styles.transactionTextRow}>
                  <Text style={styles.item}>Airtel Data Bundle</Text>
                  <Text style={styles.valueText}>₦ 1,500</Text>
                </View>
                <View style={styles.transactionTextRow}>
                  <Text style={styles.date}>Mar 06, 2024, 02:12 PM</Text>
                  {/* Transaction status */}
                  <View className="p-2 bg-[#E6F9F1] rounded-2xl">
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.transactionItem}>
              <Image
                source={require("../assets/images/mtn.png")}
                style={styles.transactionImage}
              />
              <View style={styles.transactionTextContainer}>
                <View style={styles.transactionTextRow}>
                  <Text style={styles.item}>MTN Data Bundle</Text>
                  <Text style={styles.valueText}>₦ 1,500</Text>
                </View>
                <View style={styles.transactionTextRow}>
                  <Text style={styles.date}>Mar 06, 2024, 02:12 PM</Text>
                  {/* Transaction status */}
                  <View className="p-2 bg-[#FFEAEA] rounded-2xl">
                    <Text style={styles.failedText}>Failed</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionHistoryScreen;

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
    fontSize: FONT_SIZE.large,
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
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 10,
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
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#06C270",
  },
  failedText: {
    color: "#FF2E2E",
    fontFamily: "Outfit-Regular",
  },
  valueText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
  },
  item: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
  },
  date: {
    fontFamily: "Outfit-Regular",
    color: "#9BA1A8",
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
    flex: 1,
  },
});
