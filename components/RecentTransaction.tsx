import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";

const RecentTransaction = () => {
  const [hasTransaction, setHasTransaction] = useState(true);

  return (
    <View className="p-4">
      <View className="flex-row items-center justify-between">
        <Text style={styles.rtText}>Recent Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.viewmoreText}>View More</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {hasTransaction ? (
          // Render transactions
          <View>
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
    </View>
  );
};

export default RecentTransaction;

const styles = StyleSheet.create({
  rtText: {
    fontFamily: "Outfit-SemiBold",
    fontSize: RFValue(16),
  },
  viewmoreText: {
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
});
