import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useWallet from "../hooks/use-wallet";

const RecentServiceTransaction: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { transactions, isLoading } = useWallet();
  const [hasTransaction, setHasTransaction] = useState(false);

  useEffect(() => {
    setHasTransaction(transactions.length > 0);
  }, [transactions]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.rtText} allowFontScaling={false}>
          Recent Transactions
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("TransactionHistoryScreen")}
        >
          <Text style={styles.viewmoreText} allowFontScaling={false}>
            View More
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
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
              id: React.Key | null | undefined;
              tranxType: string;
              amount: any;
              created_at: any;
              status: string;
            }) => (
              <TouchableOpacity
                key={transaction.id}
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
                      {transaction.tranxType}
                    </Text>
                    <Text style={styles.valueText} allowFontScaling={false}>
                      ₦{" "}
                      {transaction.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                  <View style={styles.transactionTextRow}>
                    <Text style={styles.date} allowFontScaling={false}>
                      {transaction.created_at}
                    </Text>
                    <View style={styles.statusContainer}>
                      <Text
                        style={styles.completedText}
                        allowFontScaling={false}
                      >
                        {transaction.status}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rtText: {
    fontFamily: "Outfit-SemiBold",
    fontSize: RFValue(14),
  },
  viewmoreText: {
    fontFamily: "Outfit-Regular",
    color: "#9BA1A8",
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
    // marginTop: 10,
  },
  noTransactionAnimation: {
    width: 200,
    height: 200,
  },
  notransactionText: {
    // marginTop: 10,
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

export default RecentServiceTransaction;
