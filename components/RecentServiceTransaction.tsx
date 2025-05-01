import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Skeleton } from "@rneui/themed";
import { WalletAdd1 } from "iconsax-react-native";
import useWallet from "../hooks/use-wallet";
import { BoldText, LightText } from "./common/Text";
import COLORS from "../constants/colors";
import SPACING from "../constants/SPACING";
import Airtel from "../assets/svg/airtelbig.svg";
import Mtn from "../assets/svg/mtnbig.svg";
import Eti from "../assets/svg/9mobilebig.svg";
import Glo from "../assets/svg/globig.svg";
import Dstv from "../assets/svg/dstv.svg";
import Gotv from "../assets/svg/gotv.svg";
import Startimes from "../assets/svg/startimes.svg";

interface Transaction {
  _id: string;
  paidOn: string | number | Date;
  transactionType: string;
  amountPaid: number | string;
  paymentStatus: string;
  purpose?: string;
  referenceId?: string;
  metadata?: {
    networkType?: string;
    phoneNumber?: string;
    cableName?: string;
    discoId?: string;
  };
}

type RootStackParamList = {
  TransactionHistoryScreen: undefined;
  TransactionSummaryScreen: { transaction: any };
};

const RecentServiceTransaction: React.FC<{
  navigation: NativeStackNavigationProp<RootStackParamList>;
}> = ({ navigation }) => {
  const { getAllTransactions, error } = useWallet();
  const { transactions, isLoading } = getAllTransactions();
  const [hasTransaction, setHasTransaction] = useState(false);

  const recentTransactions = useMemo(() => {
    if (transactions.length === 0) return [];

    const sortedTransactions = [...transactions].sort((a, b) => {
      return (
        new Date(b.paidOn || 0).getTime() - new Date(a.paidOn || 0).getTime()
      );
    });

    return sortedTransactions.slice(0, 3);
  }, [transactions]);

  useEffect(() => {
    setHasTransaction(transactions.length > 0);
  }, [transactions]);

  const getDiscoIcon = (discoId: string | undefined) => {
    if (!discoId) return null;
    switch (discoId) {
      case "abuja-electric":
        return require("@/assets/images/electricity/abuja.jpeg");
      case "aba-electric":
        return require("@/assets/images/electricity/aba.png");
      case "benin-electric":
        return require("@/assets/images/electricity/benin.jpeg");
      case "eko-electric":
        return require("@/assets/images/electricity/eko.png");
      case "enugu-electric":
        return require("@/assets/images/electricity/enugu.png");
      case "ibadan-electric":
        return require("@/assets/images/electricity/ibadan.jpeg");
      case "ikeja-electric":
        return require("@/assets/images/electricity/ikeja.png");
      case "jos-electric":
        return require("@/assets/images/electricity/jos.jpeg");
      case "kaduna-electric":
        return require("@/assets/images/electricity/kaduna.png");
      case "kano-electric":
        return require("@/assets/images/electricity/kano.jpeg");
      case "yola-electric":
        return require("@/assets/images/electricity/yola.png");
      case "portharcourt-electric":
        return null;
      default:
        return null;
    }
  };

  const renderServiceIcon = (
    provider: string | undefined,
    tranxType: string,
    cableName?: string,
    discoId?: string
  ) => {
    if (tranxType === "WALLET_FUNDING") {
      return <WalletAdd1 size={24} color={COLORS.violet400} />;
    }

    if (tranxType === "CABLE_SUBSCRIPTION" && cableName) {
      const cableLower = cableName.toLowerCase();
      switch (cableLower) {
        case "dstv":
          return <Dstv width={40} height={40} />;
        case "gotv":
          return <Gotv width={40} height={40} />;
        case "startime":
          return <Startimes width={40} height={40} />;
        default:
          return null;
      }
    }

    if (tranxType === "ELECTRICITY_PURCHASE" && discoId) {
      const iconSource = getDiscoIcon(discoId);
      return iconSource ? (
        <Image
          source={iconSource}
          style={styles.discoIcon}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.placeholderIcon} />
      );
    }

    if (!provider) return null;

    const providerLower = provider.toLowerCase();
    switch (providerLower) {
      case "airtel":
        return <Airtel width={40} height={40} />;
      case "mtn":
        return <Mtn width={40} height={40} />;
      case "9mobile":
        return <Eti width={40} height={40} />;
      case "glo":
        return <Glo width={40} height={40} />;
      default:
        return null;
    }
  };

  const renderLoadingSkeleton = () => (
    <View>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.transactionItem}>
          <Skeleton
            circle
            width={40}
            height={40}
            style={{ backgroundColor: COLORS.grey100, marginRight: 10 }}
            skeletonStyle={{ backgroundColor: COLORS.grey50 }}
            animation="wave"
          />
          <View style={styles.transactionTextContainer}>
            <View style={styles.transactionTextRow}>
              <Skeleton
                width={RFValue(80)}
                height={RFValue(16)}
                style={{ backgroundColor: COLORS.grey100, marginRight: 10 }}
                skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                animation="wave"
              />
              <Skeleton
                width={RFValue(60)}
                height={RFValue(16)}
                style={{ backgroundColor: COLORS.grey100, marginRight: 10 }}
                skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                animation="wave"
              />
            </View>
            <View style={[styles.transactionTextRow, { marginTop: 8 }]}>
              <Skeleton
                width={RFValue(120)}
                height={RFValue(12)}
                style={{ backgroundColor: COLORS.grey100, marginRight: 10 }}
                skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                animation="wave"
              />
              <Skeleton
                width={RFValue(40)}
                height={RFValue(12)}
                style={{ backgroundColor: COLORS.grey100, marginRight: 10 }}
                skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                animation="wave"
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.noTransactionContainer}>
      <LottieView
        source={require("../assets/animation/noTransaction.json")}
        autoPlay
        loop
        style={styles.noTransactionAnimation}
      />
      <Text style={styles.notransactionText}>
        You don't have any transactions
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.noTransactionContainer}>
      <Text style={styles.notransactionText}>{error}</Text>
      <TouchableOpacity onPress={() => getAllTransactions().setCurrentPage(1)}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const mapTransactionToSummaryFormat = (transaction: Transaction) => {
    const formattedDate = new Date(transaction.paidOn).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      purpose: transaction.purpose || transaction.transactionType,
      amount: transaction.amountPaid,
      created_at: formattedDate,
      status: transaction.paymentStatus,
      tranxType: transaction.transactionType,
      referenceId: transaction.referenceId || transaction._id,
      metadata: {
        ...transaction.metadata,
        networkType: transaction.metadata?.networkType,
        phoneNumber: transaction.metadata?.phoneNumber,
        cableName: transaction.metadata?.cableName,
        discoId: transaction.metadata?.discoId,
      },
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BoldText color="black" size="medium">
          Recent Transactions
        </BoldText>
        <TouchableOpacity
          onPress={() => navigation.navigate("TransactionHistoryScreen")}
        >
          <LightText color="mediumGrey">View More</LightText>
        </TouchableOpacity>
      </View>

      <View>
        {error
          ? renderErrorState()
          : isLoading
          ? renderLoadingSkeleton()
          : hasTransaction
          ? recentTransactions.map((transaction: Transaction) => {
              const formattedTime = new Date(
                transaction.paidOn
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const networkType = transaction.metadata?.networkType;
              const cableName = transaction.metadata?.cableName;
              const discoId = transaction.metadata?.discoId;

              return (
                <TouchableOpacity
                  key={transaction._id}
                  onPress={() =>
                    navigation.navigate("TransactionSummaryScreen", {
                      transaction: mapTransactionToSummaryFormat(transaction),
                    })
                  }
                  style={styles.transactionItem}
                >
                  <View style={styles.iconContainer}>
                    {renderServiceIcon(
                      networkType,
                      transaction.transactionType,
                      cableName,
                      discoId
                    )}
                  </View>
                  <View style={styles.transactionTextContainer}>
                    <View style={styles.transactionTextRow}>
                      <Text style={styles.item}>
                        {transaction.transactionType}
                      </Text>
                      <Text
                        style={[
                          styles.valueText,
                          {
                            color:
                              transaction.transactionType.includes(
                                "PURCHASE"
                              ) ||
                              transaction.transactionType ===
                                "CABLE_SUBSCRIPTION"
                                ? "black"
                                : "black",
                          },
                        ]}
                      >
                        {transaction.transactionType.includes("PURCHASE") ||
                        transaction.transactionType === "CABLE_SUBSCRIPTION"
                          ? "-"
                          : "+"}{" "}
                        ₦{transaction.amountPaid}
                      </Text>
                    </View>
                    <View style={styles.transactionTextRow}>
                      <Text style={styles.date}>{formattedTime}</Text>
                      <View
                        style={[
                          styles.statusContainer,
                          {
                            backgroundColor:
                              transaction.paymentStatus === "SUCCESS" ||
                              transaction.paymentStatus === "SUCCESSFUL"
                                ? "#E6F9F1"
                                : "#FFEDE9",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.completedText,
                            {
                              color:
                                transaction.paymentStatus === "SUCCESS" ||
                                transaction.paymentStatus === "SUCCESSFUL"
                                  ? "#06C270"
                                  : "#FF3B30",
                            },
                          ]}
                        >
                          {transaction.paymentStatus}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          : renderEmptyState()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === "android" ? SPACING * 25 : SPACING * 38,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#F7F9FC",
  },
  discoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.grey200,
    borderRadius: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
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
    fontSize: RFValue(14),
  },
  valueText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(16),
  },
  date: {
    fontFamily: "Outfit-Regular",
    color: "#9BA1A8",
    fontSize: RFValue(12),
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
    fontSize: RFValue(12),
  },
  noTransactionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING * 8,
  },
  noTransactionAnimation: {
    width: 200,
    height: 200,
  },
  notransactionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
  retryText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
    color: COLORS.violet400,
    marginTop: 10,
  },
});

export default RecentServiceTransaction;
