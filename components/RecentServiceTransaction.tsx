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
import { Skeleton } from "@rneui/themed";
import { WalletAdd1, WalletMinus } from "iconsax-react-native";
import COLORS from "../constants/colors";
import Airtel from "../assets/svg/airtelbig.svg";
import Mtn from "../assets/svg/mtnbig.svg";
import Eti from "../assets/svg/9mobilebig.svg";
import Glo from "../assets/svg/globig.svg";
import { BoldText, LightText } from "./common/Text";
import { SPACING } from "../constants/ui";

const RecentServiceTransaction: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { transactions, isLoading } = useWallet();
  const [hasTransaction, setHasTransaction] = useState(false);

  const renderServiceIcon = (
    provider: string | undefined,
    tranxType: string
  ) => {
    // If it's a wallet funding transaction, return the WalletAdd1 icon
    if (tranxType === "WALLET_FUNDING") {
      return <WalletAdd1 size={24} color={COLORS.violet400} />;
    }

    // Otherwise, render icons based on the provider (network type)
    switch (provider?.toLowerCase()) {
      case "airtel":
        return <Airtel width={40} height={40} />;
      case "mtn":
        return <Mtn width={40} height={40} />;
      case "9mobile":
        return <Eti width={40} height={40} />;
      case "glo":
        return <Glo width={40} height={40} />;
      default:
        return;
    }
  };

  useEffect(() => {
    setHasTransaction(transactions.length > 0);
  }, [transactions]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BoldText color="black" size="medium">
          Recent Transactions
        </BoldText>
        <TouchableOpacity
          onPress={() => navigation.navigate("TransactionHistoryScreen")}
        >
          <LightText color="light">View More</LightText>
        </TouchableOpacity>
      </View>

      <View>
        {isLoading ? (
          <View>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.transactionItem}>
                <Skeleton
                  circle
                  width={40}
                  height={40}
                  style={styles.skeletonImage}
                  animation="wave"
                />
                <View style={styles.transactionTextContainer}>
                  <View style={styles.transactionTextRow}>
                    <Skeleton
                      width={RFValue(80)}
                      height={RFValue(16)}
                      style={styles.skeletonText}
                      animation="wave"
                    />
                    <Skeleton
                      width={RFValue(60)}
                      height={RFValue(16)}
                      style={styles.skeletonText}
                      animation="wave"
                    />
                  </View>
                  <View style={[styles.transactionTextRow, { marginTop: 8 }]}>
                    <Skeleton
                      width={RFValue(120)}
                      height={RFValue(12)}
                      style={styles.skeletonText}
                      animation="wave"
                    />
                    <Skeleton
                      width={RFValue(40)}
                      height={RFValue(12)}
                      style={styles.skeletonText}
                      animation="wave"
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : hasTransaction ? (
          transactions
            .slice(0, 3)
            .map(
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
                  <View style={styles.transactionImage}>
                    {renderServiceIcon(
                      transaction.metadata?.networkType,
                      transaction.tranxType
                    )}
                  </View>

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    paddingBottom: SPACING * 14,
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
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
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
  skeletonImage: {
    marginRight: 10,
  },
  skeletonText: {
    borderRadius: 4,
  },
});

export default RecentServiceTransaction;
