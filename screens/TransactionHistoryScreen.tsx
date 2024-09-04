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
import React, { useEffect, useState } from "react";
import { ArrowLeft, DocumentText } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SPACING from "../config/SPACING";
import FONT_SIZE from "../config/font-size";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import useWallet from "../hooks/use-wallet";

const AllTransactionsScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { getAllTransactions } = useWallet();
  const { transactions, isLoading } = getAllTransactions();
  const [hasTransaction, setHasTransaction] = useState(false);

  useEffect(() => {
    setHasTransaction(transactions.length > 0);
  }, [transactions]);

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
          <Text style={[styles.headerText]} allowFontScaling={false}>
            All Transactions
          </Text>
          <TouchableOpacity>
            <DocumentText color={"#000"} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../assets/animation/loading.json")}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : hasTransaction ? (
            transactions.map(
              (transaction: {
                _id: React.Key | null | undefined;
                transactionType: string;
                amountPaid: number;
                createdAt: string;
                paymentStatus: string;
              }) => (
                <TouchableOpacity
                  key={transaction._id}
                  onPress={() =>
                    navigation.navigate("TransactionSummaryScreen", {
                      transaction,
                    })
                  }
                  style={styles.transactionItem}
                >
                  <Image
                    // source={require("../assets/images/airtel.png")}
                    style={styles.transactionImage}
                  />
                  <View style={styles.transactionTextContainer}>
                    <View style={styles.transactionTextRow}>
                      <Text style={styles.item} allowFontScaling={false}>
                        {transaction.transactionType}
                      </Text>
                      <Text style={styles.valueText} allowFontScaling={false}>
                        ₦{" "}
                        {transaction.amountPaid.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                    <View style={styles.transactionTextRow}>
                      <Text style={styles.date} allowFontScaling={false}>
                        {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                        {/* Format date */}
                      </Text>
                      <View style={styles.statusContainer}>
                        <Text
                          style={styles.completedText}
                          allowFontScaling={false}
                        >
                          {transaction.paymentStatus}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            )
          ) : (
            <View style={styles.noTransactionContainer}>
              <LottieView
                source={require("../assets/animation/noTransaction.json")}
                autoPlay
                loop
                style={styles.noTransactionAnimation}
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
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
  noTransactionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTransactionAnimation: {
    width: 200,
    height: 200,
  },
  notransactionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  transactionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  item: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(12),
  },
  valueText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
  },
  date: {
    fontFamily: "Outfit-Regular",
    color: "#9BA1A8",
    fontSize: RFValue(10),
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E6F9F1",
    borderRadius: 10,
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#06C270",
    fontSize: RFValue(10),
  },
});

export default AllTransactionsScreen;
